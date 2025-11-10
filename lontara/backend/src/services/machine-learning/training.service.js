const tf = require("@tensorflow/tfjs"); // ✅ Use this instead of tfjs-node
const fs = require("fs");
const path = require("path");
const config = require("../../config/ml.config");
const preprocessor = require("./preprocessor.service");
const vectorizer = require("./vectorizer.service");

class TrainingService {
  constructor() {
    this.model = null;
    this.vocabulary = null;
  }

  async loadTrainingData() {
    console.log("🔄 Starting model training...");

    const dataPath = config.paths.trainingData;
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Training data not found at ${dataPath}`);
    }

    const rawData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    console.log(`✅ Loaded ${rawData.length} training samples`);

    return rawData;
  }

  splitData(data) {
    const shuffled = data.sort(() => Math.random() - 0.5);
    // ✅ FIX: Change config.training.splitRatio to config.model.splitRatio
    const splitIndex = Math.floor(data.length * config.model.splitRatio);

    return {
      training: shuffled.slice(0, splitIndex),
      validation: shuffled.slice(splitIndex),
    };
  }

  prepareFeatures(emails) {
    const features = [];

    emails.forEach((email) => {
      let combinedText = "";

      if (email.subject) {
        combinedText += email.subject + " ";
      }

      if (email.body) {
        combinedText += email.body + " ";
      }

      if (email.attachments && email.attachments.length > 0) {
        email.attachments.forEach((attachment) => {
          if (attachment.extractedText) {
            combinedText += attachment.extractedText + " ";
          }
        });
      }

      const processedText = preprocessor.preprocess(combinedText);
      features.push(processedText);
    });

    return features;
  }

  featuresToTensors(features) {
    const vectors = features.map((text) =>
      vectorizer.textToVector(text, this.vocabulary)
    );

    return tf.tensor2d(vectors, [vectors.length, config.text.maxVocabSize]);
  }

  labelsToTensors(emails) {
    const labels = emails.map((email) => {
      const index = config.categories.indexOf(email.category);
      const oneHot = new Array(config.categories.length).fill(0);
      oneHot[index] = 1;
      return oneHot;
    });

    return tf.tensor2d(labels, [labels.length, config.categories.length]);
  }

  createModel() {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({
        inputShape: [config.text.maxVocabSize],
        units: config.model.hiddenLayers[0],
        activation: "relu",
      })
    );

    model.add(tf.layers.dropout({ rate: 0.3 }));

    for (let i = 1; i < config.model.hiddenLayers.length; i++) {
      model.add(
        tf.layers.dense({
          units: config.model.hiddenLayers[i],
          activation: "relu",
        })
      );
      model.add(tf.layers.dropout({ rate: 0.3 }));
    }

    model.add(
      tf.layers.dense({
        units: config.model.outputSize,
        activation: "softmax",
      })
    );

    model.compile({
      optimizer: tf.train.adam(config.model.learningRate),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    return model;
  }

  async trainModel() {
    try {
      const allData = await this.loadTrainingData();
      const { training, validation } = this.splitData(allData);

      console.log(`📊 Training set: ${training.length} samples`);
      console.log(`📊 Validation set: ${validation.length} samples`);

      console.log("🔤 Building vocabulary...");
      const allTexts = this.prepareFeatures(allData);
      this.vocabulary = vectorizer.buildVocabulary(allTexts);
      console.log(
        `✅ Vocabulary built: ${Object.keys(this.vocabulary).length} words`
      );

      const vocabPath = config.paths.vocabulary;
      fs.mkdirSync(path.dirname(vocabPath), { recursive: true });
      fs.writeFileSync(vocabPath, JSON.stringify(this.vocabulary, null, 2));
      console.log("💾 Vocabulary saved");

      const trainFeatures = this.prepareFeatures(training);
      const trainTensors = this.featuresToTensors(trainFeatures);
      const trainLabels = this.labelsToTensors(training);

      const valFeatures = this.prepareFeatures(validation);
      const valTensors = this.featuresToTensors(valFeatures);
      const valLabels = this.labelsToTensors(validation);

      console.log("📊 Training data prepared");

      console.log("🧠 Creating neural network model...");
      this.model = this.createModel();
      console.log("✅ Model created");
      this.model.summary();

      console.log("🚀 Starting training...");
      const history = await this.model.fit(trainTensors, trainLabels, {
        epochs: config.model.epochs,
        batchSize: config.model.batchSize,
        validationData: [valTensors, valLabels],
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(
              `Epoch ${epoch + 1}/${config.model.epochs} - ` +
                `loss: ${logs.loss.toFixed(4)} - ` +
                `acc: ${logs.acc.toFixed(4)} - ` +
                `val_loss: ${logs.val_loss.toFixed(4)} - ` +
                `val_acc: ${logs.val_acc.toFixed(4)}`
            );
          },
        },
      });

      console.log("✅ Training completed!");

      // ✅ Save model manually (since tfjs doesn't have native file system support)
      const modelDir = config.paths.modelDir;
      fs.mkdirSync(modelDir, { recursive: true });

      // Save model architecture
      const modelJSON = this.model.toJSON();
      fs.writeFileSync(
        path.join(modelDir, "model.json"),
        JSON.stringify(modelJSON, null, 2)
      );

      // Save weights
      const weights = this.model.getWeights();
      const weightsData = [];

      weights.forEach((weight, idx) => {
        const data = weight.dataSync();
        const array = Array.from(data);
        weightsData.push({
          name: weight.name || `weight_${idx}`,
          shape: weight.shape,
          dtype: weight.dtype,
          data: array,
        });
      });

      fs.writeFileSync(
        path.join(modelDir, "weights.json"),
        JSON.stringify(weightsData, null, 2)
      );

      console.log(`💾 Model saved to: ${modelDir}`);

      trainTensors.dispose();
      trainLabels.dispose();
      valTensors.dispose();
      valLabels.dispose();

      return {
        history: history.history,
        finalLoss: history.history.loss[history.history.loss.length - 1],
        finalAccuracy: history.history.acc[history.history.acc.length - 1],
        epochsTrained: history.epoch.length,
        validationData: validation,
      };
    } catch (error) {
      console.error("❌ Training error:", error);
      throw error;
    }
  }
}

module.exports = new TrainingService();

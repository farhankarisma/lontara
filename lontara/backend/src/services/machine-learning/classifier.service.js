const tf = require("@tensorflow/tfjs");
const fs = require("fs");
const path = require("path");
const config = require("../../config/ml.config");
const preprocessor = require("./preprocessor.service");

class ClassifierService {
  constructor() {
    this.model = null;
    this.vocabulary = null;
    this.categories = config.categories;
    this.isInitialized = false;
  }

  /**
   * Recreate model architecture (same as training)
   */
  createModel() {
    const model = tf.sequential();

    // Input layer
    model.add(
      tf.layers.dense({
        inputShape: [config.text.maxVocabSize],
        units: config.model.hiddenLayers[0],
        activation: "relu",
      })
    );

    model.add(tf.layers.dropout({ rate: 0.3 }));

    // Hidden layers
    for (let i = 1; i < config.model.hiddenLayers.length; i++) {
      model.add(
        tf.layers.dense({
          units: config.model.hiddenLayers[i],
          activation: "relu",
        })
      );
      model.add(tf.layers.dropout({ rate: 0.3 }));
    }

    // Output layer
    model.add(
      tf.layers.dense({
        units: config.model.outputSize,
        activation: "softmax",
      })
    );

    return model;
  }

  /**
   * Initialize classifier by loading model and vocabulary
   */
  async initialize() {
    if (this.isInitialized) {
      console.log("⚠️  Classifier already initialized");
      return;
    }

    try {
      console.log("🔄 Loading model and vocabulary...");

      // Load vocabulary
      const vocabPath = config.paths.vocabulary;
      if (!fs.existsSync(vocabPath)) {
        throw new Error(`Vocabulary not found at ${vocabPath}`);
      }

      this.vocabulary = JSON.parse(fs.readFileSync(vocabPath, "utf8"));
      console.log(
        `✅ Vocabulary loaded: ${Object.keys(this.vocabulary).length} words`
      );

      // ✅ Recreate model architecture
      this.model = this.createModel();

      // ✅ Load weights
      const weightsJSONPath = path.join(config.paths.modelDir, "weights.json");

      if (!fs.existsSync(weightsJSONPath)) {
        throw new Error(`Weights file not found at ${weightsJSONPath}`);
      }

      const weightsData = JSON.parse(fs.readFileSync(weightsJSONPath, "utf8"));

      // Convert to tensors
      const weightTensors = weightsData.map((w) => {
        return tf.tensor(w.data, w.shape, w.dtype);
      });

      // Set weights
      this.model.setWeights(weightTensors);

      console.log("✅ Model loaded successfully");

      this.isInitialized = true;
    } catch (error) {
      console.error("❌ Failed to initialize classifier:", error.message);
      throw error;
    }
  }

  /**
   * Convert text to vector using vocabulary
   */
  textToVector(text) {
    const vector = new Array(config.text.maxVocabSize).fill(0);
    const words = preprocessor.tokenize(text.toLowerCase());

    words.forEach((word) => {
      if (this.vocabulary[word] !== undefined) {
        const index = this.vocabulary[word];
        if (index < config.text.maxVocabSize) {
          vector[index] += 1;
        }
      }
    });

    // Apply normalization
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0)
    );
    if (magnitude > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] /= magnitude;
      }
    }

    return vector;
  }

  /**
   * Classify email
   */
  async classify(emailData) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Extract and preprocess text
      let combinedText = "";

      if (emailData.subject) {
        combinedText += emailData.subject + " ";
      }

      if (emailData.body) {
        combinedText += emailData.body + " ";
      }

      // ✅ UPDATED: Handle both attachment objects and extractedText
      if (emailData.attachments && emailData.attachments.length > 0) {
        emailData.attachments.forEach((attachment) => {
          // If attachment has extractedText (from training data)
          if (attachment.extractedText) {
            combinedText += attachment.extractedText + " ";
          }
          // ✅ NEW: If attachment has filename (from Gmail API)
          if (attachment.filename) {
            combinedText += attachment.filename + " ";
          }
        });
      }

      // ✅ Rule-based pre-processing
      const lowerText = combinedText.toLowerCase();
      const wordCount = lowerText.trim().split(/\s+/).length;

      const keywords = {
        peminjaman: ["pinjam", "peminjaman", "meminjam", "borrow"],
        izin: ["izin", "perizinan", "mengizinkan", "permission"],
        pengaduan: [
          "lapor",
          "pengaduan",
          "complaint",
          "rusak",
          "keluhan",
          "broken",
        ],
      };

      // Preprocess
      const processedText = preprocessor.preprocess(combinedText);

      // Convert to vector
      const vector = this.textToVector(processedText);

      // Make prediction
      const inputTensor = tf.tensor2d([vector], [1, config.text.maxVocabSize]);
      const prediction = this.model.predict(inputTensor);
      const probabilities = await prediction.data();

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      // Get predicted category
      let maxProb = 0;
      let predictedIndex = 0;

      for (let i = 0; i < probabilities.length; i++) {
        if (probabilities[i] > maxProb) {
          maxProb = probabilities[i];
          predictedIndex = i;
        }
      }

      let predictedCategory = this.categories[predictedIndex];
      let confidence = maxProb;
      let ruleOverride = false;

      // ✅ Rule 1: Handle "pinjam" keyword
      if (
        keywords.peminjaman.some((kw) => lowerText.includes(kw)) &&
        !keywords.izin.some((kw) => lowerText.includes(kw))
      ) {
        if (probabilities[0] > 0.001 || wordCount < 10) {
          predictedCategory = "peminjaman";
          confidence = Math.max(0.75, Math.min(0.95, probabilities[0] * 10));
          ruleOverride = true;
          console.log(
            `🔧 Rule override: Detected "pinjam" keyword → peminjaman`
          );
        }
      }

      // ✅ Rule 2: Handle short text with keywords
      if (wordCount < 10 && !ruleOverride) {
        const hasLegitKeywords =
          keywords.peminjaman.some((kw) => lowerText.includes(kw)) ||
          keywords.izin.some((kw) => lowerText.includes(kw)) ||
          keywords.pengaduan.some((kw) => lowerText.includes(kw));

        if (hasLegitKeywords) {
          let maxProb = 0;
          let maxIndex = 0;

          for (let i = 0; i < probabilities.length; i++) {
            if (probabilities[i] > maxProb) {
              maxProb = probabilities[i];
              maxIndex = i;
            }
          }

          predictedCategory = this.categories[maxIndex];
          confidence = Math.max(0.75, maxProb * 5);
          ruleOverride = true;
          console.log(
            `🔧 Rule override: Short text with keywords → ${predictedCategory}`
          );
        }
      }

      // Build confidence scores
      const confidenceScores = {};
      this.categories.forEach((category, index) => {
        confidenceScores[category] = probabilities[index];
      });

      // Update confidenceScores if rule override was applied
      if (ruleOverride) {
        confidenceScores[predictedCategory] = confidence;

        // Normalize scores to sum to 1
        const total = Object.values(confidenceScores).reduce(
          (a, b) => a + b,
          0
        );
        Object.keys(confidenceScores).forEach((key) => {
          confidenceScores[key] = confidenceScores[key] / total;
        });
      }

      return {
        category: predictedCategory,
        confidence: confidence,
        confidenceScores: confidenceScores,
        ruleApplied: ruleOverride,
      };
    } catch (error) {
      console.error("❌ Classification error:", error.message);
      throw error;
    }
  }
  /**
   * Get model info
   */
  getModelInfo() {
    if (!this.isInitialized) {
      return { error: "Model not initialized" };
    }

    return {
      vocabSize: Object.keys(this.vocabulary).length,
      categories: this.categories,
      inputSize: config.text.maxVocabSize,
      isInitialized: this.isInitialized,
    };
  }
}

module.exports = new ClassifierService();

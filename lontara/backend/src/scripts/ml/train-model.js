const trainingService = require("../../services/machine-learning/training.service");
const classifierService = require("../../services/machine-learning/classifier.service");

async function main() {
  console.log("🚀 Starting TensorFlow.js model training...\n");

  try {
    // Train model
    const result = await trainingService.trainModel();

    console.log("\n✅ Training completed successfully!\n");
    console.log("📊 Results:");
    console.log(`Final Loss: ${result.finalLoss.toFixed(4)}`);
    console.log(`Final Accuracy: ${(result.finalAccuracy * 100).toFixed(2)}%`);
    console.log(`Epochs Trained: ${result.epochsTrained}`);

    // Evaluate on validation set
    console.log("\n🧪 Evaluation:");

    // ✅ FIX: Reinitialize classifier to use the newly trained model
    classifierService.isInitialized = false;
    await classifierService.initialize();

    const validationEmails = result.validationData.slice(0, 40); // Test on 40 samples
    let correct = 0;
    const confusionMatrix = {};

    // ✅ UPDATED: Initialize confusion matrix (removed spam)
    const categories = ["peminjaman", "izin", "pengaduan"];
    categories.forEach((cat) => {
      confusionMatrix[cat] = { peminjaman: 0, izin: 0, pengaduan: 0 };
    });

    for (const email of validationEmails) {
      console.log(`🔍 Classifying: ${email.subject.substring(0, 50)}`);

      const prediction = await classifierService.classify(email);
      const actualCategory = email.category;
      const predictedCategory = prediction.category;

      if (actualCategory === predictedCategory) {
        correct++;
      }

      confusionMatrix[actualCategory][predictedCategory]++;
    }

    const accuracy = (correct / validationEmails.length) * 100;

    console.log(`✅ Accuracy: ${accuracy.toFixed(2)}%`);
    console.table(confusionMatrix);
    console.log(`Correct: ${correct}/${validationEmails.length}`);
  } catch (error) {
    console.error("❌ Training failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

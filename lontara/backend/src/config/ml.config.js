const path = require("path");

module.exports = {
  // Model configuration
  model: {
    hiddenLayers: [128, 64, 32],
    outputSize: 3, // ✅ Changed from 4 to 3
    epochs: 50,
    batchSize: 32,
    validationSplit: 0.2,
    learningRate: 0.001,
    splitRatio: 0.8, // ✅ Added: 80% train, 20% validation
  },

  // Text processing
  text: {
    maxVocabSize: 1000,
    minWordFrequency: 2,
    maxSequenceLength: 100,
  },

  // Categories
  categories: ["peminjaman", "izin", "pengaduan"], // ✅ Removed 'spam'

  // Features
  features: {
    useSubject: true,
    useBody: true,
    useAttachments: true,
    minConfidence: 0.7,
  },

  // Paths
  paths: {
    trainingData: path.join(__dirname, "../models/training-data/emails.json"),
    modelDir: path.join(__dirname, "../models/trained"),
    vocabulary: path.join(__dirname, "../models/trained/vocabulary.json"),
  },
};

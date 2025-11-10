const config = require('../../config/ml.config');

class VectorizerService {
  /**
   * Build vocabulary from training texts
   */
  buildVocabulary(texts) {
    const wordFrequency = {};

    // Count word frequencies
    texts.forEach(text => {
      const words = text.split(' ').filter(w => w.length > 0);
      words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    });

    // Filter by minimum frequency and sort by frequency
    const sortedWords = Object.entries(wordFrequency)
      .filter(([_, freq]) => freq >= config.text.minWordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, config.text.maxVocabSize)
      .map(([word]) => word);

    // Create vocabulary mapping (word -> index)
    const vocabulary = {};
    sortedWords.forEach((word, index) => {
      vocabulary[word] = index;
    });

    return vocabulary;
  }

  /**
   * Convert text to vector using vocabulary
   */
  textToVector(text, vocabulary) {
    const vector = new Array(config.text.maxVocabSize).fill(0);
    const words = text.split(' ').filter(w => w.length > 0);

    // Count word occurrences (TF - Term Frequency)
    words.forEach(word => {
      if (vocabulary[word] !== undefined) {
        const index = vocabulary[word];
        if (index < config.text.maxVocabSize) {
          vector[index] += 1;
        }
      }
    });

    // Apply TF-IDF normalization
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] /= magnitude;
      }
    }

    return vector;
  }

  /**
   * Convert batch of texts to vectors
   */
  textsToVectors(texts, vocabulary) {
    return texts.map(text => this.textToVector(text, vocabulary));
  }

  /**
   * Get vocabulary info
   */
  getVocabularyInfo(vocabulary) {
    return {
      size: Object.keys(vocabulary).length,
      words: Object.keys(vocabulary).slice(0, 20), // First 20 words
    };
  }
}

module.exports = new VectorizerService();
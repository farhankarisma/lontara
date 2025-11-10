const natural = require("natural");
const stopword = require("stopword");

class PreprocessorService {
  constructor() {
    this.stemmer = natural.PorterStemmer;
    this.tokenizer = new natural.WordTokenizer();
  }

  /**
   * Tokenize text into words
   */
  tokenize(text) {
    if (!text || typeof text !== "string") return [];
    return this.tokenizer.tokenize(text.toLowerCase());
  }

  /**
   * Remove stopwords from tokens
   */
  removeStopwords(tokens) {
    // Indonesian stopwords
    const indonesianStopwords = [
      "dan",
      "di",
      "ke",
      "dari",
      "yang",
      "untuk",
      "pada",
      "dengan",
      "adalah",
      "ini",
      "itu",
      "atau",
      "tidak",
      "ada",
      "akan",
      "dapat",
      "juga",
      "oleh",
      "saya",
      "kami",
      "anda",
      "mereka",
      "kita",
      "sudah",
      "telah",
      "sedang",
      "maka",
      "jika",
      "karena",
      "sebagai",
      "tersebut",
      "dalam",
      "hingga",
      "serta",
      "tetapi",
      "namun",
      "bahwa",
      "sebuah",
      "suatu",
      "beberapa",
      "seluruh",
      "semua",
      "nya",
      "ku",
      "mu",
      "lah",
      "pun",
      "kah",
    ];

    // ✅ FIX: Use stopword.removeStopwords() method
    // First remove English stopwords
    let filtered = stopword.removeStopwords(tokens);

    // Then remove Indonesian stopwords
    filtered = filtered.filter((token) => !indonesianStopwords.includes(token));

    return filtered;
  }

  /**
   * Apply stemming to tokens
   */
  stem(tokens) {
    return tokens.map((token) => this.stemmer.stem(token));
  }

  /**
   * Remove special characters and numbers
   */
  cleanTokens(tokens) {
    return tokens.filter((token) => {
      // Keep only alphabetic tokens with length > 2
      return /^[a-z]+$/.test(token) && token.length > 2;
    });
  }

  /**
   * Main preprocessing pipeline
   */
  preprocess(text) {
    if (!text || typeof text !== "string") {
      return "";
    }

    // 1. Tokenize
    let tokens = this.tokenize(text);

    // 2. Remove stopwords
    tokens = this.removeStopwords(tokens);

    // 3. Clean tokens (remove special chars, numbers)
    tokens = this.cleanTokens(tokens);

    // 4. Apply stemming
    tokens = this.stem(tokens);

    // Return as string
    return tokens.join(" ");
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text, topN = 10) {
    const tokens = this.tokenize(text);
    const cleaned = this.cleanTokens(this.removeStopwords(tokens));

    // Count frequency
    const frequency = {};
    cleaned.forEach((token) => {
      frequency[token] = (frequency[token] || 0) + 1;
    });

    // Sort by frequency and return top N
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word]) => word);
  }

  /**
   * Calculate text statistics
   */
  getStats(text) {
    const tokens = this.tokenize(text);
    const words = this.cleanTokens(tokens);

    return {
      totalTokens: tokens.length,
      totalWords: words.length,
      uniqueWords: new Set(words).size,
      avgWordLength:
        words.reduce((sum, w) => sum + w.length, 0) / words.length || 0,
    };
  }
}

module.exports = new PreprocessorService();

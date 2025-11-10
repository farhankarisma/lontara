const mlConfig = require('../../config/ml.config');

class FeatureService {
  constructor() {
    this.categoryKeywords = {
      peminjaman: [
        'pinjam', 'booking', 'sewa', 'reservasi', 'pesan',
        'ruang', 'kelas', 'aula', 'tempat', 'fasilitas',
        'proyektor', 'sound', 'borrow', 'rent'
      ],
      izin: [
        'izin', 'cuti', 'sakit', 'leave', 'permission',
        'absent', 'tidak', 'masuk', 'hadir'
      ],
      pengaduan: [
        'pengaduan', 'komplain', 'lapor', 'keluhan', 'complaint',
        'rusak', 'kotor', 'tidak', 'berfungsi', 'masalah',
        'problem', 'issue', 'broken'
      ],
      spam: [
        'hadiah', 'menang', 'gratis', 'diskon', 'promo',
        'congratulations', 'winner', 'prize', 'free', 'offer'
      ]
    };
  }

  /**
   * Extract features from email
   */
  extract(email) {
    const subject = (email.subject || '').toLowerCase();
    const snippet = (email.snippet || '').toLowerCase();
    const body = (email.body || '').toLowerCase();
    const sender = (email.sender || '').toLowerCase();
    
    const allText = `${subject} ${subject} ${snippet} ${body}`;
    
    const features = {};
    
    // 1. Keyword matching scores
    mlConfig.categories.forEach(category => {
      const keywords = this.categoryKeywords[category] || [];
      let score = 0;
      
      keywords.forEach(keyword => {
        const subjectCount = (subject.match(new RegExp(keyword, 'g')) || []).length * 3;
        const snippetCount = (snippet.match(new RegExp(keyword, 'g')) || []).length * 2;
        const bodyCount = (body.match(new RegExp(keyword, 'g')) || []).length;
        score += subjectCount + snippetCount + bodyCount;
      });
      
      features[`keyword_${category}`] = score;
    });
    
    // 2. Structural features
    features.subject_length = subject.length;
    features.body_length = body.length;
    features.has_attachment = email.hasAttachment ? 1 : 0;
    features.exclamation_count = (allText.match(/!/g) || []).length;
    features.question_count = (allText.match(/\?/g) || []).length;
    features.capital_ratio = this.calculateCapitalRatio(subject);
    
    // 3. Sender features
    features.sender_is_internal = sender.includes('@company.com') ? 1 : 0;
    
    // 4. Urgency indicators
    const urgentWords = ['urgent', 'asap', 'segera', 'penting'];
    features.urgency_score = urgentWords.filter(w => allText.includes(w)).length;
    
    // Normalize features
    return this.normalize(features);
  }

  calculateCapitalRatio(text) {
    if (!text || text.length === 0) return 0;
    const capitals = (text.match(/[A-Z]/g) || []).length;
    return capitals / text.length;
  }

  normalize(features) {
    const normalized = {};
    
    Object.keys(features).forEach(key => {
      const value = features[key];
      
      if (key.includes('length')) {
        normalized[key] = Math.min(value / 1000, 1);
      } else if (key.includes('count') || key.includes('score')) {
        normalized[key] = Math.min(value / 10, 1);
      } else {
        normalized[key] = value;
      }
    });
    
    return normalized;
  }

  toArray(features) {
    return Object.keys(features)
      .sort()
      .map(key => features[key]);
  }
}

module.exports = new FeatureService();
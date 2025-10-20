// file: server/utils/crypto.js
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
// Kunci HARUS 32 byte untuk aes-256
const key = crypto
  .createHash('sha256')
  .update(String(process.env.TOKEN_ENCRYPTION_KEY))
  .digest('base64')
  .slice(0, 32);

// Enkripsi
function encrypt(text) {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  // Gabungkan iv, authTag, dan teks terenkripsi untuk disimpan
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

// Dekripsi
function decrypt(hash) {
  try {
    const [ivHex, authTagHex, encryptedText] = hash.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error("Dekripsi gagal:", error);
    return null;
  }
}

module.exports = { encrypt, decrypt };
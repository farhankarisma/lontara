const fs = require("fs");
const { PDFParse, VerbosityLevel } = require("pdf-parse");

class PdfService {
  /**
   * Extract text from PDF file
   */
  async extractFromFile(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);

      const parser = new PDFParse({
        verbosity: VerbosityLevel.ERRORS,
        data: new Uint8Array(dataBuffer),
      });

      await parser.load();

      const doc = parser.doc;
      let fullText = "";

      // ✅ Get page object first, then extract text
      for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
        const page = await doc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      return fullText;
    } catch (error) {
      throw new Error(`Failed to extract PDF: ${error.message}`);
    }
  }

  /**
   * Extract text from base64 encoded PDF
   */
  async extractFromBase64(base64String) {
    try {
      const buffer = Buffer.from(base64String, "base64");

      const parser = new PDFParse({
        verbosity: VerbosityLevel.ERRORS,
        data: new Uint8Array(buffer),
      });

      await parser.load();

      const doc = parser.doc;
      let fullText = "";

      for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
        const page = await doc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      return fullText;
    } catch (error) {
      throw new Error(`Failed to extract PDF from base64: ${error.message}`);
    }
  }

  /**
   * Extract text from buffer
   */
  async extractText(buffer) {
    try {
      const parser = new PDFParse({
        verbosity: VerbosityLevel.ERRORS,
        data: new Uint8Array(buffer),
      });

      await parser.load();

      const doc = parser.doc;
      let fullText = "";

      for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
        const page = await doc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      return fullText;
    } catch (error) {
      throw new Error(`Failed to extract PDF from buffer: ${error.message}`);
    }
  }

  /**
   * Analyze PDF content for keywords
   */
  analyzeContent(text) {
    const lowerText = text.toLowerCase();

    const analysis = {
      peminjaman: {
        keywords: [
          "pinjam",
          "meminjam",
          "peminjaman",
          "booking",
          "reservasi",
          "ruang",
          "gedung",
          "aula",
          "lab",
          "fasilitas",
        ],
        count: 0,
        score: 0,
      },
      izin: {
        keywords: [
          "izin",
          "permohonan",
          "dispensasi",
          "cuti",
          "surat keterangan",
          "surat pengantar",
        ],
        count: 0,
        score: 0,
      },
      pengaduan: {
        keywords: [
          "rusak",
          "kerusakan",
          "komplain",
          "keluhan",
          "pengaduan",
          "laporan",
          "aduan",
          "masalah",
          "gangguan",
        ],
        count: 0,
        score: 0,
      },
      spam: {
        keywords: [
          "win",
          "prize",
          "congratulations",
          "urgent",
          "click here",
          "free",
          "bonus",
          "menang",
          "hadiah",
        ],
        count: 0,
        score: 0,
      },
    };

    Object.entries(analysis).forEach(([category, data]) => {
      data.keywords.forEach((keyword) => {
        const regex = new RegExp(keyword, "gi");
        const matches = lowerText.match(regex);
        if (matches) {
          data.count += matches.length;
        }
      });
      data.score = data.count;
    });

    return analysis;
  }

  /**
   * Get PDF metadata
   */
  async getMetadata(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);

      const parser = new PDFParse({
        verbosity: VerbosityLevel.ERRORS,
        data: new Uint8Array(dataBuffer),
      });

      await parser.load();

      const info = await parser.getInfo();

      return {
        pages: parser.doc.numPages || 0,
        info: info,
        metadata: info.metadata || {},
        version: info.pdfFormatVersion || "",
      };
    } catch (error) {
      throw new Error(`Failed to get PDF metadata: ${error.message}`);
    }
  }
}

module.exports = new PdfService();

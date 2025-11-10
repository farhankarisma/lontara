const express = require('express');
const router = express.Router();
// ✅ FIX: Correct path to classifier service
const classifier = require('../services/machine-learning/classifier.service');

/**
 * @route   POST /api/ml/classify
 * @desc    Classify email into categories
 * @access  Public
 */
router.post('/classify', async (req, res) => {
  try {
    const { subject, body, attachments } = req.body;

    if (!subject && !body) {
      return res.status(400).json({
        success: false,
        message: 'Subject or body is required',
      });
    }

    const emailData = {
      subject: subject || '',
      body: body || '',
      attachments: attachments || [],
    };

    const result = await classifier.classify(emailData);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to classify email',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/ml/classify-batch
 * @desc    Classify multiple emails
 * @access  Public
 */
router.post('/classify-batch', async (req, res) => {
  try {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({
        success: false,
        message: 'Emails array is required',
      });
    }

    const results = await classifier.classifyBatch(emails);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Batch classification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to classify emails',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/ml/model-info
 * @desc    Get model information
 * @access  Public
 */
router.get('/model-info', async (req, res) => {
  try {
    const info = classifier.getModelInfo();

    res.json({
      success: true,
      data: info,
    });
  } catch (error) {
    console.error('Model info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get model info',
      error: error.message,
    });
  }
});

module.exports = router;
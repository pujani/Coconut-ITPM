// Rename file to routes/report.route.js
const express = require('express');
const { createReport, getReports, generateReportPDF,  getStats, buildMatchQuery } = require('../controllers/report.controller');
const router = express.Router();

router.post('/', createReport);
router.get('/', getReports);
router.get('/:id/pdf', generateReportPDF);

// Add to existing routes
router.get('/stats', getStats);

module.exports = router;
// Rename file to routes/report.route.js
const express = require('express');
const { createReport, getReports, generateReportPDF } = require('../controllers/report.controller');
const router = express.Router();

router.post('/', createReport);
router.get('/', getReports);
router.get('/:id/pdf', generateReportPDF);

module.exports = router;
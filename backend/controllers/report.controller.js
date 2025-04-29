const Report = require('../models/report.model');
const errorHandler = require('../utils/error');
const PDFDocument = require('pdfkit');

const createReport = async (req, res, next) => {
  try {
    const { trees, ...reportData } = req.body;
    
    // Calculate affected trees and incentive
    const affectedTrees = trees.filter(t => t.affected).length;
    const incentiveAmount = affectedTrees * 3000;

    const newReport = new Report({
      ...reportData,
      trees,
      incentiveAmount,
      numberOfPlants: trees.length
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { province, district, startDate, endDate } = req.query;
    const query = {};
    
    if (province) query.province = province;
    if (district) query.district = district;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const reports = await Report.find(query);
    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

const generateReportPDF = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    const doc = new PDFDocument();
    
    // PDF Content
    doc.fontSize(18).text('Coconut Tree Disease Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12)
       .text(`Report ID: ${report.uniqueId}`)
       .text(`Submitted By: ${report.fullName}`)
       .text(`Affected Trees: ${report.trees.filter(t => t.affected).length}`)
       .text(`Incentive Amount: LKR ${report.incentiveAmount.toLocaleString()}`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${report.uniqueId}.pdf`);
    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(errorHandler(500, 'Report generation failed'));
  }
};

// Add to existing controller
const getStats = async (req, res) => {
  try {
    const matchQuery = buildMatchQuery(req.query);
    const aggregation = await Report.aggregate([
      { $match: matchQuery },
      { 
        $project: {
          numberOfPlants: 1,
          affectedCount: { $size: { $filter: { input: "$trees", as: "tree", cond: "$$tree.affected" } } }
        }
      },
      {
        $group: {
          _id: null,
          totalInspected: { $sum: "$numberOfPlants" },
          totalAffected: { $sum: "$affectedCount" }
        }
      }
    ]);

    const result = aggregation[0] || { totalInspected: 0, totalAffected: 0 };
    const percentage = result.totalInspected > 0 
      ? (result.totalAffected / result.totalInspected * 100).toFixed(1)
      : 0;

    res.status(200).json({
      totalInspected: result.totalInspected,
      totalAffected: result.totalAffected,
      percentage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const buildMatchQuery = (queryParams) => {
  const { province, district, regionalDivision, gramaNiladari, startDate, endDate } = queryParams;
  const query = {};
  
  if (province) query.province = province;
  if (district) query.district = district;
  if (regionalDivision) query.regionalDivision = regionalDivision;
  if (gramaNiladari) query.gramaNiladari = gramaNiladari;
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  return query;
};

module.exports = { createReport, getReports, generateReportPDF, getStats, buildMatchQuery };
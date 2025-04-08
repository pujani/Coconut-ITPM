const express = require('express');
const multer = require('multer');
const { createAppointment, getAppointments, updateAppointment, deleteAppointment } = require('../controllers/appointments.controller');

const router = express.Router();

router.get("/test", (req,res) => res.send("hiii"));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Routes
router.post('/', upload.array('photos', 5), createAppointment);
router.get('/', getAppointments);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
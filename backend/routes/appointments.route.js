const express = require('express')
const multer = require('multer');
const { createAppointment, getAppointment, updateAppointment, deleteAppointment } = require('../controllers/appointments.controller')

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Save files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Rename files to avoid conflicts
    }
});
  
const upload = multer({ storage: storage });
  
// Use multer middleware for handling file uploads
router.post('/', upload.array('photos', 3), createAppointment); 
router.get('/', getAppointment)   //get total count
router.put('/:id', updateAppointment)  //change appointment status
router.delete('/:id', deleteAppointment)

module.exports = router;
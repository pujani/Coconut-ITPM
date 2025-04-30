const express = require('express');
const multer = require('multer');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose'); // Add mongoose for MongoDB
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Create the 'uploads' folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename files to avoid conflicts
  },
});
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Import the Appointment model
const Appointment = require('./models/appointments.model');

// Email sending route
app.post('/api/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.status(200).send('Email sent successfully');
  });
});

// Appointment creation route with file upload
app.post('/api/appointment', upload.array('photos', 3), async (req, res) => {
  try {
    const {
      fullName,
      province,
      district,
      address,
      extent,
      extentUnit,
      numberOfPlants,
      numberOfPlantsAffected,
      email,
      phone,
      message,
      userId,
    } = req.body;

    // Get file paths from uploaded files
    const photos = req.files.map((file) => file.path);

    // Validate required fields
    if (
      !fullName ||
      !province ||
      !district ||
      !address ||
      !extent ||
      !extentUnit ||
      !numberOfPlants ||
      !numberOfPlantsAffected ||
      !email ||
      !phone ||
      !message ||
      !photos ||
      !userId
    ) {
      return res.status(400).json({ message: 'Please fill out all the fields' });
    }

    // Calculate percentage of affected plants
    const percentageAffected = (numberOfPlantsAffected / numberOfPlants) * 100;

    // Create a new appointment
    const newAppointment = new Appointment({
      fullName,
      province,
      district,
      address,
      extent,
      extentUnit,
      numberOfPlants,
      numberOfPlantsAffected,
      email,
      phone,
      message,
      photos,
      percentageAffected,
      userId,
    });

    // Save the appointment to the database
    const savedAppointment = await newAppointment.save();

    // Send success response
    res.status(201).json({ message: 'Appointment created', savedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const Appointment = require('../models/appointments.model');
const errorHandler = require('../utils/error');

// Create Appointment
const createAppointment = async (req, res, next) => {
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
      userId
    } = req.body;

    // Validate required fields
    if (!fullName || !province || !district || !address || !extent || !extentUnit ||
        !numberOfPlants || !numberOfPlantsAffected || !email || !phone || !message || !userId) {
      return next(errorHandler(400, 'Please fill out all the fields'));
    }

    // Validate uploaded photos
    const photos = req.files.map(file => file.path);
    if (!photos || photos.length === 0) {
      return next(errorHandler(400, 'Please upload at least one photo'));
    }

    // Calculate percentage affected and risk assessment
    const percentageAffected = (numberOfPlantsAffected / numberOfPlants) * 100;
    const riskAssessment = percentageAffected > 40 ? "High" :
                           percentageAffected > 15 ? "Medium" : "Low";

    // Create new appointment
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
      riskAssessment,
      userId
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json({ message: 'Appointment created successfully', savedAppointment });
  } catch (error) {
    next(error);
  }
};

// Update Appointment
const updateAppointment = async (req, res, next) => {
  try {
    const { status, responseMessage, scheduledDate, scheduledTime } = req.body;

    if (status === 'successful') {
      if (!scheduledDate || !scheduledTime || !responseMessage) {
        return next(errorHandler(400, 'Scheduled date, time, and response message are required for approval'));
      }
    }

    const updateFields = { status };
    if (status === 'successful') {
      updateFields.responseMessage = responseMessage;
      updateFields.scheduledDate = new Date(scheduledDate);
      updateFields.scheduledTime = scheduledTime;
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({ message: 'Appointment updated successfully', updatedAppointment });
  } catch (error) {
    next(error);
  }
};

// Delete Appointment
const deleteAppointment = async (req, res, next) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get Appointments
const getAppointments = async (req, res, next) => {
  try {
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const query = {};

    if (req.query.fullName) query.fullName = req.query.fullName;
    if (req.query.appointmentId) query._id = req.query.appointmentId;
    if (req.query.userId) query.userId = req.query.userId;

    const appointments = await Appointment.find(query).sort({ updatedAt: sortDirection });
    res.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
};

module.exports = { createAppointment, updateAppointment, deleteAppointment, getAppointments };

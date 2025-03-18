const Appointment = require('../models/appointments.model');
const errorHandler = require('../utils/error');

const createAppointment = async (req, res, next) => {
  try {
    const { fullName, province, district, address, extent, extentUnit, numberOfPlants, numberOfPlantsAffected, email, phone, message, userId } = req.body;
    
    // Get file paths from uploaded files
    const photos = req.files.map(file => file.path);

    if (!fullName || !province || !district || !address || !extent || !extentUnit || !numberOfPlants || !numberOfPlantsAffected || !email || !phone || !message || !photos || !userId) {
      return next(errorHandler(400, 'Please fill out all the fields'));
    }

    const percentageAffected = (numberOfPlantsAffected / numberOfPlants) * 100;

    const newAppointment = await Appointment({
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
      userId
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json({ message: 'Appointment created', savedAppointment });
  } catch (error) {
    next(error);
  }
};

const getAppointment = async (req, res, next) => {
  try {
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const query = {};

    if (req.query.fullName) {
      query.fullName = req.query.fullName;
    }

    if (req.query.appointmentId) {
      query._id = req.query.appointmentId;
    }

    if (req.query.userId) {
      query.userId = req.query.userId;
    }

    const totalAppointments = await Appointment.countDocuments();
    const appointment = await Appointment.find(query).sort({ updatedAt: sortDirection });
    res.status(200).json({ appointment, totalAppointments });
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const { fullName, province, district, address, extent, extentUnit, numberOfPlants, numberOfPlantsAffected, email, phone, message, photos, status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, {
      $set: {
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
        status
      }
    }, { new: true });

    res.status(200).json({ message: 'Updated successfully', updatedAppointment });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Appointment has been deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createAppointment, getAppointment, updateAppointment, deleteAppointment };
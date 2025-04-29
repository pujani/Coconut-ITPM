import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// Load environment variables
dotenv.config();

// Debug: Check if MONGODB_CONNECTION is loading correctly
console.log("MongoDB Connection String:", process.env.MONGODB_CONNECTION);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Database connected successfully...'))
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);  // Exit the process if MongoDB connection fails
});

// Initialize Express
const app = express();

// Middleware
app.use(cors());  // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import reportRouter from './routes/report.route.js'; // Use ES Modules import
import appointmentRouter from './routes/appointments.route.js'; // Use ES Modules import
import authRouter from './routes/auth.route.js'; // Use ES Modules import
import locationRouter from './routes/location.route.js'; // Use ES Modules import

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.use('/api/reports', reportRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/auth', authRouter);
app.use('/api/location', locationRouter);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

console.log('Report Router:', reportRouter);
console.log('Location Router:', locationRouter);
console.log('Auth Router:', authRouter);
console.log('Appointment Router:', appointmentRouter);

// Start the Server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
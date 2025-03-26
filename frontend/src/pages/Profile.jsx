import React, { useEffect, useState } from 'react';
import { Card, Badge, Button } from 'flowbite-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaFileDownload } from 'react-icons/fa';
import { IoCheckmarkCircleOutline, IoTimeOutline } from 'react-icons/io5';
import { FiUser, FiPhone, FiBriefcase, FiMessageSquare, FiCalendar, FiClock, FiHome } from 'react-icons/fi';
import jsPDF from 'jspdf';

export default function Profile() {
  const [appointments, setAppointments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`/api/appointment?userId=${currentUser._id}`);
        setAppointments(data.appointments); // Corrected line
      } catch (error) {
        console.error(error);
      }
    };
    fetchAppointments();
  }, [currentUser._id]);

  const calculateRiskAssessment = (percentage) => {
    if (percentage > 40) return 'High';
    if (percentage > 25) return 'Medium';
    return 'Low';
  };

  const generatePDF = (appointment) => {
    const pdf = new jsPDF();

    // PDF Content
    pdf.setFontSize(18);
    pdf.text('Appointment Confirmation', 20, 20);

    // Add actual appointment details
    pdf.setFontSize(12);
    pdf.text(`Name: ${appointment.fullName}`, 20, 30);
    pdf.text(`Scheduled Date: ${appointment.scheduledDate ? new Date(appointment.scheduledDate).toLocaleDateString() : 'Not Scheduled'}`, 20, 40);
    pdf.text(`Scheduled Time: ${appointment.scheduledTime || 'Not Scheduled'}`, 20, 50);
    pdf.text(`Officer Message: ${appointment.responseMessage || 'No Message'}`, 20, 60);

    pdf.save(`appointment-confirmation-${appointment._id}.pdf`);
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <FiCalendar className="mr-2 text-blue-600" />
        My Appointments
      </h1>

      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <Card
            key={appointment._id}
            className="mb-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col space-y-4">
              {/* Status Header */}
              <div className="flex justify-between items-start">
                <Badge
                  color={appointment.status === 'pending' ? 'warning' : 'success'}
                  icon={appointment.status === 'pending' ? IoTimeOutline : IoCheckmarkCircleOutline}
                  className="w-fit"
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Badge>

                {appointment.status === "successful" && (
                  <Button
                    onClick={() => generatePDF(appointment)}
                    color="success"
                    size="sm"
                  >
                    <FaFileDownload className="mr-2" />
                    Download Confirmation
                  </Button>
                )}
              </div>

              {/* Appointment Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Left Column */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FiUser className="text-gray-500 mr-2" />
                    <span className="font-medium">Name:</span>
                    <span className="ml-2">{appointment.fullName}</span>
                  </div>

                  <div className="flex items-center">
                    <FiPhone className="text-gray-500 mr-2" />
                    <span className="font-medium">Contact:</span>
                    <span className="ml-2">{appointment.phone}</span>
                  </div>

                  <div className="flex items-center">
                    <FiHome className="text-gray-500 mr-2" />
                    <span className="font-medium">Address:</span>
                    <span className="ml-2">{appointment.address}</span>
                  </div>

                  <div className="flex items-center">
                    <FiCalendar className="text-gray-500 mr-2" />
                    <span className="font-medium">Created Date:</span>
                    <span className="ml-2">{new Date(appointment.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center">
                    <FiClock className="text-gray-500 mr-2" />
                    <span className="font-medium">Created Time:</span>
                    <span className="ml-2">{new Date(appointment.createdAt).toLocaleTimeString()}</span>
                  </div>

                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium">Land Extent:</span>
                    <span className="ml-2">{appointment.extent} {appointment.extentUnit}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-medium">Number of Plants:</span>
                    <span className="ml-2">{appointment.numberOfPlants}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-medium">Due to your observations,</span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-medium">Affected Plants:</span>
                    <span className="ml-2">{appointment.numberOfPlantsAffected}</span>
                  </div>

                  <div className="flex items-center">
                    <span className="font-medium">Percentage of Disease Affected:</span>
                    <span className="ml-2">{appointment.percentageAffected?.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Risk Assesment:</span>
                    <p>
                      <span className={`px-2 py-1 ml-2 rounded ${appointment.riskAssessment === 'High' ? 'bg-red-200' :
                        appointment.riskAssessment === 'Medium' ? 'bg-yellow-200' : 'bg-green-200'}`}>
                        {appointment.riskAssessment}
                      </span>
                    </p>
                  </div>
                </div>


                {/* Scheduled Section */}
                <div className="mt-4">
                  <p className="font-semibold">
                    {appointment.status === 'pending' ? (
                      <span className="text-yellow-600">Scheduled soon</span>
                    ) : (
                      <>
                        Scheduled Date: {appointment.scheduledDate ? new Date(appointment.scheduledDate).toLocaleDateString() : 'Not Scheduled'}
                        <br />
                        Scheduled Time: {appointment.scheduledTime || 'Not Scheduled'}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Message Section */}
              {appointment.message && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FiMessageSquare className="text-gray-500 mr-2" />
                    <span className="font-medium">Your Message:</span>
                  </div>
                  <p className="text-gray-700 italic">"{appointment.message}"</p>
                </div>
              )}

              {/* Approval Notice */}
              {appointment.status === "successful" && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800">
                    Due to the widespread coconut leaf wilt disease in your area, a CT Officer visit has been scheduled for your plantation. Please download and keep this appointment confirmation.
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))
      ) : (
        <Card className="text-center py-12">
          <FiCalendar className="mx-auto text-gray-400 text-3xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No appointments found</h3>
          <p className="text-gray-500 mt-2">You don't have any scheduled appointments yet.</p>
        </Card>
      )}
    </div>
  );
}

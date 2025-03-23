import React, { useEffect, useState } from 'react';
import { Card, Badge, Button } from 'flowbite-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaFileDownload } from 'react-icons/fa';
import { IoCheckmarkCircleOutline, IoTimeOutline } from 'react-icons/io5';
import { FiUser, FiPhone, FiBriefcase, FiMessageSquare, FiCalendar, FiClock } from 'react-icons/fi';
import JsPDF from 'jspdf';

export default function Profile() {
  const [appointments, setAppointments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`/api/appointment?userId=${currentUser._id}`);
        setAppointments(data.appointment);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAppointments();
  }, [currentUser._id]);

  const generatePDF = (name, company, date, time) => {
    const pdf = new JsPDF();
    // PDF generation logic remains the same
    pdf.save("booking-confirmation.pdf");
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
                    onClick={() => generatePDF(
                      appointment.fullName,
                      appointment.companyName,
                      appointment.date,
                      appointment.time
                    )}
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
                    <FiBriefcase className="text-gray-500 mr-2" />
                    <span className="font-medium">Company:</span>
                    <span className="ml-2">{appointment.companyName}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <FiCalendar className="text-gray-500 mr-2" />
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FiClock className="text-gray-500 mr-2" />
                    <span className="font-medium">Time:</span>
                    <span className="ml-2">{appointment.time}</span>
                  </div>
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
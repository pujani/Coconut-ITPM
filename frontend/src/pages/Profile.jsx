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
        setAppointments(data.appointments);
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
    // Create a new PDF document
    const pdf = new jsPDF();
    
    // Set document properties
    pdf.setProperties({
      title: 'Appointment Confirmation: CT Officer Visit',
      subject: 'Coconut Plantation Inspection',
      author: 'Coconut GuardSL',
      creator: 'Coconut GuardSL System'
    });
    
    // Define formatting variables
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Add header/logo placeholder
    pdf.setFillColor(12, 74, 110); // Dark blue header
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    // Title text
    pdf.setTextColor(255, 255, 255); // White text
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('COCONUT GUARDSL', pageWidth / 2, 20, { align: 'center' });
    
    // Appointment confirmation heading
    pdf.setTextColor(12, 74, 110); // Dark blue text
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Appointment Confirmation: CT Officer Visit', margin, 45);
    
    // Add a line under the heading
    pdf.setDrawColor(12, 74, 110);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 48, pageWidth - margin, 48);
    
    // Reset text color to black for content
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    // Greeting
    const greeting = `Dear ${appointment.fullName},`;
    pdf.text(greeting, margin, 60);
    
    // Introduction text
    const intro = 'This is to confirm your scheduled appointment with our CT Officer.';
    pdf.text(intro, margin, 70);
    
    // Appointment details - section title
    pdf.setFont('helvetica', 'bold');
    pdf.text('Appointment Details', margin, 85);
    pdf.setFont('helvetica', 'normal');
    
    // Format date if it exists
    const formattedDate = appointment.scheduledDate 
      ? new Date(appointment.scheduledDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'To be confirmed';
    
    // Appointment details
    pdf.text(`Date: ${formattedDate}`, margin + 10, 95);
    pdf.text(`Time: ${appointment.scheduledTime || 'To be confirmed'}`, margin + 10, 105);
    pdf.text('Purpose: CT Officer Inspection Visit', margin + 10, 115);
    
    // Main content paragraph with line wrapping
    const paragraph = 'As arranged, our CT Officer will be visiting your coconut land to conduct a detailed inspection. Each coconut tree will be individually assessed to ensure optimal health and productivity.';
    
    const splitParagraph = pdf.splitTextToSize(paragraph, contentWidth);
    pdf.text(splitParagraph, margin, 130);
    
    // Important note with emoji-like symbol
    const yPosition = 130 + (splitParagraph.length * 5);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Please download and keep this document as proof of your scheduled visit.', margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    
    const note = 'It may be required for verification purposes during the inspection.';
    pdf.text(note, margin, yPosition + 10);
    
    // Additional info about rescheduling
    const additionalInfo = 'If you have any questions or need to reschedule, feel free to contact us in advance.';
    pdf.text(additionalInfo, margin, yPosition + 25);
    
    // Thank you note
    pdf.text('Thank you for your cooperation.', margin, yPosition + 40);
    
    // Closing and signature
    pdf.text('Best regards,', margin, yPosition + 55);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Coconut GuardSL', margin, yPosition + 65);
    
    // Add plantation details in a box
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, yPosition + 75, contentWidth, 60);
    
    pdf.setFontSize(11);
    pdf.text('Plantation Details:', margin + 5, yPosition + 85);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Land Extent: ${appointment.extent} ${appointment.extentUnit}`, margin + 10, yPosition + 95);
    pdf.text(`Total Number of Plants: ${appointment.numberOfPlants}`, margin + 10, yPosition + 105);
    pdf.text(`Affected Plants: ${appointment.numberOfPlantsAffected}`, margin + 10, yPosition + 115);
    pdf.text(`Risk Assessment: ${appointment.riskAssessment || calculateRiskAssessment(appointment.percentageAffected)}`, margin + 10, yPosition + 125);
    
    // Add footer with page number and date
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    const today = new Date().toLocaleDateString();
    pdf.text(`Generated on: ${today}`, margin, 285);
    pdf.text(`Appointment ID: ${appointment._id}`, pageWidth - margin, 285, { align: 'right' });
    
    // Save the PDF
    pdf.save(`CoconutGuardSL-Appointment-${appointment._id}.pdf`);
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
                    <span className="font-medium">Risk Assessment:</span>
                    <p>
                      <span className={`px-2 py-1 ml-2 rounded ${appointment.riskAssessment === 'High' ? 'bg-red-200' :
                        appointment.riskAssessment === 'Medium' ? 'bg-yellow-200' : 'bg-green-200'}`}>
                        {appointment.riskAssessment || calculateRiskAssessment(appointment.percentageAffected)}
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
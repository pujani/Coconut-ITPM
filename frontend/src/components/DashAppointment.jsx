import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Avatar, Badge, Button, Card, TextInput, Label, Select, Textarea, Modal, Spinner, Progress } from "flowbite-react";
import { IoTrashBinOutline, IoCheckmarkCircleOutline, IoCalendarOutline, IoLeafOutline } from "react-icons/io5";
import { CgSearch } from "react-icons/cg";
import { FiFilter, FiMessageSquare, FiCalendar, FiPhone, FiMail } from "react-icons/fi";
import { MdOutlinePhotoLibrary, MdLocationOn, MdOutlineNature } from "react-icons/md";
import { HiOutlineClock, HiOutlineStatusOnline } from "react-icons/hi";
import { BsFillGridFill, BsListUl, BsTree } from "react-icons/bs";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DashAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState("cards"); // "cards" or "list"
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const itemsPerPage = 5;

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    successful: 0,
    highRisk: 0
  });

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/appointment");
        setAppointments(data.appointment);
        setFilteredAppointments(data.appointment);
        
        // Calculate stats
        const totalCount = data.appointment.length;
        const pendingCount = data.appointment.filter(app => app.status === "pending").length;
        const successfulCount = data.appointment.filter(app => app.status === "successful").length;
        const highRiskCount = data.appointment.filter(app => {
          const percentage = (app.affectedPlants / app.numberOfPlants) * 100;
          return percentage > 30;
        }).length;
        
        setStats({
          total: totalCount,
          pending: pendingCount,
          successful: successfulCount,
          highRisk: highRiskCount
        });
      } catch (error) {
        console.error("Error fetching appointments:", error);
        Swal.fire("Error!", "Failed to load appointments. Please refresh the page.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...appointments];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(appointment =>
        appointment.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.message?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(appointment => {
        const appDate = new Date(appointment.date);
        return appDate >= startDate && appDate <= endDate;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(appointment => 
        appointment.status === statusFilter
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredAppointments(filtered);
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, statusFilter, sortOrder, appointments]);

  // Calculate disease percentage
  const calculateDiseasePercentage = (appointment) => {
    if (!appointment.numberOfPlants || !appointment.affectedPlants) return 0;
    return ((appointment.affectedPlants / appointment.numberOfPlants) * 100).toFixed(2);
  };

  // Calculate risk level
  const getRiskLevel = (percentage) => {
    if (percentage >= 50) return { level: "High", color: "red" };
    if (percentage >= 20) return { level: "Medium", color: "yellow" };
    return { level: "Low", color: "green" };
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Delete appointment handler
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/appointment/${id}`);
        setAppointments(prev => prev.filter(p => p._id !== id));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          pending: prev.pending - (appointments.find(a => a._id === id).status === "pending" ? 1 : 0),
          successful: prev.successful - (appointments.find(a => a._id === id).status === "successful" ? 1 : 0)
        }));
        
        Swal.fire("Deleted!", "Appointment has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Delete failed. Please try again.", "error");
      }
    }
  };

  // Update appointment status
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`/api/appointment/${id}`, { status: newStatus });
      
      // Update local state
      setAppointments(prev => prev.map(app => 
        app._id === id ? { ...app, status: newStatus } : app
      ));
      
      // Update stats
      if (newStatus === "successful") {
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          successful: prev.successful + 1
        }));
      }
      
      Swal.fire("Updated!", "Status has been updated.", "success");
    } catch (error) {
      Swal.fire("Error!", "Update failed. Please try again.", "error");
    }
  };

  // Send response message
  const handleSendResponse = async () => {
    if (!responseMessage.trim()) {
      Swal.fire("Error!", "Please enter a response message.", "error");
      return;
    }
    
    try {
      // You would typically send this message to the API
      await axios.post(`/api/appointment/${selectedAppointment._id}/response`, { 
        message: responseMessage 
      });
      
      // Close modal and clear response
      setShowModal(false);
      setResponseMessage("");
      
      Swal.fire("Success!", "Response sent to the farmer.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to send response. Please try again.", "error");
    }
  };

  // Open response modal
  const openResponseModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon, color }) => (
    <Card className="text-center p-4">
      <div className={`mx-auto text-${color}-500 mb-2 text-3xl`}>
        {icon}
      </div>
      <h5 className="text-xl font-bold tracking-tight text-gray-900">{value}</h5>
      <p className="font-normal text-gray-700">{title}</p>
    </Card>
  );

  // Appointment Card Component
  const AppointmentCard = ({ appointment }) => {
    const diseasePercentage = calculateDiseasePercentage(appointment);
    const riskLevel = getRiskLevel(diseasePercentage);
    
    return (
      <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow border-t-4" 
            style={{ borderTopColor: riskLevel.color === "red" ? "#EF4444" : 
                                     riskLevel.color === "yellow" ? "#F59E0B" : "#10B981" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Avatar 
                  rounded 
                  placeholderInitials={appointment.fullName?.charAt(0) || "F"}
                  className="mr-3"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{appointment.fullName}</h3>
                  <p className="text-sm text-gray-500">
                    <IoCalendarOutline className="inline mr-1" />
                    {formatDate(appointment.date)}
                  </p>
                </div>
              </div>
              <Badge 
                color={appointment.status === 'pending' ? 'warning' : 'success'}
                className="text-sm"
              >
                <HiOutlineStatusOnline className="mr-1" />
                {appointment.status === 'pending' ? 'Pending' : 'Approved'}
              </Badge>
            </div>

            <div className="flex items-start">
              <MdLocationOn className="text-gray-500 mt-1 mr-2 text-lg" />
              <div>
                <Label className="text-sm text-gray-500">Location</Label>
                <p className="font-medium">{appointment.province}, {appointment.district}</p>
                <p className="text-sm text-gray-600">{appointment.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                <Label className="text-sm text-gray-500">Acres</Label>
                <p className="font-medium text-center">{appointment.acres}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <Label className="text-sm text-gray-500">Roods</Label>
                <p className="font-medium text-center">{appointment.roods}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <Label className="text-sm text-gray-500">Perches</Label>
                <p className="font-medium text-center">{appointment.perches}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center">
                <FiPhone className="text-gray-500 mr-1" />
                <p className="font-medium">{appointment.phone}</p>
              </div>
              <div className="flex items-center">
                <FiMail className="text-gray-500 mr-1" />
                <p className="font-medium">{appointment.email}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <BsTree className="text-green-700 mr-2" />
                  <Label className="text-sm font-medium">Coconut Plantation Health</Label>
                </div>
                <Badge color={riskLevel.color === "red" ? "failure" : 
                            riskLevel.color === "yellow" ? "warning" : "success"}>
                  {riskLevel.level} Risk
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-500">Total Plants</Label>
                    <p className="font-medium">{appointment.numberOfPlants}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    <IoLeafOutline className="text-green-700 mr-2" />
                    <Progress 
                      progress={100} 
                      color="green"
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-500">Affected Plants</Label>
                    <p className="font-medium">{appointment.affectedPlants}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    <MdOutlineNature className="text-red-700 mr-2" />
                    <Progress 
                      progress={(appointment.affectedPlants / appointment.numberOfPlants) * 100} 
                      color={riskLevel.color === "red" ? "red" : 
                             riskLevel.color === "yellow" ? "yellow" : "green"}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Label className="text-sm text-gray-500">Disease Impact</Label>
                <p className={`text-${riskLevel.color === "red" ? "red" : 
                                       riskLevel.color === "yellow" ? "yellow" : "green"}-600 font-bold text-lg`}>
                  {diseasePercentage}%
                </p>
              </div>
            </div>

            {appointment.photos?.length > 0 && (
              <div>
                <Label className="text-sm text-gray-500 flex items-center">
                  <MdOutlinePhotoLibrary className="mr-1" />
                  Photo Evidence
                </Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {appointment.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Appointment ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => window.open(photo, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                        <MdOutlinePhotoLibrary className="text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm text-gray-500 flex items-center">
                <FiMessageSquare className="mr-1" />
                Farmer's Message
              </Label>
              <div className="bg-gray-50 p-3 rounded-lg mt-1 italic text-gray-700">
                "{appointment.message}"
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
          <Button
            color="light"
            onClick={() => openResponseModal(appointment)}
            className="hover:scale-105 transition-transform"
          >
            <FiMessageSquare className="mr-2" />
            Respond
          </Button>
          <Button
            color="failure"
            onClick={() => handleDelete(appointment._id)}
            className="hover:scale-105 transition-transform"
          >
            <IoTrashBinOutline className="mr-2" />
            Delete
          </Button>
          {appointment.status === 'pending' && (
            <Button
              color="success"
              onClick={() => handleStatusUpdate(appointment._id, 'successful')}
              className="hover:scale-105 transition-transform"
            >
              <IoCheckmarkCircleOutline className="mr-2" />
              Approve
            </Button>
          )}
        </div>
      </Card>
    );
  };

  // Appointment Table Row Component
  const AppointmentRow = ({ appointment }) => {
    const diseasePercentage = calculateDiseasePercentage(appointment);
    const riskLevel = getRiskLevel(diseasePercentage);
    
    return (
      <tr className="hover:bg-gray-50">
        <td className="py-3 px-4">
          <div className="flex items-center">
            <Avatar 
              rounded 
              placeholderInitials={appointment.fullName?.charAt(0) || "F"}
              className="mr-2"
              size="sm"
            />
            <div>
              <p className="font-medium">{appointment.fullName}</p>
              <p className="text-xs text-gray-500">{appointment.email}</p>
            </div>
          </div>
        </td>
        <td className="py-3 px-4">
          <Badge 
            color={appointment.status === 'pending' ? 'warning' : 'success'}
            className="text-xs"
          >
            {appointment.status}
          </Badge>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center">
            <MdLocationOn className="text-gray-500 mr-1" />
            <span>{appointment.province}, {appointment.district}</span>
          </div>
        </td>
        <td className="py-3 px-4">
          {formatDate(appointment.date)}
        </td>
        <td className="py-3 px-4">
          <Badge 
            color={riskLevel.color === "red" ? "failure" : 
                  riskLevel.color === "yellow" ? "warning" : "success"}
          >
            {diseasePercentage}%
          </Badge>
        </td>
        <td className="py-3 px-4">
          <div className="flex gap-2 justify-end">
            <Button size="xs" onClick={() => openResponseModal(appointment)}>
              <FiMessageSquare />
            </Button>
            {appointment.status === 'pending' && (
              <Button size="xs" color="success" onClick={() => handleStatusUpdate(appointment._id, 'successful')}>
                <IoCheckmarkCircleOutline />
              </Button>
            )}
            <Button size="xs" color="failure" onClick={() => handleDelete(appointment._id)}>
              <IoTrashBinOutline />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  // Pagination controls
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mx-4 my-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
        <BsTree className="mr-2 text-green-700" />
        Coconut Technician Appointments
      </h1>
      <p className="text-gray-600 mb-8">
        Manage and respond to farmer's appointment requests for coconut plantation inspection
      </p>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Appointments" 
          value={stats.total} 
          icon={<IoCalendarOutline />} 
          color="blue" 
        />
        <StatCard 
          title="Pending Appointments" 
          value={stats.pending} 
          icon={<HiOutlineClock />} 
          color="yellow" 
        />
        <StatCard 
          title="Approved Appointments" 
          value={stats.successful} 
          icon={<IoCheckmarkCircleOutline />} 
          color="green" 
        />
        <StatCard 
          title="High Risk Plantations" 
          value={stats.highRisk} 
          icon={<MdOutlineNature />} 
          color="red" 
        />
      </div>

      {/* Filters Section */}
      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <TextInput
              icon={CgSearch}
              placeholder="Search by name, email, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-500" />
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={([start, end]) => {
                setStartDate(start);
                setEndDate(end);
              }}
              placeholderText="Select date range"
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <Select
            icon={FiFilter}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="successful">Approved</option>
          </Select>

          <div className="flex gap-2">
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="flex-grow"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </Select>
            <div className="flex border rounded-lg">
              <Button 
                color={viewType === "cards" ? "blue" : "light"}
                onClick={() => setViewType("cards")}
                className="rounded-r-none"
              >
                <BsFillGridFill />
              </Button>
              <Button 
                color={viewType === "list" ? "blue" : "light"}
                onClick={() => setViewType("list")}
                className="rounded-l-none"
              >
                <BsListUl />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <IoCalendarOutline className="mx-auto text-gray-400 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No appointments found</h3>
              <p className="text-gray-500">
                {searchQuery || statusFilter !== "all" || (startDate && endDate) ? 
                  "Try adjusting your filters to see more results." :
                  "There are no appointments in the system yet."}
              </p>
            </Card>
          ) : (
            <>
              {/* Appointments List */}
              {viewType === "cards" ? (
                <div className="space-y-6">
                  {paginatedAppointments.map((appointment) => (
                    <AppointmentCard key={appointment._id} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 text-left">Farmer</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Location</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Disease %</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAppointments.map((appointment) => (
                          <AppointmentRow key={appointment._id} appointment={appointment} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* Pagination */}
              {filteredAppointments.length > itemsPerPage && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    <Button
                      color="light"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, Math.ceil(filteredAppointments.length / itemsPerPage)) }, (_, i) => {
                      const pageNumber = currentPage > 3 && Math.ceil(filteredAppointments.length / itemsPerPage) > 5 
                        ? currentPage - 3 + i + 1 
                        : i + 1;
                        
                      if (pageNumber <= Math.ceil(filteredAppointments.length / itemsPerPage)) {
                        return (
                          <Button
                            key={pageNumber}
                            color={currentPage === pageNumber ? "blue" : "light"}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      }
                      return null;
                    })}
                    
                    <Button
                      color="light"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAppointments.length / itemsPerPage)))}
                      disabled={currentPage === Math.ceil(filteredAppointments.length / itemsPerPage)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Response Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          Respond to {selectedAppointment?.fullName}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="farmerMessage" value="Farmer's Message" />
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-700 italic">
                "{selectedAppointment?.message}"
              </div>
            </div>
            
            <div>
              <Label htmlFor="responseMessage" value="Your Response" />
              <Textarea
                id="responseMessage"
                placeholder="Type your response to the farmer here..."
                rows={5}
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSendResponse}>Send Response</Button>
          <Button color="light" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
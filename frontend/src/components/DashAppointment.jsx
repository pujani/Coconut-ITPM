import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Avatar,
  Badge,
  Button,
  Card,
  TextInput,
  Label,
  Select,
  Textarea,
  Modal,
  Spinner,
  Progress,
} from "flowbite-react";
import {
  IoTrashBinOutline,
  IoCheckmarkCircleOutline,
  IoCalendarOutline,
  IoLeafOutline,
} from "react-icons/io5";
import { CgSearch } from "react-icons/cg";
import {
  FiFilter,
  FiMessageSquare,
  FiCalendar,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import {
  MdOutlinePhotoLibrary,
  MdLocationOn,
  MdOutlineNature,
} from "react-icons/md";
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
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [scheduledTime, setScheduledTime] = useState("10:00");
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
        setAppointments(data.appointments); // Corrected line
        setFilteredAppointments(data.appointments); // Corrected line

        // Calculate stats
        const totalCount = data.appointments?.length || 0;
        const pendingCount = data.appointments?.filter(app => app.status === "pending")?.length || 0;
        const successfulCount = data.appointments?.filter(app => app.status === "successful")?.length || 0;
        const highRiskCount = data.appointments?.filter(app => {
          const percentage = (app.numberOfPlantsAffected / app.numberOfPlants) * 100;
          return percentage > 30;
        })?.length || 0;

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
        const appDate = new Date(appointment.createdAt);
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
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredAppointments(filtered);
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, statusFilter, sortOrder, appointments]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  // Calculate disease percentage
  const calculateDiseasePercentage = (appointment) => {
    if (!appointment?.numberOfPlants || !appointment?.numberOfPlantsAffected) return 0;
    return ((appointment.numberOfPlantsAffected / appointment.numberOfPlants) * 100).toFixed(2);
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
          pending: prev.pending - (appointments.find(a => a._id === id)?.status === "pending" ? 1 : 0),
          successful: prev.successful - (appointments.find(a => a._id === id)?.status === "successful" ? 1 : 0)
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
      const payload = { status: newStatus };
      const response = await axios.put(`/api/appointment/${id}`, payload);

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
      console.error(error);
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
      await axios.put(`/api/appointment/${selectedAppointment._id}`, {
        status: "successful",
        responseMessage: responseMessage,
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime
      });

      // Close modal and clear response
      setShowModal(false);
      setResponseMessage("");

      Swal.fire("Success!", "Response sent to the farmer.", "success");
    } catch (error) {
      console.error(error)
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
        style={{
          borderTopColor: riskLevel.color === "red" ? "#EF4444" :
            riskLevel.color === "yellow" ? "#F59E0B" : "#10B981"
        }}>
        <div className="grid grid-cols-1  gap-6">
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
                    {formatDate(appointment.createdAt)}
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

            {/* Acres, Roods and Perches are missing from the Schema */}

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
                    <p className="font-medium">{appointment.numberOfPlantsAffected}</p>
                  </div>
                  <div className="flex items-center mt-1">
                    <MdOutlineNature className="text-red-700 mr-2" />
                    <Progress
                      progress={(appointment.numberOfPlantsAffected / appointment.numberOfPlants) * 100}
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
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700 italic">{appointment.message}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" color="failure" onClick={() => handleDelete(appointment._id)}>
                <IoTrashBinOutline className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button size="sm" color="success" onClick={() => handleStatusUpdate(appointment._id, 'successful')}>
                <IoCheckmarkCircleOutline className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button size="sm" color="info" onClick={() => openResponseModal(appointment)}>
                <FiMessageSquare className="mr-2 h-4 w-4" />
                Respond
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Response Modal Component
  const ResponseModal = () => (
    <Modal show={showModal} size="md" onClose={() => setShowModal(false)}>
      <Modal.Header>Respond to Farmer</Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <Label htmlFor="responseMessage" value="Your Message:" />
          <Textarea
            id="responseMessage"
            placeholder="Write a response message to the farmer..."
            rows={4}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="scheduledDate" value="Scheduled Date:" />
          <DatePicker
            id="scheduledDate"
            selected={scheduledDate}
            onChange={(date) => setScheduledDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-full rounded-md border p-2"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="scheduledTime" value="Scheduled Time:" />
          <TextInput
            id="scheduledTime"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full rounded-md border p-2"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="blue" onClick={handleSendResponse}>
          Send Response
        </Button>
        <Button color="gray" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Appointments</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Appointments"
          value={stats.total}
          icon={<BsFillGridFill />}
          color="blue"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<HiOutlineClock />}
          color="yellow"
        />
        <StatCard
          title="Approved"
          value={stats.successful}
          icon={<IoCheckmarkCircleOutline />}
          color="green"
        />
        <StatCard
          title="High Risk"
          value={stats.highRisk}
          icon={<IoLeafOutline />}
          color="red"
        />
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <TextInput
            type="search"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mr-2"
            icon={CgSearch}
          />
        </div>

        <div className="flex items-center space-x-3">
          {/* Date Range Filter */}
          <div className="flex items-center">
            <Label htmlFor="startDate" className="mr-2">
              Date Range:
            </Label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setStartDate(update[0]);
                setEndDate(update[1]);
              }}
              isClearable={true}
              placeholderText="Select Date Range"
            />
          </div>

          {/* Status Filter */}
          <div>
            <Label htmlFor="statusFilter" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status:</Label>
            <Select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="successful">Approved</option>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <Label htmlFor="sortOrder" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sort By:</Label>
            <Select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </Select>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <Label>View:</Label>
          <Button
            size="sm"
            color={viewType === "cards" ? "blue" : "gray"}
            onClick={() => setViewType("cards")}
          >
            <BsFillGridFill className="mr-2" />
            Cards
          </Button>
          <Button
            size="sm"
            color={viewType === "list" ? "blue" : "gray"}
            onClick={() => setViewType("list")}
          >
            <BsListUl className="mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Appointments List or Cards */}
      {loading ? (
        <div className="text-center">
          <Spinner aria-label="Loading..." size="xl" />
          <p className="mt-2">Loading appointments...</p>
        </div>
      ) : currentItems?.length === 0 ? (
        <div className="text-center">
          <p>No appointments found.</p>
        </div>
      ) : (
        <div>
          {viewType === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItems.map((appointment) => (
                <AppointmentCard key={appointment._id} appointment={appointment} />
              ))}
            </div>
          ) : (
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-5 py-5 border-b text-sm">
                      {appointment.fullName}
                    </td>
                    <td className="px-5 py-5 border-b text-sm">
                      {formatDate(appointment.createdAt)}
                    </td>
                    <td className="px-5 py-5 border-b text-sm">
                      {appointment.province}, {appointment.district}
                    </td>
                    <td className="px-5 py-5 border-b text-sm">
                      <Badge
                        color={
                          appointment.status === "pending" ? "warning" : "success"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-5 border-b text-sm">
                      <Button size="sm" color="failure" onClick={() => handleDelete(appointment._id)}>
                        <IoTrashBinOutline className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                      <Button size="sm" color="success" onClick={() => handleStatusUpdate(appointment._id, 'successful')}>
                        <IoCheckmarkCircleOutline className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button size="sm" color="info" onClick={() => openResponseModal(appointment)}>
                        <FiMessageSquare className="mr-2 h-4 w-4" />
                        Respond
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredAppointments.length > itemsPerPage && (
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex list-style-none">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <li key={pageNumber} className="page-item">
                  <button
                    onClick={() => paginate(pageNumber)}
                    className={`page-link px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${currentPage === pageNumber ? 'bg-blue-100 text-blue-700' : ''}`}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Response Modal */}
      <ResponseModal />
    </div>
  );
}
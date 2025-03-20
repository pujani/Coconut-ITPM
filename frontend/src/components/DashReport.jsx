import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Card, 
  Table, 
  Button, 
  TextInput, 
  Select, 
  Badge, 
  Spinner,
  Modal 
} from "flowbite-react";
import { 
  HiDocumentReport, 
  HiOutlineExclamationCircle,
  HiTrash
} from "react-icons/hi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";
import { TbPlant2 } from "react-icons/tb";
import { MdOutlineWarning } from "react-icons/md";
import { BiCut } from "react-icons/bi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleMap, LoadScript, HeatmapLayer } from '@react-google-maps/api';

export default function DashReport() {
  //main state management
  const [reports, setReports] = useState([]);  //store all reports
  const [loading, setLoading] = useState(true); //දත්ත ලබා ගැනීමේ ප්‍රතිරෝධය පෙන්වීම
  const [error, setError] = useState(null); //store error messages
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    province: "",   //selected province
    district: "",
    regionalDivision: "",
    timeRange: "all"  
  });

  // Location data
  const [locations, setLocations] = useState({
    provinces: [],  //province list
    districts: [],
    regionalDivisions: []
  });

  // Statistics state
  const [stats, setStats] = useState({
    totalInspected: 0,
    totalAffected: 0,
    affectedPercentage: 0
  });

  // Fetch initial data --ආරම්භක දත්ත ලබා ගැනීම
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch provinces  --// පළාත් ලැයිස්තුව ලබා ගැනීම
        const provincesRes = await axios.get("/api/locations/provinces");
        setLocations(prev => ({ ...prev, provinces: provincesRes.data }));

        // Fetch reports  --වාර්තා ලබා ගැනීම
        await fetchReports();
      } catch (err) {
        // දෝෂ පරිහරණය
        setError(err.message);
        toast.error("Failed to load initial data"); //ආරම්භක දත්ත ලබා ගැනීමට අසමත් විය
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch reports with filters  ---වාර්තා ලබා ගැනීමේ logic
  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {
        search: filters.search,
        province: filters.province,
        district: filters.district,
        regionalDivision: filters.regionalDivision,
        timeRange: filters.timeRange
      };

      const { data } = await axios.get("/api/reports", { params });
      setReports(data.reports);
      calculateStatistics(data.reports);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics    --සංඛ්‍යාලේඛන ගණනය කිරීම
  const calculateStatistics = (reports) => {
    // සම්පූර්ණ පරීක්ෂා කළ ගස්
    const totalInspected = reports.reduce((acc, report) => 
      acc + report.numberOfPlants, 0);

     // රෝගී ගස් ගණන
    const totalAffected = reports.reduce((acc, report) => 
      acc + report.affectedPlants, 0);

     // රෝගී ප්‍රතිශතය
    const percentage = totalInspected > 0 
      ? ((totalAffected / totalInspected) * 100).toFixed(2)
      : 0;

    setStats({
      totalInspected,
      totalAffected,
      affectedPercentage: percentage
    });
  };

  // Handle filter changes
  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };

    // Handle location dependencies
    //පලමු dropdown (Province) තෝරාගත් පසු දෙවන dropdown (District) update කිරීම
    if (name === "province") {

      // API call එක නිවැරදිද?
      const { data } = await axios.get(`/api/locations/districts?province=${value}`);
      setLocations(prev => ({
        ...prev,
        districts: data,
        regionalDivisions: []   // ප්‍රාදේශීය අංශ යළි පිහිටුවීම
      }));
      newFilters.district = "";
      newFilters.regionalDivision = "";
    }
    
 
    // දිස්ත්රික්කය තෝරාගත් විට    
    if (name === "district") {
      // ප්‍රාදේශීය අංශ ලබා ගැනීම
      const { data } = await axios.get(`/api/locations/regional-divisions?district=${value}`);
      
      // State update නිවැරදිද?
      setLocations(prev => ({
        ...prev,
        regionalDivisions: data
      }));
      newFilters.regionalDivision = "";
    }

         // Filters update කිරීම
      setFilters(prev => ({
        ...prev,
        province,
        district: "",
        regionalDivision: ""
      }));
  };

  // Apply filters
  useEffect(() => {
    fetchReports();
  }, [filters]);

  // Delete report handler
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/reports/${selectedReport._id}`);
      setReports(prev => prev.filter(r => r._id !== selectedReport._id));
      toast.success("Report deleted successfully");
      setShowDeleteModal(false);
    } catch (err) {
      toast.error("Failed to delete report");
    }
  };

  // Download PDF handler   --PDF ජනනය කිරීමේ function එක
  const handleDownload = (reportId) => {
    window.open(`/api/reports/${reportId}/pdf`, "_blank");
  };

  // Date filter logic
  const getDateRange = () => {
    const today = new Date();
    switch(filters.timeRange) {
      case 'today':
        return { 
          start: new Date(today.setHours(0,0,0,0)), 
          end: new Date(today.setHours(23,59,59,999))
        };
      case 'week':
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        return {
          start: startOfWeek,
          end: new Date(startOfWeek.getTime() + 6 * 86400000)
        };
      case 'month':
        return {
          start: new Date(today.getFullYear(), today.getMonth(), 1),
          end: new Date(today.getFullYear(), today.getMonth() + 1, 0)
        };
      case 'year':
        return {
          start: new Date(today.getFullYear(), 0, 1),
          end: new Date(today.getFullYear(), 11, 31)
        };
      default: // 'all' case
        return {
          start: new Date(0), // 1970-01-01
          end: new Date()
        };
    }
  };

// API call එකට date range එක යොමු කිරීම
const params = {
  startDate: getDateRange().start.toISOString(),
  endDate: getDateRange().end.toISOString()
};

  // Get status color
  const getStatusColor = (percentage) => {
    if (percentage < 30) return "success";
    if (percentage < 50) return "warning";
    return "failure";
  };



  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error: {error}. Please try reloading the page.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Coconut Disease Monitoring
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total Inspected</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {stats.totalInspected.toLocaleString()}
              </h2>
            </div>
            <TbPlant2 className="text-4xl text-green-500" />
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Affected Trees</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {stats.totalAffected.toLocaleString()}
              </h2>
            </div>
            <MdOutlineWarning className="text-4xl text-yellow-500" />
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Affected Percentage</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {stats.affectedPercentage}%
              </h2>
            </div>
            <BiCut className="text-4xl text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <Select
              name="province"
              value={filters.province}
              onChange={handleFilterChange}
            >
              <option value="">All Provinces</option>
              {locations.provinces.map(province => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              District
            </label>
            <Select
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              disabled={!filters.province}
            >
              <option value="">All Districts</option>
              {locations.districts.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regional Division
            </label>
            <Select
              name="regionalDivision"
              value={filters.regionalDivision}
              onChange={handleFilterChange}
              disabled={!filters.district}
            >
              <option value="">All Divisions</option>
              {locations.regionalDivisions.map(division => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <Select
              name="timeRange"
              value={filters.timeRange}
              onChange={handleFilterChange}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </Select>
          </div>

          <div>
            <TextInput
              name="search"
              placeholder="Search reports..."
              rightIcon={AiOutlineSearch}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          {/*Button that can input new report */}
          <Link to="/create-report">
            <Button gradientMonochrome="info">
              <IoIosAddCircleOutline className="mr-2 text-lg" />
              New Report
            </Button>
          </Link>

          <Button gradientMonochrome="pink">
            <HiDocumentReport className="mr-2 text-lg" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Reports Table */}
      {loading ? (
        <div className="text-center py-12">
          <Spinner size="xl" aria-label="Loading reports..." />
          <p className="mt-3 text-gray-600">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <HiOutlineExclamationCircle className="mx-auto text-5xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or create a new report.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <Table hoverable className="min-w-[1200px]">
            <Table.Head>
              <Table.HeadCell>Report ID</Table.HeadCell>
              <Table.HeadCell>Submitted By</Table.HeadCell>
              <Table.HeadCell>Location</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Plants</Table.HeadCell>
              <Table.HeadCell>Incentive</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {reports.map((report) => (
                <Table.Row key={report._id} className="bg-white">
                  <Table.Cell className="font-semibold text-gray-900">
                    {report.uniqueId}
                  </Table.Cell>
                  
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-medium">{report.fullName}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex flex-col">
                      <span>{report.district}</span>
                      <span className="text-sm text-gray-500">
                        {report.regionalDivision}
                      </span>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    <Badge
                      color={getStatusColor(report.affectedPercentage)}
                      className="w-fit px-3 py-1 rounded-full"
                    >
                      {report.affectedPercentage}% Affected
                    </Badge>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex flex-col">
                      <span>Total: {report.numberOfPlants}</span>
                      <span className="text-red-600">
                        Affected: {report.affectedPlants}
                      </span>
                    </div>
                  </Table.Cell>

                  <Table.Cell className="font-semibold">
                    Rs. {(report.affectedPlants * 3000).toLocaleString()}
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        gradientMonochrome="info"
                        onClick={() => handleDownload(report._id)}
                      >
                        PDF
                      </Button>
                      <Button
                        size="xs"
                        gradientMonochrome="failure"
                        onClick={() => {
                          setSelectedReport(report);
                          setShowDeleteModal(true);
                        }}
                      >
                        <HiTrash className="mr-1" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
      
      // Map එක පෙන්වන්න
      <div style={{ height: '500px', width: '100%' }}>
        <LoadScript googleMapsApiKey="YOUR_API_KEY">
        <GoogleMap
           mapContainerStyle={{ height: '100%', width: '100%' }}
           center={{ lat: 7.8731, lng: 80.7718 }} // Sri Lanka center
           zoom={7}
         >
        <HeatmapLayer
           data={reports.map(report => ({
           location: new google.maps.LatLng(report.latitude, report.longitude),
           weight: report.affectedPercentage
        }))}
        />
        </GoogleMap>
        </LoadScript>
      </div>


      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        size="md"
        onClose={() => setShowDeleteModal(false)}
      >
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete report {selectedReport?.uniqueId}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, delete it
              </Button>
              <Button
                color="gray"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
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

export default function DashReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    timeRange: "all"  
  });
  const [stats, setStats] = useState({
    totalInspected: 0,
    totalAffected: 0,
    affectedPercentage: 0
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {
        search: filters.search,
        timeRange: filters.timeRange
      };

      const { data } = await axios.get("/api/reports", { params });

      const reportsArray = Array.isArray(data.reports) ? data.reports : [];
      
      setReports(reportsArray);
      calculateStatistics(reportsArray);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (reports) => {
    const totalInspected = reports.reduce((acc, report) => acc + report.numberOfPlants, 0);
    const totalAffected = reports.reduce((acc, report) => acc + report.affectedPlants, 0);
    const percentage = totalInspected > 0 ? ((totalAffected / totalInspected) * 100).toFixed(2) : 0;

    setStats({
      totalInspected,
      totalAffected,
      affectedPercentage: percentage
    });
  };

  useEffect(() => {
    fetchReports();
  }, [filters]);

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
    </div>
  );
}

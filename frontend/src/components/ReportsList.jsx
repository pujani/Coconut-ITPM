import React, { useState, useEffect } from 'react';
import { Button, Table, TextInput, Select, Card, Spinner, Modal, Datepicker } from 'flowbite-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { HiSearch, HiTrash, HiPencil, HiDownload } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ totalInspected: 0, totalAffected: 0, percentage: 0 });
  const [filters, setFilters] = useState({
    province: '',
    district: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reportsRes, statsRes] = await Promise.all([
        axios.get('/api/reports', { params: filters }),
        axios.get('/api/reports/stats', { params: filters })
      ]);
      setReports(reportsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <h3 className="text-gray-500">Total Inspected</h3>
          <p className="text-2xl font-bold">{stats.totalInspected}</p>
        </Card>
        <Card>
          <h3 className="text-gray-500">Total Affected</h3>
          <p className="text-2xl font-bold">{stats.totalAffected}</p>
        </Card>
        <Card>
          <h3 className="text-gray-500">Affected %</h3>
          <p className="text-2xl font-bold">{stats.percentage}%</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <Select name="province" onChange={handleFilterChange} className="w-48">
          <option value="">All Provinces</option>
          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
        </Select>
        <Select name="district" onChange={handleFilterChange} className="w-48" disabled={!filters.province}>
          <option value="">All Districts</option>
          {DISTRICTS_BY_PROVINCE[filters.province]?.map(d => <option key={d} value={d}>{d}</option>)}
        </Select>
       
      </div>

      {/* Reports Table */}
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Report ID</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Region</Table.HeadCell>
          <Table.HeadCell>Affected %</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {reports.map(report => (
            <Table.Row key={report._id}>
              <Table.Cell>{report.uniqueId}</Table.Cell>
              <Table.Cell>{report.fullName}</Table.Cell>
              <Table.Cell>{report.regionalDivision}</Table.Cell>
              <Table.Cell>{report.percentage}%</Table.Cell>
              <Table.Cell>
                <div className="flex gap-2">
                  <Button size="xs" onClick={() => window.open(`/api/reports/${report._id}/pdf`, '_blank')}>
                    <HiDownload className="mr-2" /> PDF
                  </Button>
                  <Link to={`/edit/${report._id}`}>
                    <Button size="xs" color="warning">
                      <HiPencil className="mr-2" /> Edit
                    </Button>
                  </Link>
                  <Button size="xs" color="failure" onClick={() => handleDelete(report._id)}>
                    <HiTrash className="mr-2" /> Delete
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
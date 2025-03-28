// DashReport.jsx
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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


// Static Sri Lankan provinces and districts
const PROVINCES = [
    'Central Province',
    'Eastern Province',
    'Northern Province',
    'Southern Province',
    'Western Province',
    'North Western Province',
    'North Central Province',
    'Uva Province',
    'Sabaragamuwa Province'
];

const DISTRICTS_BY_PROVINCE = {
    'Central Province': ['Kandy', 'Matale', 'Nuwara Eliya'],
    'Eastern Province': ['Ampara', 'Batticaloa', 'Trincomalee'],
    'Northern Province': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
    'Southern Province': ['Galle', 'Hambantota', 'Matara'],
    'Western Province': ['Colombo', 'Gampaha', 'Kalutara'],
    'North Western Province': ['Kurunegala', 'Puttalam'],
    'North Central Province': ['Anuradhapura', 'Polonnaruwa'],
    'Uva Province': ['Badulla', 'Monaragala'],
    'Sabaragamuwa Province': ['Kegalle', 'Ratnapura']
};

const galleDistrict = [
    "Akmeemana",
    "Ambalangoda",
    "Baddegama",
    "Balapitiya",
    "Benthota",
    "Bope-Poddala",
    "Elpitiya",
    "Galle Four Gravets",
    "Gonapinuwala",
    "Habaraduwa",
    "Hikkaduwa",
    "Imaduwa",
    "Karandeniya",
    "Nagoda",
    "Neluwa",
    "Niyagama",
    "Thawalama",
    "Welivitiya-Divithura",
    "Yakkalamulla"
];

const mataraDistrict = [
    "Akuressa",
    "Athuraliya",
    "Devinuwara",
    "Dickwella",
    "Hakmana",
    "Kamburupitiya",
    "Kirinda Puhulwella",
    "Kotapola",
    "Malimbada",
    "Matara Four Gravets",
    "Mulatiyana",
    "Pasgoda",
    "Pitabeddara",
    "Thihagoda",
    "Weligama",
    "Welipitiya"
];

const hambantotaDistrict = [
    "Ambalantota",
    "Angunakolapelessa",
    "Beliatta",
    "Hambantota",
    "Katuwana",
    "Lunugamvehera",
    "Okewela",
    "Sooriyawewa",
    "Tangalle",
    "Thissamaharama",
    "Walasmulla",
    "Weeraketiya"
];

// Combined regional divisions for Southern Province districts
const SOUTHERN_REGIONAL_DIVISIONS = {
    'Galle': galleDistrict,
    'Matara': mataraDistrict,
    'Hambantota': hambantotaDistrict,
};

export default function DashReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        province: "",
        district: "",
        regionalDivision: "",
        timeRange: "all"
    });
    const [stats, setStats] = useState({
        totalInspected: 0,
        totalAffected: 0,
        affectedPercentage: 0
    });

    const [pieChartData, setPieChartData] = useState([]);


    const showRegionalDropdown =
        filters.province === "Southern Province" &&
        ["Galle", "Matara", "Hambantota"].includes(filters.district);

    useEffect(() => {
        fetchReports();
    }, [filters]);

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

            const dateRange = getDateRange();
            if (dateRange.start && dateRange.end) {
                params.startDate = dateRange.start.toISOString();
                params.endDate = dateRange.end.toISOString();
            }

            const reportsRes = await axios.get("/api/reports", { params });
            const reportsData = reportsRes.data;

            setReports(reportsData);

            // Calculate statistics
            const totalInspected = reportsData.reduce((acc, report) => acc + (report.numberOfPlants || 0), 0);
            const totalAffected = reportsData.reduce((acc, report) => acc + (report.trees ? report.trees.filter(tree => tree.affected).length : 0), 0);
            const affectedPercentage = totalInspected > 0 ? ((totalAffected / totalInspected) * 100).toFixed(2) : 0;

            setStats({
                totalInspected,
                totalAffected,
                affectedPercentage: parseFloat(affectedPercentage)
            });

            // Prepare data for the pie chart
            setPieChartData([
                { name: 'Affected', value: totalAffected },
                { name: 'Healthy', value: totalInspected - totalAffected }
            ]);

        } catch (err) {
            setError(err.message);
            toast.error("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };

        // Reset child selections when parent changes
        if (name === "province") {
            newFilters.district = "";
            newFilters.regionalDivision = "";
        } else if (name === "district") {
            newFilters.regionalDivision = "";
        }

        setFilters(newFilters);
    };

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

    const handleDownload = (report) => {
        generatePDF(report);
    };

    const getDateRange = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // set time to the beginning of the day

        switch (filters.timeRange) {
            case 'today':
                return {
                    start: today,
                    end: new Date(today.getTime() + 86400000 - 1)  // end of the day
                };
            case 'week':
                const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                const endOfWeek = new Date(startOfWeek.getTime() + 6 * 86400000);
                return {
                    start: startOfWeek,
                    end: new Date(endOfWeek.getTime() + 86400000 - 1)  // end of the day
                };
            case 'month':
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                return {
                    start: startOfMonth,
                    end: new Date(endOfMonth.getTime() + 86400000 - 1)  // end of the day
                };
            case 'year':
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                const endOfYear = new Date(today.getFullYear(), 11, 31);
                return {
                    start: startOfYear,
                    end: new Date(endOfYear.getTime() + 86400000 - 1)  // end of the day
                };
            default:
                return {
                    start: null,
                    end: null
                };
        }
    };


    const getStatusColor = (percentage) => {
        if (percentage < 30) return "success";
        if (percentage < 50) return "warning";
        return "failure";
    };

    const isSouthernProvinceFilter =
        filters.province === "Southern Province" &&
        ["Galle", "Matara", "Hambantota"].includes(filters.district);


    const generatePDF = (formData) => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Color Palette
        const colors = {
            primary: [31, 97, 141],   // Dark Blue
            secondary: [41, 128, 185],// Bright Blue
            accent: [22, 160, 133],   // Teal
            gray: [128, 139, 150],    // Gray
            text: [0, 0, 0]           // Black
        };

        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Margins and Layout
        const margin = 15;
        let currentY = margin;

        // Helper function to add colored text with styling
        const addStyledText = (text, x, y, style = {}) => {
            const {
                fontSize = 12,
                fontName = 'helvetica',
                fontWeight = 'normal',
                align = 'left',
                color = colors.text
            } = style;

            // Set font and color
            doc.setFont(fontName, fontWeight);
            doc.setFontSize(fontSize);
            doc.setTextColor(...color);

            // Adjust alignment
            if (align === 'center') {
                const textWidth = doc.getTextWidth(text);
                x = (pageWidth - textWidth) / 2;
            }

            doc.text(text, x, y);
        };

        // Add decorative border
        const addBorder = () => {
            doc.setDrawColor(...colors.primary);
            doc.setLineWidth(0.5);
            doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
        };

        // Header with Logo Space
        const addHeader = () => {
            // Colored header background
            doc.setFillColor(...colors.secondary);
            doc.rect(15, currentY - 5, pageWidth - 30, 15, 'F');

            // Header Text
            addStyledText('COCONUT LEAF WILT DISEASE IMPACT REPORT', margin, currentY, {
                fontSize: 16,
                fontWeight: 'bold',
                align: 'center',
                color: [255, 255, 255]  // White text
            });
            currentY += 15;
        };

        // Modern Section Headers
        const addSectionHeader = (text) => {
            // Soft background for section
            doc.setFillColor(240, 245, 250);  // Light blue-gray background
            doc.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F');

            // Section text with accent color
            addStyledText(text, margin + 2, currentY + 6, {
                fontSize: 12,
                fontWeight: 'bold',
                color: colors.accent
            });
            currentY += 12;
        };

        // Start PDF Generation
        addBorder();
        addHeader();

        // Report Details Section
        addSectionHeader('REPORT DETAILS');
        addStyledText(`Report ID: ${formData.uniqueId}`, margin, currentY, { color: colors.primary });
        currentY += 7;
        addStyledText(`Full Name: ${formData.fullName}`, margin, currentY);
        currentY += 7;
        addStyledText(`Location: ${formData.province}, ${formData.district}, ${formData.regionalDivision}`, margin, currentY, { color: colors.gray });
        currentY += 7;
        addStyledText(`Address: ${formData.addressLine1}, ${formData.addressLine2}`, margin, currentY);
        currentY += 7;
        addStyledText(`Land Extent: ${formData.landExtent.value} acres`, margin, currentY);
        currentY += 7;
        addStyledText(`Total Coconut Plants: ${formData.numberOfPlants}`, margin, currentY);
        currentY += 10;

        // Disease Impact Section
        addSectionHeader('DISEASE IMPACT');
        const affectedTrees = formData.trees ? formData.trees.filter(tree => tree.affected) : [];
        const percentage = formData.numberOfPlants > 0
            ? ((affectedTrees.length / formData.numberOfPlants) * 100).toFixed(2)
            : 0;

        addStyledText(`Total Affected Plants: ${affectedTrees.length}`, margin, currentY, { color: colors.primary });
        currentY += 7;
        addStyledText(`Disease Impact Percentage: ${percentage}%`, margin, currentY, { color: [200, 0, 0] }); // Red for impact
        currentY += 7;

        // Incentives Calculation
        addSectionHeader('INCENTIVES');
        const incentivePerTree = 3000;
        const totalIncentive = affectedTrees.length * incentivePerTree;

        addStyledText(`Approved Trees for Cutting: ${affectedTrees.length}`, margin, currentY);
        currentY += 7;
        addStyledText(`Incentive per Tree: LKR ${incentivePerTree}`, margin, currentY);
        currentY += 7;
        addStyledText(`Total Incentive Amount: LKR ${totalIncentive}`, margin, currentY, { color: colors.accent });
        currentY += 10;

        // Footer
        const now = new Date();
        addStyledText(`Report Generated: ${now.toLocaleString()}`, margin, pageHeight - 20, {
            fontSize: 10,
            color: colors.gray
        });

        // Official Note
        addStyledText('Official Certification for Agricultural Intervention', pageWidth / 2, pageHeight - 10, {
            align: 'center',
            fontSize: 8,
            color: colors.gray
        });

        doc.save(`Weligama_Disease_Report_${formData.uniqueId}.pdf`);
    };


    const pieChartColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
                            {PROVINCES.map(province => (
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
                            {(DISTRICTS_BY_PROVINCE[filters.province] || []).map(district => (
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
                        {showRegionalDropdown ? (
                            <Select
                                name="regionalDivision"
                                value={filters.regionalDivision}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Divisions</option>
                                {(SOUTHERN_REGIONAL_DIVISIONS[filters.district] || []).map(division => (
                                    <option key={division} value={division}>
                                        {division}
                                    </option>
                                ))}
                            </Select>
                        ) : (
                            <TextInput
                                name="regionalDivision"
                                placeholder="Enter division"
                                value={filters.regionalDivision}
                                onChange={handleFilterChange}
                            />
                        )}
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
                    <Link to="/createReport">
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

            {/* Graphical representation */}
            <Card className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Disease Impact Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Card>

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
                            <Table.HeadCell>Disease Impact</Table.HeadCell>
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
                                        {report.numberOfPlants ?
                                            `${(report.trees ? report.trees.filter(tree => tree.affected).length : 0) / report.numberOfPlants * 100}%`
                                            : '0%'
                                        }
                                    </Table.Cell>

                                    <Table.Cell>
                                        <div className="flex flex-col">
                                            <span>Total: {report.numberOfPlants}</span>
                                        </div>
                                    </Table.Cell>

                                    <Table.Cell>
                                        LKR {(report.trees ? report.trees.filter(tree => tree.affected).length : 0) * 3000}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <div className="flex gap-2">
                                            <Link to={`/updateReport/${report._id}`}>
                                                <Button size="sm">Update</Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                color="failure"
                                                onClick={() => {
                                                    setSelectedReport(report);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <HiTrash className="mr-2" />
                                                Delete
                                            </Button>
                                            <Button
                                                size="sm"
                                                color="success"
                                                onClick={() => handleDownload(report)}
                                            >
                                                Download
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                size="md"
                popup={true}
                onClose={() => setShowDeleteModal(false)}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this report?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={handleDelete}
                            >
                                Yes, I'm sure
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

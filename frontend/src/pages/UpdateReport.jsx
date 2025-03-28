import React, { useState, useEffect } from 'react';
import { Button, TextInput, Select, Label, Card, Spinner, Table } from 'flowbite-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { HiOutlineLocationMarker, HiOutlineDocumentText, HiInformationCircle } from 'react-icons/hi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import 'react-toastify/dist/ReactToastify.css';

// Static Sri Lankan location data
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

const REGIONAL_DIVISIONS = {
    'Galle': ["Akmeemana","Ambalangoda","Baddegama","Balapitiya","Benthota","Bope-Poddala","Elpitiya","GalleFourGravets","Gonapinuwala","Habaraduwa","Hikkaduwa","Imaduwa","Karandeniya","Nagoda","Neluwa","Niyagama","Thawalama","Welivitiya-Divithura","Yakkalamulla"] ,
    'Matara': ["Akuressa", "Athuraliya", "Devinuwara", "Dickwella", "Hakmana", "Kamburupitiya", "Kirinda Puhulwella", "Kotapola", "Malimbada", "Matara Four Gravets", "Mulatiyana", "Pasgoda", "Pitabeddara", "Thihagoda", "Weligama", "Welipitiya"] ,
    'Hambantota': ["Ambalantota", "Angunakolapelessa", "Beliatta", "Hambantota", "Katuwana", "Lunugamvehera", "Okewela", "Sooriyawewa", "Tangalle", "Thissamaharama", "Walasmulla", "Weeraketiya"]
};

const UpdateReport = ({ match }) => {
    const [formData, setFormData] = useState({
        reportName: 'Identification and reporting of trees with coconut leaf rot and Weligama coconut leaf wilt diseases',
        uniqueId: '',
        fullName: '',
        province: '',
        district: '',
        regionalDivision: '',
        gramaNiladari: '',
        addressLine1: '',
        addressLine2: '',
        landExtent: { value: 0, unit: 'Acres' },
        numberOfPlants: 0,
        trees: []
    });

    const [submitting, setSubmitting] = useState(false);
    const [affectedTreesCount, setAffectedTreesCount] = useState(0);
    const [under2YearsAffected, setUnder2YearsAffected] = useState(0);
    const [over2YearsAffected, setOver2YearsAffected] = useState(0);
    const [affectedTreesList, setAffectedTreesList] = useState({
        under2Years: [],
        over2Years: []
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const numberOfPlantsRef = useRef(null);

    // Fetch report data on mount
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get(`/api/reports/${match.params.id}`);
                const report = response.data;

                // Transform data for UI
                setFormData({
                    ...report,
                    landExtent: { value: report.landExtent, unit: 'Acres' },
                    numberOfPlants: report.numberOfPlants,
                    trees: report.trees.map(tree => ({
                        treeNumber: tree.treeNumber,
                        age: tree.age,
                        symptoms: tree.symptoms,
                        affected: tree.affected
                    }))
                });

                // Calculate affected trees
                const affected = report.trees.filter(tree => tree.affected);
                setAffectedTreesCount(affected.length);
                setUnder2YearsAffected(affected.filter(tree => tree.age === 2).length);
                setOver2YearsAffected(affected.filter(tree => tree.age === 1).length);
                setAffectedTreesList({
                    under2Years: affected.filter(tree => tree.age === 2).map(tree => tree.treeNumber),
                    over2Years: affected.filter(tree => tree.age === 1).map(tree => tree.treeNumber)
                });

            } catch (err) {
                setError(err.message);
                toast.error('Failed to load report');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [match.params.id]);

    // Auto-fill address line 2 when location fields change
    useEffect(() => {
        const { gramaNiladari, regionalDivision, district, province } = formData;
        const addressLine2 = `${gramaNiladari}, ${regionalDivision}, ${district}, ${province}`;
        setFormData(prev => ({ ...prev, addressLine2 }));
    }, [formData.gramaNiladari, formData.regionalDivision, formData.district, formData.province]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Full Name validation
        if (name === 'fullName') {
            const newValue = value.replace(/[^A-Za-z\s]/g, ''); // Allow only letters and spaces
            setFormData(prev => ({ ...prev, [name]: newValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (type, value) => {
        const updates = { [type]: value };

        if (type === 'province') {
            updates.district = '';
            updates.regionalDivision = '';
        }

        if (type === 'district') {
            updates.regionalDivision = '';
        }

        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleLandExtentChange = (e) => {
        let value = e.target.value;
        if (value === '') {
            value = 0;
        }
        const newValue = Math.max(1, parseInt(value)); // Ensure positive integers
        setFormData(prev => ({
            ...prev,
            landExtent: { ...prev.landExtent, value: newValue }
        }));
    };

    const handleNumberOfPlantsChange = (e) => {
        let value = e.target.value;
        if (value === '') {
            value = 0;
        }
        const newValue = Math.max(1, parseInt(value)); // Ensure positive integers
        setFormData(prev => ({ ...prev, numberOfPlants: newValue }));

        // Update the tree table based on the new number of plants
        updateTreeTable(newValue);

        // Directly set the value to the TextInput
        if (numberOfPlantsRef.current) {
            numberOfPlantsRef.current.value = newValue;
        }
    };

    const updateTreeTable = (num) => {
        const currentTreeCount = formData.trees.length;

        if (num > currentTreeCount) {
            // Add trees
            const newTrees = Array.from({ length: num - currentTreeCount }, (_, i) => ({
                treeNumber: currentTreeCount + i + 1,
                age: null,
                symptoms: [],
                affected: false
            }));
            setFormData(prev => ({ ...prev, trees: [...prev.trees, ...newTrees] }));
        } else if (num < currentTreeCount) {
            // Remove trees
            setFormData(prev => ({ ...prev, trees: prev.trees.slice(0, num) }));
        }
    };

    const handleAddTree = () => {
        const newTreeNumber = formData.trees.length > 0 ? formData.trees[formData.trees.length - 1].treeNumber + 1 : 1;
        const newTree = {
            treeNumber: newTreeNumber,
            age: null,
            symptoms: [],
            affected: false
        };
        setFormData(prev => ({ ...prev, trees: [...prev.trees, newTree], numberOfPlants: prev.trees.length + 1 }));
    };

    const handleRemoveTree = (index) => {
        const updatedTrees = [...formData.trees];
        updatedTrees.splice(index, 1);

        // Update tree numbers in the remaining trees
        updatedTrees.forEach((tree, i) => {
            tree.treeNumber = i + 1;
        });

        setFormData(prev => ({ ...prev, trees: updatedTrees, numberOfPlants: updatedTrees.length }));
    };

    const handleTreeChange = (index, field, value) => {
        const updatedTrees = [...formData.trees];
        updatedTrees[index][field] = value;
        updatedTrees[index].affected = updatedTrees[index].symptoms.length > 0;
        setFormData(prev => ({ ...prev, trees: updatedTrees }));

        // Update the affected trees count
        updateAffectedTreesCount(updatedTrees);
    };

    const updateAffectedTreesCount = (trees) => {
        let affectedCount = 0;
        let under2Count = 0;
        let over2Count = 0;
        const under2List = [];
        const over2List = [];
        trees.forEach(tree => {
            if (tree.affected) {
                affectedCount++;
                if (tree.age === 2) {
                    under2Count++;
                    under2List.push(tree.treeNumber);
                } else if (tree.age === 1) {
                    over2Count++;
                    over2List.push(tree.treeNumber);
                }
            }
        });

        setAffectedTreesCount(affectedCount);
        setUnder2YearsAffected(under2Count);
        setOver2YearsAffected(over2Count);
        setAffectedTreesList({ under2Years: under2List, over2Years: over2List });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const postData = {
                uniqueId: formData.uniqueId,
                fullName: formData.fullName,
                province: formData.province,
                district: formData.district,
                regionalDivision: formData.regionalDivision,
                gramaNiladari: formData.gramaNiladari,
                addressLine1: formData.addressLine1,
                landExtent: formData.landExtent.value,
                numberOfPlants: formData.numberOfPlants,
                trees: formData.trees.map(tree => ({
                    treeNumber: tree.treeNumber,
                    age: tree.age,
                    symptoms: tree.symptoms,
                    affected: tree.affected
                })),
                incentiveAmount: affectedTreesCount * 3000
            };

            await axios.put(`/api/reports/${match.params.id}`, postData);
            toast.success('Report updated successfully!');
            setFormData(prev => ({
                ...prev,
                uniqueId: '', 
                fullName: '',
                province: '',
                district: '',
                regionalDivision: '',
                gramaNiladari: '',
                addressLine1: '',
                addressLine2: '',
                landExtent: { value: 0, unit: 'Acres' },
                numberOfPlants: 0,
                trees: []
            }));

        } catch (error) {
            toast.error('Error updating report');
        } finally {
            setSubmitting(false);
        }
    };

    const isSouthernProvince = formData.province === 'Southern Province';
    const showRegionalDivisionDropdown = isSouthernProvince && ['Galle', 'Matara', 'Hambantota'].includes(formData.district);

    // Pie chart data for affected trees
    const pieChartData = [
        { name: 'Under 2 Years Affected', value: under2YearsAffected },
        { name: 'Over 2 Years Affected', value: over2YearsAffected },
        { name: 'Healthy Trees', value: formData.numberOfPlants - affectedTreesCount }
    ];

    const COLORS = ['#FF6384', '#36A2EB', '#FFCE56'];

    // Calculate percentages
    const totalAffectedPercentage = ((affectedTreesCount / formData.numberOfPlants) * 100).toFixed(2);
    const under2YearsPercentage = ((under2YearsAffected / formData.numberOfPlants) * 100).toFixed(2);
    const over2YearsPercentage = ((over2YearsAffected / formData.numberOfPlants) * 100).toFixed(2);
    const incentivePerTree = 3000;
    const totalIncentive = affectedTreesCount * incentivePerTree;

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <Card className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <HiOutlineDocumentText className="text-blue-500" />
                    {formData.reportName}
                </h1>
            </Card>

            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Report Details Section */}
                <Card>
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Report Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="uniqueId" value="Unique ID" />
                                <TextInput
                                    id="uniqueId"
                                    value={formData.uniqueId}
                                    placeholder="WD000001"
                                    readOnly
                                />
                            </div>
                            <div>
                                <Label htmlFor="fullName" value="Full Name" />
                                <TextInput
                                    id="fullName"
                                    name="fullName" 
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Location Section */}
                <Card>
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Location Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="province" value="Province" />
                                <Select
                                    id="province"
                                    name="province"
                                    value={formData.province}
                                    onChange={(e) => handleLocationChange('province', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Province</option>
                                    {PROVINCES.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="district" value="District" />
                                <Select
                                    id="district"
                                    name="district"
                                    value={formData.district}
                                    onChange={(e) => handleLocationChange('district', e.target.value)}
                                    required
                                    disabled={!formData.province}
                                >
                                    <option value="" disabled>Select District</option>
                                    {formData.province && DISTRICTS_BY_PROVINCE[formData.province].map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="regionalDivision" value="Regional Division" />
                                {showRegionalDivisionDropdown ? (
                                    <Select
                                        id="regionalDivision"
                                        name="regionalDivision"
                                        value={formData.regionalDivision}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select Regional Division</option>
                                        {REGIONAL_DIVISIONS[formData.district]?.map(division => (
                                            <option key={division} value={division}>{division}</option>
                                        ))}
                                    </Select>
                                ) : (
                                    <TextInput
                                        id="regionalDivision"
                                        name="regionalDivision"
                                        placeholder="Enter Regional Division"
                                        value={formData.regionalDivision}
                                        onChange={handleChange}
                                        required
                                    />
                                )}
                            </div>

                            <div>
                                <Label htmlFor="gramaNiladari" value="Grama Niladari Division" />
                                <TextInput
                                    id="gramaNiladari"
                                    name="gramaNiladari"
                                    placeholder="Enter Grama Niladari Division"
                                    value={formData.gramaNiladari}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="addressLine1" value="Address Line 01" />
                                <TextInput
                                    id="addressLine1"
                                    name="addressLine1"
                                    placeholder="Enter Address Line 01"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="addressLine2" value="Address Line 02" />
                                <TextInput
                                    id="addressLine2"
                                    value={formData.addressLine2}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Land & Tree Details Section */}
                <Card>
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Land & Tree Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="landExtent" value="Extent of the Land (acres)" />
                                <TextInput
                                    id="landExtent"
                                    type="number"
                                    placeholder="Enter land extent"
                                    value={formData.landExtent.value}
                                    onChange={handleLandExtentChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="numberOfPlants" value="Number of Coconut Plants" />
                                <TextInput
                                    id="numberOfPlants"
                                    type="number"
                                    placeholder="Enter number of plants"
                                    value={formData.numberOfPlants}
                                    onChange={handleNumberOfPlantsChange}
                                    required
                                    ref={numberOfPlantsRef}
                                />
                            </div>
                        </div>

                        <div className="flex justify-start gap-4">
                            <Button type="button" onClick={handleAddTree}>Add Tree</Button>
                            <Button type="button" onClick={(e) => handleRemoveTree(e)} disabled={formData.trees.length === 0}>
                                Remove Tree
                            </Button>
                        </div>

                        {formData.trees.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-medium">Tree Health Data Entry</h3>
                                <Table hoverable>
                                    <Table.Head>
                                        <Table.HeadCell>Tree Number</Table.HeadCell>
                                        <Table.HeadCell>Tree Age</Table.HeadCell>
                                        <Table.HeadCell>Symptoms</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {formData.trees.map((tree, index) => (
                                            <Table.Row key={index}>
                                                <Table.Cell>Tree #{tree.treeNumber}</Table.Cell>
                                                <Table.Cell>
                                                    <Select
                                                        value={tree.age}
                                                        onChange={(e) => handleTreeChange(index, 'age', parseInt(e.target.value))}
                                                        required
                                                    >
                                                        <option value="" disabled>Select Age</option>
                                                        <option value="2">Under 2 years</option>
                                                        <option value="1">Over 2 years</option>
                                                    </Select>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={tree.symptoms.includes(1)}
                                                                onChange={(e) => {
                                                                    const symptoms = e.target.checked
                                                                        ? [...tree.symptoms, 1]
                                                                        : tree.symptoms.filter(s => s !== 1);
                                                                    handleTreeChange(index, 'symptoms', symptoms);
                                                                }}
                                                            />
                                                            <span>Coconut leaves flattening and turning yellow-orange</span>
                                                        </label>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={tree.symptoms.includes(2)}
                                                                onChange={(e) => {
                                                                    const symptoms = e.target.checked
                                                                        ? [...tree.symptoms, 2]
                                                                        : tree.symptoms.filter(s => s !== 2);
                                                                    handleTreeChange(index, 'symptoms', symptoms);
                                                                }}
                                                            />
                                                            <span>Rotting branches, blackened leaves, falling rotten parts</span>
                                                        </label>
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        )}
                    </div>
                </Card>

                <Button type="submit" disabled={submitting} className="mt-4">
                    {submitting ? (
                        <>
                            <Spinner size="sm" />
                            <span className="pl-3">Updating...</span>
                        </>
                    ) : (
                        'Update Report'
                    )}
                </Button>
            </form>

            {/* Pie Chart and Statistics */}
            <Card className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Report Statistics</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div>
                        <h3 className="font-medium mb-2">Affected Trees Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Key Statistics */}
                    <div>
                        <h3 className="font-medium mb-2">Key Statistics</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <span className="font-semibold">Total Trees Affected:</span>
                                <Badge color={affectedTreesCount > 0 ? "failure" : "success"} icon={HiInformationCircle}>
                                    {affectedTreesCount} ({totalAffectedPercentage}%)
                                </Badge>
                            </li>
                            <li>
                                <span className="font-semibold">Under 2 Years Affected:</span>
                                <Badge color={under2YearsAffected > 0 ? "warning" : "success"} icon={HiInformationCircle}>
                                    {under2YearsAffected} ({under2YearsPercentage}%)
                                </Badge>
                            </li>
                            <li>
                                <span className="font-semibold">Over 2 Years Affected:</span>
                                <Badge color={over2YearsAffected > 0 ? "warning" : "success"} icon={HiInformationCircle}>
                                    {over2YearsAffected} ({over2YearsPercentage}%)
                                </Badge>
                            </li>
                            <li>
                                <span className="font-semibold">Potential Incentive:</span>
                                <Badge color="info" icon={HiInformationCircle}>
                                    LKR {totalIncentive.toLocaleString()}
                                </Badge>
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UpdateReport;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Import all other necessary components from CreateReport
import { Button, TextInput, Select, Label, Card, Spinner, Table } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import { HiOutlineLocationMarker, HiOutlineDocumentText } from 'react-icons/hi';

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/api/reports/${id}`);
        setFormData(response.data);
      } catch (error) {
        navigate('/reports');
      }
    };
    fetchReport();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/reports/${id}`, formData);
      navigate('/reports');
    } catch (error) {
      // Handle error
    }
  };

  if (!formData) return <Spinner />;

  return (
    // Reuse CreateReport form structure with pre-filled data
    // Update handleSubmit to use PUT request
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
                      readOnly
                    />
                  </div>
    
                  <div>
                    <Label htmlFor="fullName" value="Full Name" />
                    <TextInput
                      id="fullName"
                      name="fullName" // Ensure this matches the key in formData
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
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <HiOutlineLocationMarker className="text-blue-500" />
                  Location Details
                </h2>
    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="province" value="Province" />
                    <Select
                      id="province"
                      value={formData.province}
                      onChange={(e) => handleLocationChange('province', e.target.value)}
                      required
                    >
                      <option value="">Select Province</option>
                      {PROVINCES.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </Select>
                  </div>
    
                  <div>
                    <Label htmlFor="district" value="District" />
                    <Select
                      id="district"
                      value={formData.district}
                      onChange={(e) => handleLocationChange('district', e.target.value)}
                      disabled={!formData.province}
                      required
                    >
                      <option value="">Select District</option>
                      {(DISTRICTS_BY_PROVINCE[formData.province] || []).map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </Select>
                  </div>
    
                  <div>
                    <Label htmlFor="regionalDivision" value="Regional Division" />
                    <TextInput
                      id="regionalDivision"
                      name="regionalDivision"
                      placeholder="Enter Regional Division"
                      value={formData.regionalDivision}
                      onChange={handleChange}
                      required
                    />
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
                    <Label htmlFor="landExtent" value="Extent of the Land" />
                    <div className="flex gap-2">
                      <TextInput
                        id="landExtent"
                        type="number"
                        placeholder="Enter land extent"
                        value={formData.landExtent.value}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          landExtent: { ...prev.landExtent, value: e.target.value }
                        }))}
                        required
                      />
                      <Select
                        value={formData.landExtent.unit}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          landExtent: { ...prev.landExtent, unit: e.target.value }
                        }))}
                      >
                        <option value="Acres">Acres</option>
                        <option value="Roods">Roods</option>
                        <option value="Perches">Perches</option>
                      </Select>
                    </div>
                  </div>
    
                  <div>
                    <Label htmlFor="numberOfPlants" value="Number of Coconut Plants" />
                    <TextInput
                      id="numberOfPlants"
                      type="number"
                      placeholder="Enter number of plants"
                      value={formData.numberOfPlants}
                      onChange={(e) => generateTreeTable(Number(e.target.value))}
                      required
                    />
                  </div>
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
                                value={tree.age || ''}
                                onChange={(e) => handleTreeChange(index, 'age', Number(e.target.value))}
                                required
                              >
                                <option value="">Select Age</option>
                                <option value={1}>Over 2 years</option>
                                <option value={2}>Under 2 years</option>
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
                  <span className="pl-3">Submitting...</span>
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
        </form>
  );
};
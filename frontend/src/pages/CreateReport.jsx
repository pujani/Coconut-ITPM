import React, { useState, useEffect } from 'react';
import { Button, TextInput, Select, Alert } from 'flowbite-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const CreateReport = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    province: '',
    district: '',
    regionalDivision: '',
    gramaNiladari: '',
    addressLine1: '',
    landExtent: { value: 0, unit: 'Acres' },
    numberOfPlants: 0,
    trees: []
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [regionalDivisions, setRegionalDivisions] = useState([]);

  useEffect(() => {
    // Load location data
    axios.get('/api/locations/provinces').then(res => setProvinces(res.data));
  }, []);

  const handleLocationChange = async (type, value) => {
    const updates = { [type]: value };
    if (type === 'province') {
      const { data } = await axios.get(`/api/locations/districts?province=${value}`);
      setDistricts(data);
      updates.district = '';
      updates.regionalDivision = '';
    }
    if (type === 'district') {
      const { data } = await axios.get(`/api/locations/regional-divisions?district=${value}`);
      setRegionalDivisions(data);
      updates.regionalDivision = '';
    }
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const generateTreeTable = (num) => {
    const trees = Array.from({ length: num }, (_, i) => ({
      treeNumber: i + 1,
      age: null,
      symptoms: [],
      affected: false
    }));
    setFormData(prev => ({ ...prev, trees, numberOfPlants: num }));
  };

  const handleTreeChange = (index, field, value) => {
    const updatedTrees = [...formData.trees];
    updatedTrees[index][field] = value;
    updatedTrees[index].affected = updatedTrees[index].symptoms.length > 0;
    setFormData(prev => ({ ...prev, trees: updatedTrees }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reports', formData);
      toast.success('Report submitted successfully!');
    } catch (error) {
      toast.error('Error submitting report');
    }
  };

  return (
    <div className="p-3 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Location Selectors */}
        <Select onChange={(e) => handleLocationChange('province', e.target.value)}>
          <option>Select Province</option>
          {provinces.map(p => <option key={p}>{p}</option>)}
        </Select>

        <Select 
          disabled={!formData.province}
          onChange={(e) => handleLocationChange('district', e.target.value)}
        >
          <option>Select District</option>
          {districts.map(d => <option key={d}>{d}</option>)}
        </Select>

        {/* Tree Input Table */}
        <TextInput
          type="number"
          placeholder="Number of Plants"
          onChange={(e) => generateTreeTable(Number(e.target.value))}
        />

        {formData.trees.map((tree, index) => (
          <div key={index} className="border p-2">
            <span>Tree #{index + 1}</span>
            <Select
              value={tree.age}
              onChange={(e) => handleTreeChange(index, 'age', Number(e.target.value))}
            >
              <option value="">Select Age</option>
              <option value={1}>Over 2 years</option>
              <option value={2}>Under 2 years</option>
            </Select>

            <div className="flex gap-2">
              {[1, 2, 3].map(symptom => (
                <label key={symptom}>
                  <input
                    type="checkbox"
                    checked={tree.symptoms.includes(symptom)}
                    onChange={(e) => {
                      const symptoms = e.target.checked
                        ? [...tree.symptoms, symptom]
                        : tree.symptoms.filter(s => s !== symptom);
                      handleTreeChange(index, 'symptoms', symptoms);
                    }}
                  />
                  Symptom {symptom}
                </label>
              ))}
            </div>
          </div>
        ))}

        <Button type="submit">Submit Report</Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateReport;
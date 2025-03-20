import { useEffect, useState } from 'react';
import { fetchProvinces, fetchDistricts, fetchDSDivisions } from '../api/locations';

const LocationSelectors = ({ onSelect }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dsDivisions, setDSDivisions] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  useEffect(() => {
    fetchProvinces().then(res => setProvinces(res.data));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince).then(res => setDistricts(res.data));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchDSDivisions(selectedDistrict).then(res => setDSDivisions(res.data));
    }
  }, [selectedDistrict]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <select 
        value={selectedProvince}
        onChange={(e) => setSelectedProvince(e.target.value)}
      >
        <option value="">Select Province</option>
        {provinces.map(province => (
          <option key={province.code} value={province.code}>
            {province.name}
          </option>
        ))}
      </select>

      <select
        value={selectedDistrict}
        onChange={(e) => setSelectedDistrict(e.target.value)}
        disabled={!selectedProvince}
      >
        <option value="">Select District</option>
        {districts.map(district => (
          <option key={district.code} value={district.code}>
            {district.name}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => onSelect(e.target.value)}
        disabled={!selectedDistrict}
      >
        <option value="">Select DS Division</option>
        {dsDivisions.map(ds => (
          <option key={ds.code} value={ds.code}>
            {ds.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelectors;
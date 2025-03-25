import React, { useState, useEffect } from 'react';
import { Button, TextInput, Label, Textarea, Alert, Select, Card, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowRight, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaTree, FaExclamationTriangle, FaLeaf, FaImage, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const provinces = {
  "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
  "Eastern Province": ["Ampara", "Batticaloa", "Trincomalee"],
  "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  "Southern Province": ["Galle", "Hambantota", "Matara"],
  "Western Province": ["Colombo", "Gampaha", "Kalutara"],
  "North Central Province": ["Anuradhapura", "Polonnaruwa"],
  "North Western Province": ["Kurunegala", "Puttalam"],
  "Sabaragamuwa Province": ["Kegalle", "Ratnapura"],
  "Uva Province": ["Badulla", "Monaragala"]
};

export default function Appointment() {
  const [formData, setFormData] = useState({
    fullName: '',
    province: '',
    district: '',
    address: '',
    extent: '',
    extentUnit: 'Acres',
    numberOfPlants: '',
    numberOfPlantsAffected: '',
    email: '',
    phone: '',
    message: '',
    photos: []
  });
  
  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    switch(name) {
      case 'fullName':
        newValue = value.replace(/[^A-Za-z\s]/g, '');
        break;
      case 'phone':
        newValue = value.replace(/\D/g, '').slice(0, 10);
        break;
      case 'extent':
      case 'numberOfPlants':
      case 'numberOfPlantsAffected':
        newValue = value.replace(/\D/g, '');
        if (newValue === '0') newValue = '';
        break;
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFormData(prev => ({ ...prev, province, district: '' }));
    setDistricts(provinces[province] || []);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 3 - formData.photos.length;
    const newFiles = files.slice(0, remainingSlots);
    const updatedFiles = [...formData.photos, ...newFiles];
    
    setFormData(prev => ({ ...prev, photos: updatedFiles }));
    
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPhotoPreview(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index) => {
    const newPhotos = [...formData.photos];
    const newPreviews = [...photoPreview];
    
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);
    
    URL.revokeObjectURL(photoPreview[index]);
    setFormData(prev => ({ ...prev, photos: newPhotos }));
    setPhotoPreview(newPreviews);
  };

  useEffect(() => {
    return () => {
      photoPreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photoPreview]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
      isValid = false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
      isValid = false;
      alert('Phone number must be exactly 10 digits');
    }

    if (!formData.extent || parseInt(formData.extent) <= 0) {
      newErrors.extent = 'Please enter a valid land extent';
      isValid = false;
    }

    if (!formData.numberOfPlants || parseInt(formData.numberOfPlants) <= 0) {
      newErrors.numberOfPlants = 'Please enter a valid number of plants';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const percentageAffected = (formData.numberOfPlantsAffected / formData.numberOfPlants) * 100;

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'photos') formDataToSend.append(key, value);
    });
    
    formData.photos.forEach(photo => formDataToSend.append('photos', photo));
    formDataToSend.append('userId', currentUser._id);

    try {
      await axios.post('/api/appointment', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(
        <div>
          <p className="font-semibold mb-2">Appointment Request Submitted!</p>
          <p>We've received your details about the {percentageAffected.toFixed(1)}% disease-affected plants.</p>
          <p className="mt-2">Our team will contact you soon to schedule a visit.</p>
        </div>,
        { position: 'top-center', autoClose: 8000 }
      );

      setTimeout(() => navigate('/'), 5000);
    } catch (error) {
      toast.error('Something went wrong. Please try again later.', { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen">
      <Card className="shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <FaLeaf className="text-green-500 text-3xl" />
          </div>
          <h1 className="text-center text-3xl font-bold text-green-700">Request a Field Visit</h1>
          <p className="text-gray-600 mt-2 text-center">
            Fill out the form below to request a visit from our agricultural experts
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="space-y-6 col-span-2">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <FaUser className="mr-2 text-green-600" /> Personal Information
              </h2>
              <div className="border-b border-gray-200 pb-2"></div>
            </div>

            <div>
              <Label htmlFor="fullName" value="Full Name" className="flex items-center">
                <FaUser className="mr-2 text-gray-500 text-sm" /> Full Name
              </Label>
              <TextInput
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onKeyPress={(e) => /[0-9]/.test(e.key) && e.preventDefault()}
                color={errors.fullName ? 'failure' : 'gray'}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <Label htmlFor="email" value="Email" className="flex items-center">
                <FaEnvelope className="mr-2 text-gray-500 text-sm" /> Email Address
              </Label>
              <TextInput
                id="email"
                type="email"
                placeholder="your.email@example.com"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                color={errors.email ? 'failure' : 'gray'}
                className="mt-1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <Label htmlFor="phone" value="Phone Number" className="flex items-center">
                <FaPhone className="mr-2 text-gray-500 text-sm" /> Phone Number
              </Label>
              <TextInput
                id="phone"
                type="tel"
                placeholder="10-digit phone number"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onKeyPress={(e) => /\D/.test(e.key) && e.preventDefault()}
                color={errors.phone ? 'failure' : 'gray'}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

             {/* Location Information Section */}
             <div className="space-y-6 col-span-2 mt-6">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-green-600" /> Location Details
              </h2>
              <div className="border-b border-gray-200 pb-2"></div>
            </div>
            
            <div>
              <Label htmlFor="province" value="Province" className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-500 text-sm" /> Province
              </Label>
              <Select 
                id="province"
                name="province" 
                required 
                value={formData.province}
                onChange={handleProvinceChange}
                color={errors.province ? 'failure' : 'gray'}
                className="mt-1"
              >
                <option value="">Select Province</option>
                {Object.keys(provinces).map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </Select>
              {errors.province && (
                <p className="text-red-500 text-sm mt-1">{errors.province}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="district" value="District" className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-500 text-sm" /> District
              </Label>
              <Select 
                id="district"
                name="district" 
                required 
                disabled={!formData.province} 
                value={formData.district} 
                onChange={handleChange}
                color={errors.district ? 'failure' : 'gray'}
                className="mt-1"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </Select>
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">{errors.district}</p>
              )}
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="address" value="Address" className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-500 text-sm" /> Full Address
              </Label>
              <Textarea 
                id="address"
                name="address" 
                placeholder="Enter your complete address"
                required 
                value={formData.address}
                onChange={handleChange}
                color={errors.address ? 'failure' : 'gray'}
                className="mt-1"
                rows={3}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
            

            {/* Land Extent Field */}
            <div>
              <Label htmlFor="extent" value="Land Extent" className="flex items-center">
                <FaTree className="mr-2 text-gray-500 text-sm" /> Land Extent
              </Label>
              <div className="flex gap-2 mt-1">
                <TextInput
                  id="extent"
                  type="number"
                  placeholder="Area"
                  required
                  name="extent"
                  value={formData.extent}
                  onChange={handleChange}
                  onKeyPress={(e) => ['-', 'e', '+', '.'].includes(e.key) && e.preventDefault()}
                  min="1"
                  color={errors.extent ? 'failure' : 'gray'}
                  className="flex-1"
                />
                <Select 
                  name="extentUnit" 
                  value={formData.extentUnit}
                  onChange={handleChange}
                  className="w-1/3"
                >
                  <option value="Acres">Acres</option>
                  <option value="Roods">Roods</option>
                  <option value="Perches">Perches</option>
                </Select>
              </div>
              {errors.extent && <p className="text-red-500 text-sm mt-1">{errors.extent}</p>}
            </div>

            <div>
              <Label htmlFor="numberOfPlants" value="Number of Plants" className="flex items-center">
                <FaTree className="mr-2 text-gray-500 text-sm" /> Total Plants
              </Label>
              <TextInput
                id="numberOfPlants"
                type="number"
                placeholder="Total number of plants"
                required
                name="numberOfPlants"
                value={formData.numberOfPlants}
                onChange={handleChange}
                onKeyPress={(e) => ['-', 'e', '+', '.'].includes(e.key) && e.preventDefault()}
                min="1"
                color={errors.numberOfPlants ? 'failure' : 'gray'}
                className="mt-1"
              />
              {errors.numberOfPlants && (
                <p className="text-red-500 text-sm mt-1">{errors.numberOfPlants}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="numberOfPlantsAffected" value="Affected Plants" className="flex items-center">
                <FaExclamationTriangle className="mr-2 text-gray-500 text-sm" /> Affected Plants
              </Label>
              <TextInput
                id="numberOfPlantsAffected"
                type="number"
                placeholder="Number of plants affected"
                required
                name="numberOfPlantsAffected"
                value={formData.numberOfPlantsAffected}
                onChange={handleChange}
                onKeyPress={(e) => ['-', 'e', '+', '.'].includes(e.key) && e.preventDefault()}
                min="1"
                color={errors.numberOfPlantsAffected ? 'failure' : 'gray'}
                className="mt-1"
              />
              {errors.numberOfPlantsAffected && (
                <p className="text-red-500 text-sm mt-1">{errors.numberOfPlantsAffected}</p>
              )}
            </div>
            

            <div className="col-span-2">
              <Label htmlFor="message" value="Message" className="flex items-center">
                <FaLeaf className="mr-2 text-gray-500 text-sm" /> Description of the Problem
              </Label>
              <Textarea 
                id="message"
                name="message" 
                placeholder="Please describe the issue you're experiencing with your plants (symptoms, when it started, etc.)"
                required 
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="mt-1"
              />
            </div>

            {/* Photo Upload Section */}
            <div className="col-span-2">
              <Label htmlFor="photos" value="Photos" className="flex items-center">
                <FaImage className="mr-2 text-gray-500 text-sm" /> Upload Photos (1-3)
              </Label>
              <input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              
              {photoPreview.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                  {photoPreview.map((url, index) => (
                    <div key={index} className="relative shrink-0 w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button 
              type="submit" 
              gradientDuoTone="greenToBlue" 
              size="lg"
              disabled={isSubmitting}
              className="w-full md:w-1/2"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-3" />
                  Submitting...
                </>
              ) : (
                <>
                  <span className="mr-2">Submit Request</span> <FaArrowRight />
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
      <ToastContainer />
    </div>
  );
}
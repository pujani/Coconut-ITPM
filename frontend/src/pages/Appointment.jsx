import React, { useState, useEffect } from 'react';
import { Button, TextInput, Label, Textarea, Alert, Select, Card, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowRight, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaTree, FaExclamationTriangle, FaLeaf, FaImage } from 'react-icons/fa';
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
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFormData({ ...formData, province, district: '' });
    setDistricts(provinces[province] || []);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setFormData({ ...formData, photos: files });
    
    // Create preview URLs for selected photos
    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreview(previews);
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      photoPreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photoPreview]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName || !/^[A-Za-z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Please enter a valid name (letters only)';
    }
    
    if (!formData.province) {
      newErrors.province = 'Please select a province';
    }
    
    if (!formData.district) {
      newErrors.district = 'Please select a district';
    }
    
    if (!formData.address || formData.address.trim().length < 5) {
      newErrors.address = 'Please enter a valid address (minimum 5 characters)';
    }
    
    if (!formData.extent || !/^\d+$/.test(formData.extent)) {
      newErrors.extent = 'Please enter a valid number';
    }
    
    if (!formData.numberOfPlants || !/^\d+$/.test(formData.numberOfPlants)) {
      newErrors.numberOfPlants = 'Please enter a valid number';
    }
    
    if (!formData.numberOfPlantsAffected || !/^\d+$/.test(formData.numberOfPlantsAffected)) {
      newErrors.numberOfPlantsAffected = 'Please enter a valid number';
    } else if (parseInt(formData.numberOfPlantsAffected) > parseInt(formData.numberOfPlants)) {
      newErrors.numberOfPlantsAffected = 'Affected plants cannot exceed total plants';
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const percentageAffected = (formData.numberOfPlantsAffected / formData.numberOfPlants) * 100;
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'photos') {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    formDataToSend.append('userId', currentUser._id);
    formData.photos.forEach(photo => {
      formDataToSend.append('photos', photo);
    });
    
    try {
      const response = await axios.post('/api/appointment', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Success message with more user-friendly content
      toast.success(
        <div>
          <p className="font-semibold mb-2">Appointment Request Submitted!</p>
          <p>We've received your details about the {percentageAffected.toFixed(1)}% disease-affected plants.</p>
          <p className="mt-2">Our team will contact you soon to schedule a visit.</p>
        </div>,
        {
          position: 'top-center',
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
      
      setTimeout(() => { 
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again later.', {
        position: 'top-right',
        autoClose: 5000,
      });
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
                color={errors.fullName ? 'failure' : 'gray'}
                className="mt-1"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
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
                color={errors.phone ? 'failure' : 'gray'}
                className="mt-1"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
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
            
            {/* Plantation Information Section */}
            <div className="space-y-6 col-span-2 mt-6">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <FaTree className="mr-2 text-green-600" /> Plantation Details
              </h2>
              <div className="border-b border-gray-200 pb-2"></div>
            </div>
            
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
                  color={errors.extent ? 'failure' : 'gray'}
                  className="flex-1"
                />
                <Select 
                  name="extentUnit" 
                  required 
                  value={formData.extentUnit}
                  onChange={handleChange}
                  className="w-1/3"
                >
                  <option value="Acres">Acres</option>
                  <option value="Roods">Roods</option>
                  <option value="Perches">Perches</option>
                </Select>
              </div>
              {errors.extent && (
                <p className="text-red-500 text-sm mt-1">{errors.extent}</p>
              )}
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
                color={errors.numberOfPlantsAffected ? 'failure' : 'gray'}
                className="mt-1"
              />
              {errors.numberOfPlantsAffected && (
                <p className="text-red-500 text-sm mt-1">{errors.numberOfPlantsAffected}</p>
              )}
            </div>
            
            {/* Additional Information Section */}
            <div className="space-y-6 col-span-2 mt-6">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <FaLeaf className="mr-2 text-green-600" /> Additional Information
              </h2>
              <div className="border-b border-gray-200 pb-2"></div>
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
            
            <div className="col-span-2">
              <Label htmlFor="photos" value="Photos" className="flex items-center">
                <FaImage className="mr-2 text-gray-500 text-sm" /> Upload Photos (1-3)
              </Label>
              <div className="mt-1">
                <input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload clear photos of affected plants (max 3 photos)
                </p>
              </div>
              
              {photoPreview.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {photoPreview.map((url, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
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
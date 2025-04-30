import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Carousel, 
  Progress, 
  Dropdown, 
  Modal, 
  Badge
} from 'flowbite-react';
import { 
  FaExclamationTriangle, 
  FaSearch, 
  FaClipboardCheck, 
  FaCalendarCheck, 
  FaInfoCircle, 
  FaClock,
  FaCamera, 
  FaCalendarAlt, 
  FaCommentDots, 
  FaShieldAlt, 
  FaMapMarkedAlt,
  FaChartLine,
  FaLeaf,
  FaBell,
  FaLanguage
} from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';

console.log(GiIcons); // This will log all available icons in the console

import { HiOutlineDocumentReport } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import logo from "../image/coconutlogo.png";
import hero1Image from "../image/hero1.jpg";
import farmer1Image from "../image/farmer1.jpg"; // Renamed to farmer1Image
import ctofficer1Image from "../image/ctofficer1.jpg"; // Renamed to ctofficer1Image
import farmer2Image from "../image/farmer2.jpg"; // Renamed to farmer2Image
import ctofficer2Image from "../image/ctofficer2.jpg"; // Renamed to ctofficer2Image
import farmer3Image from "../image/farmer3.jpg"; // Renamed to farmer3Image

// Placeholder images - replace with actual assets
const heroBackgroundImage = hero1Image;

// Correct assignments
const farmer1 = farmer1Image;
const farmer2 = farmer2Image; // Use farmer2Image instead of ctofficer1
const farmer3 = farmer3Image; // Use farmer3Image instead of farmer2
const beforeTreeImage = farmer1Image; // Use farmer1Image instead of ctofficer2
const afterTreeImage = farmer3Image; // Use farmer3Image instead of farmer3




export default function Home() {
  const [language, setLanguage] = useState('en');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  
  // Translations
  const translations = {
    en: {
      headline: "Protect Your Coconut Crops  Detect Diseases, Get Expert Help, Save Your Harvest!",
      scanButton: "Scan Coconut Disease Now",
      bookButton: "Book CT Officer Appointment",
      chatButton: "Ask Our Farming Chatbot",
      aiScanner: "AI Disease Scanner",
      aiScannerDesc: "Upload photos of your tree â€“ get instant disease diagnosis!",
      pandemicControl: "Pandemic Control",
      pandemicControlDesc: "Southern Province emergency? Book certified officers to inspect your land.",
      riskMap: "Live Risk Map",
      riskMapDesc: "Check disease spread in your area.",
      viewFullMap: "View Full Map & Reports",
      inspections: "Total Inspections This Month",
      detected: "Diseases Detected",
      certificates: "Certificates Issued",
      progress: "Southern Province Pandemic Control",
      inspected: "inspected",
      farmerStories: "Farmer Stories",
      updates: "Latest Updates",
      alert: "NEW DISEASE ALERT: Tap here to book urgent inspection!",
      chatbotTitle: "Ask Our Expert Chatbot",
      chatbotPrompt1: "How to spot red beetle damage?",
      chatbotPrompt2: "What to do if my tree is infected?",
      chatbotPrompt3: "Preventive measures for my farm?",
      emergencyTitle: "Emergency Disease Alert",
      bookNow: "Book Inspection Now",
      close: "Close"
    },
    si: {
      headline: "ඔබගේ පොල් බෝග ආරක්ෂා කරන්න - රෝග හඳුනාගන්න, විශේෂඥ උපකාර ලබාගන්න, ඔබේ අස්වැන්න සුරකින්න!",
    scanButton: "දැන් පොල් රෝග පරිලෝකනය කරන්න",
    bookButton: "CT නිලධාරි හමුවීමක් වෙන් කරන්න",
    chatButton: "අපගේ ගොවිතැන් චැට්බොට් අසන්න",
    aiScanner: "AI රෝග පරික්ෂකය",
    aiScannerDesc: "ඔබේ ගසේ ඡායාරූප උඩුගත කරන්න – ක්ෂණික රෝග විශ්ලේෂණය ලබා ගන්න!",
    pandemicControl: "සංක්‍රමණ පාලනය",
    pandemicControlDesc: "දක්ෂ නිලධාරීන් ඔබේ ඉඩම පරීක්ෂා කිරීමට වෙන්කරන්න.",
    riskMap: "සජීවී අවදානම් සිතියම",
    riskMapDesc: "ඔබේ ප්‍රදේශයේ රෝග පැතිරීම පරීක්ෂා කරන්න.",
    viewFullMap: "සම්පූර්ණ සිතියම සහ වාර්තා බලන්න",
    chatbotTitle: "අපගේ විශේෂඥ චැට්බොට් අසන්න",
    },
    ta: {
      headline: "உங்கள் தென்னை பயிர்களைப் பாதுகாக்கவும் - நோய்களைக் கண்டறியவும், நிபுணர் உதவியைப் பெறவும், உங்கள் அறுவடையைக் காப்பாற்றவும்!",
      scanButton: "இப்போது தென்னை நோயை ஸ்கேன் செய்யவும்",
      bookButton: "CT அதிகாரி சந்திப்பை முன்பதிவு செய்யவும்",
      chatButton: "எங்கள் விவசாய சாட்போட்டை கேளுங்கள்",
      aiScanner: "AI நோய் ஸ்கேனர்",
      aiScannerDesc: "உங்கள் மரத்தின் புகைப்படங்களை பதிவேற்றவும் – உடனடி நோய் பரிசோதனை பெறவும்!",
      pandemicControl: "தீவிர நோய் பராமரிப்பு",
      pandemicControlDesc: "உங்கள் நிலத்தை ஆய்வு செய்ய அதிகாரிகளை முன்பதிவு செய்யவும்.",
      riskMap: "நேரடி அபாய வரைபடம்",
      riskMapDesc: "உங்கள் பகுதியில் நோய்கள் எவ்வாறு பரவுகின்றன எனப் பார்க்கவும்.",
      viewFullMap: "முழு வரைபடத்தையும் அறிக்கைகளையும் பார்க்கவும்",
      chatbotTitle: "எங்கள் நிபுணர் சாட்போட்டை கேளுங்கள்",
    }
  };
  
  const t = translations[language] || translations.en;

  

  return (
    <div className="font-sans">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50">
        <Dropdown 
          label={<FaLanguage className="text-2xl" />}
          arrowIcon={false}
          inline
        >
          <Dropdown.Item onClick={() => setLanguage('en')}>English</Dropdown.Item>
          <Dropdown.Item onClick={() => setLanguage('si')}>සිංහල</Dropdown.Item>
          <Dropdown.Item onClick={() => setLanguage('ta')}>தமிழ்</Dropdown.Item>
        </Dropdown>
      </div>

      {/* Emergency Alert Banner */}
      <motion.div 
        className="bg-red-600 text-white p-4 text-center cursor-pointer"
        onClick={() => setShowEmergencyModal(true)}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="flex items-center justify-center gap-2">
          <FaBell className="text-xl" />
          <span className="font-medium">{t.alert}</span>
        </div>
      </motion.div>

      {/* Hero Section */}
<div className="relative min-h-screen flex items-center overflow-hidden">
  {/* Parallax Background Layers */}
  <div 
    className="absolute inset-0 z-0 transform transition-transform duration-1000"
    style={{
      backgroundImage: `url(${heroBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'brightness(0.8)',
      transform: 'scale(1.1)'
    }}
  />
  
  {/* Gradient Overlay */}
  <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/70 via-black/60 to-transparent" />
  
  {/* Content Container */}
  <div className="container mx-auto px-6 z-20 w-full">
    <div className="flex flex-col items-center text-white max-w-5xl mx-auto">
      {/* Headline with animated underline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          {t.headline}
        </h1>
        <motion.div 
          className="h-1 w-24 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mt-6"
          initial={{ width: 0 }}
          animate={{ width: "6rem" }}
          transition={{ duration: 1.2, delay: 0.6 }}
        />
      </motion.div>

      {/* Subtle tagline */}
      <motion.p
        className="text-xl md:text-2xl text-gray-200 mb-16 max-w-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {t.subheadline || "Experience healthcare reimagined for the modern world"}
      </motion.p>
      
      {/* Call-to-action buttons with hover effects */}
      <motion.div 
        className="grid md:grid-cols-3 gap-8 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            size="xl" 
            className="group h-40 w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-600 rounded-2xl shadow-xl border border-green-400/20"
          >
            <div className="relative">
              <FaCamera className="text-5xl mb-4 transition-all duration-300 group-hover:scale-110" />
              <motion.div 
                className="absolute -inset-1 rounded-full bg-white/20 -z-10"
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-xl font-medium">{t.scanButton}</span>
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to="/appointment" className="block h-full">
            <Button 
              size="xl" 
              className="group h-40 w-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-600 rounded-2xl shadow-xl border border-yellow-400/20"
            >
              <div className="relative">
                <FaCalendarAlt className="text-5xl mb-4 transition-all duration-300 group-hover:scale-110" />
                <motion.div 
                  className="absolute -inset-1 rounded-full bg-white/20 -z-10"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <span className="text-xl font-medium">{t.bookButton}</span>
            </Button>
          </Link>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            size="xl" 
            className="group h-40 w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-600 rounded-2xl shadow-xl border border-blue-400/20"
            onClick={() => setShowChatbot(true)}
          >
            <div className="relative">
              <FaCommentDots className="text-5xl mb-4 transition-all duration-300 group-hover:scale-110" />
              <motion.div 
                className="absolute -inset-1 rounded-full bg-white/20 -z-10"
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-xl font-medium">{t.chatButton}</span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </div>

  {/* Animated Wave Divider */}
  <div className="absolute bottom-0 left-0 w-full overflow-hidden">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1440 320" 
      className="w-full h-auto"
    >
      <motion.path 
        fill="#f9fafb" 
        fillOpacity="1" 
        d="M0,128L60,138.7C120,149,240,171,360,186.7C480,203,600,213,720,197.3C840,181,960,139,1080,133.3C1200,128,1320,160,1380,176L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        initial={{ y: 50, opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: "reverse", 
          ease: "easeInOut" 
        }}
      />
    </svg>
  </div>

  {/* Floating Elements (Optional) */}
  <motion.div 
    className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-blue-500/10 backdrop-blur-sm z-10"
    animate={{ 
      y: [0, -20, 0], 
      opacity: [0.5, 0.8, 0.5],
      scale: [1, 1.1, 1]
    }}
    transition={{ 
      duration: 5, 
      repeat: Infinity, 
      repeatType: "reverse" 
    }}
  />
  <motion.div 
    className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-green-500/10 backdrop-blur-sm z-10"
    animate={{ 
      y: [0, 30, 0], 
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1]
    }}
    transition={{ 
      duration: 7, 
      repeat: Infinity, 
      repeatType: "reverse" 
    }}
  />
</div>

 {/* Key Features Section */}
<section className="py-24 bg-gradient-to-b from-white to-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Advanced Solutions</h2>
      <p className="max-w-2xl mx-auto text-xl text-gray-600">Cutting-edge technology to protect and inform communities worldwide</p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-10">
      {/* AI Scanner Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="group"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
          <div className="p-8 flex-grow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6 transform transition-transform group-hover:scale-110 group-hover:bg-green-200">
              <FaCamera className="text-3xl text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">{t.aiScanner}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{t.aiScannerDesc}</p>
          </div>
          <div className="relative overflow-hidden h-56 w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <span className="text-white font-medium p-6">Learn more about our scanner technology</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Pandemic Control Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="group"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
          <div className="p-8 flex-grow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-6 transform transition-transform group-hover:scale-110 group-hover:bg-amber-200">
              <FaShieldAlt className="text-3xl text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">{t.pandemicControl}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{t.pandemicControlDesc}</p>
            <div className="mt-auto">
              <button className="group relative inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white transition-all duration-200 bg-amber-600 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                <FaCalendarAlt className="mr-2 text-amber-200 group-hover:animate-pulse" />
                <span>{t.bookButton}</span>
                <span className="absolute right-4 opacity-0 transform translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">→</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Risk Map Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="group"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
          <div className="p-8 flex-grow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6 transform transition-transform group-hover:scale-110 group-hover:bg-red-200">
              <FaMapMarkedAlt className="text-3xl text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">{t.riskMap}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{t.riskMapDesc}</p>
          </div>
          <div className="relative h-56 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="px-6 py-3 bg-gray-900/80 text-white rounded-lg flex items-center transform transition-transform duration-300 hover:scale-105">
                <HiOutlineDocumentReport className="mr-2" />
                {t.viewFullMap}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

      
      {/* Quick Stats Dashboard */}
<section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="relative inline-block text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Real-Time Dashboard
        <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></span>
      </h2>
      <p className="mt-8 text-gray-600 max-w-2xl mx-auto">Monitor critical metrics and performance indicators at a glance</p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* First Row - Three Equal Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Inspections Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500 rounded-r-full"></div>
          <div className="p-6 pl-8">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-xl mr-4 shadow-sm">
                <FaChartLine className="text-2xl text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t.inspections}</p>
                <div className="flex items-baseline">
                  <h3 className="text-4xl font-bold text-gray-900">1,250</h3>
                </div>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded">
              <div className="h-1 bg-green-500 rounded" style={{ width: '75%' }}></div>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-right">Monthly target: 1,500</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Detected Issues Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 rounded-r-full"></div>
          <div className="p-6 pl-8">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 p-3 rounded-xl mr-4 shadow-sm">
                <FaLeaf className="text-2xl text-red-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t.detected}</p>
                <p>Hello !</p>
                <div className="flex items-baseline">
                  <h3 className="text-4xl font-bold text-gray-900">320</h3>
                  <span className="ml-2 text-sm font-medium text-red-600 flex items-center">
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Certificates Card */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500 rounded-r-full"></div>
          <div className="p-6 pl-8">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl mr-4 shadow-sm">
                <FaShieldAlt className="text-2xl text-yellow-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t.certificates}</p>
                <div className="flex items-baseline">
                  <h3 className="text-4xl font-bold text-gray-900">95</h3>
                  <span className="ml-2 text-xs font-medium bg-yellow-100 text-yellow-800 py-1 px-2 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Second Row - Full Width Progress Card */}
      <motion.div
        className="lg:col-span-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mt-8">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 rounded-r-full"></div>
          <div className="p-6 pl-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">{t.progress}</h3>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">{t.inspected}</span>
                <span className="text-sm font-bold text-blue-700">65%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Risk Assessment</span>
                <span className="text-sm font-bold text-green-700">82%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Certification</span>
                <span className="text-sm font-bold text-yellow-700">48%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <span className="inline-flex items-center text-xs text-blue-700 hover:text-blue-800 font-medium transition-colors duration-200 cursor-pointer">
                View detailed reports
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>
      

      

      {/* News/Updates Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <span className="border-b-4 border-blue-500 pb-2">{t.updates}</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden h-full hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <Badge color="blue" className="mb-4">NEW</Badge>
                  <h4 className="text-xl font-bold mb-2">Latest Pandemic Guidelines</h4>
                  <p className="text-sm text-gray-500 mb-4">Updated: 2023-10-15</p>
                  <p className="text-gray-600 mb-4">New guidelines from the Coconut Development Board on managing the emerging palm weevil outbreak.</p>
                  <Button color="light" className="mt-auto w-full">
                    Read More
                  </Button>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden h-full hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <Badge color="green" className="mb-4">SUCCESS STORY</Badge>
                  <h4 className="text-xl font-bold mb-2">How Galle Farmers Stopped the Spread</h4>
                  <p className="text-sm text-gray-500 mb-4">Updated: 2023-10-10</p>
                  <p className="text-gray-600 mb-4">Learn how a community approach to disease management halted an outbreak in just two weeks.</p>
                  <Button color="light" className="mt-auto w-full">
                    Read More
                  </Button>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden h-full hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <Badge color="yellow" className="mb-4">SEASONAL</Badge>
                  <h4 className="text-xl font-bold mb-2">Monsoon Care Tips for Coconut Farmers</h4>
                  <p className="text-sm text-gray-500 mb-4">Updated: 2023-10-05</p>
                  <p className="text-gray-600 mb-4">Essential practices to protect your coconut trees during the upcoming monsoon season.</p>
                  <Button color="light" className="mt-auto w-full">
                    Read More
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Chatbot Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
          pill 
          color="blue" 
          className="w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl"
          onClick={() => setShowChatbot(true)}
        >
          <FaCommentDots className="text-2xl" />
        </Button>
      </div>

      {/* Chatbot Modal */}
      <Modal
        show={showChatbot}
        onClose={() => setShowChatbot(false)}
        size="lg"
      >
        <Modal.Header>
          {t.chatbotTitle}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-600">Hi there! I'm your coconut farming assistant. How can I help you today?</p>
            </div>
            
            <div className="space-y-2">
              <Button size="sm" color="light" onClick={() => {}} className="w-full text-left">
                {t.chatbotPrompt1}
              </Button>
              <Button size="sm" color="light" onClick={() => {}} className="w-full text-left">
                {t.chatbotPrompt2}
              </Button>
              <Button size="sm" color="light" onClick={() => {}} className="w-full text-left">
                {t.chatbotPrompt3}
              </Button>
            </div>
            
            <div className="flex mt-4">
              <input
                type="text"
                className="flex-1 rounded-l-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your question here..."
              />
              <Button color="blue" className="rounded-l-none">
                                <FaCommentDots className="mr-2" />
                Send
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Emergency Alert Modal - HCI Optimized */}
      {/* Enhanced Emergency Modal */}
<Modal
  show={showEmergencyModal}
  onClose={() => setShowEmergencyModal(false)}
  size="lg"
  className="font-sans"
>
  {/* Header with visual indicator */}
  <Modal.Header className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
    <div className="flex items-center w-full">
      <div className="flex h-10 w-10 rounded-full bg-amber-100 items-center justify-center mr-3">
        <FaBell className="text-amber-500 text-xl" />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-medium text-gray-800">
          Disease Alert: Preventive Action Needed
        </h3>
        <p className="text-sm text-gray-600 mt-0.5">Nearby outbreak detected • Priority: Medium</p>
      </div>
      <div className="hidden md:block">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          New Alert
        </span>
      </div>
    </div>
  </Modal.Header>
  
  <Modal.Body className="p-0">
    {/* Progress bar to indicate urgency/timeline */}
    <div className="w-full h-1.5 bg-gray-100">
      <div className="h-full bg-amber-500 w-3/4" role="progressbar" aria-label="Response time remaining"></div>
    </div>
    
    <div className="p-5 space-y-5">
      {/* Clear message with visual cue */}
      <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400 flex items-start">
        <div className="hidden sm:block mr-3 mt-0.5">
          <FaBell className="text-amber-500" />
        </div>
        <div>
          <h4 className="font-medium text-amber-800 mb-1">Important Notice</h4>
          <p className="text-gray-700">
            Our monitoring system has detected a disease affecting trees in your region. Early inspection is recommended to protect your crops and prevent further spread.
          </p>
        </div>
      </div>
      
      {/* Content sections with clear visual separation */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center border-b pb-2">
            <div className="bg-amber-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
              <FaBell className="text-amber-600" />
            </div>
            Identification Guide
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-flex mt-1 mr-3 w-5 h-5 bg-amber-100 text-amber-600 rounded-full items-center justify-center text-xs">1</span>
              <div>
                <span className="font-medium block text-gray-700">Leaf Discoloration</span>
                <span className="text-sm text-gray-600">Yellowing or browning starting at edges</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-flex mt-1 mr-3 w-5 h-5 bg-amber-100 text-amber-600 rounded-full items-center justify-center text-xs">2</span>
              <div>
                <span className="font-medium block text-gray-700">Trunk Lesions</span>
                <span className="text-sm text-gray-600">Dark spots or oozing sections on bark</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-flex mt-1 mr-3 w-5 h-5 bg-amber-100 text-amber-600 rounded-full items-center justify-center text-xs">3</span>
              <div>
                <span className="font-medium block text-gray-700">Premature Nut Drop</span>
                <span className="text-sm text-gray-600">Fallen immature nuts around tree base</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-flex mt-1 mr-3 w-5 h-5 bg-amber-100 text-amber-600 rounded-full items-center justify-center text-xs">4</span>
              <div>
                <span className="font-medium block text-gray-700">Pest Presence</span>
                <span className="text-sm text-gray-600">Small insects or larvae on branches</span>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center border-b pb-2">
            <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
              <FaCalendarAlt className="text-green-600" />
            </div>
            Action Plan
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-flex mt-1 mr-3 w-5 h-5 bg-green-100 text-green-600 rounded-full items-center justify-center text-xs">1</span>
              <div>
                <span className="font-medium block text-gray-700">Document Symptoms</span>
                <span className="text-sm text-gray-600">Take clear photos of affected areas</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-flex mt-1 mr-3 w-5 h-5 bg-green-100 text-green-600 rounded-full items-center justify-center text-xs">2</span>
              <div>
                <span className="font-medium block text-gray-700">Isolate Affected Trees</span>
                <span className="text-sm text-gray-600">Mark and restrict access if possible</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-flex mt-1 mr-3 w-5 h-5 bg-green-100 text-green-600 rounded-full items-center justify-center text-xs">3</span>
              <div>
                <span className="font-medium block text-gray-700">Schedule Inspection</span>
                <span className="text-sm text-gray-600">Book a visit with our specialists</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="inline-flex mt-1 mr-3 w-5 h-5 bg-green-100 text-green-600 rounded-full items-center justify-center text-xs">4</span>
              <div>
                <span className="font-medium block text-gray-700">Prepare Information</span>
                <span className="text-sm text-gray-600">Note when symptoms first appeared</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Timeline element */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <FaCalendarAlt className="text-gray-500 mr-2" />
          <h4 className="text-gray-700 font-medium">Response Timeline</h4>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <div className="flex items-center">
              <div className="z-10 flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full">
                <span className="text-amber-700 text-xs">1</span>
              </div>
              <div className="flex-1 h-0.5 w-12 bg-amber-200"></div>
            </div>
            <div className="mt-1 ml-1 text-xs text-gray-500">Now</div>
          </div>
          
          <div className="relative">
            <div className="flex items-center">
              <div className="z-10 flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full">
                <span className="text-amber-700 text-xs">2</span>
              </div>
              <div className="flex-1 h-0.5 w-12 bg-amber-200"></div>
            </div>
            <div className="mt-1 ml-1 text-xs text-gray-500">Inspection</div>
          </div>
          
          <div className="relative">
            <div className="flex items-center">
              <div className="z-10 flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full">
                <span className="text-amber-700 text-xs">3</span>
              </div>
              <div className="flex-1 h-0.5 w-12 bg-amber-200"></div>
            </div>
            <div className="mt-1 ml-1 text-xs text-gray-500">Treatment</div>
          </div>
          
          <div className="relative">
            <div className="flex items-center">
              <div className="z-10 flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="mt-1 ml-1 text-xs text-gray-500">Resolved</div>
          </div>
        </div>
      </div>
      
      {/* Call to action buttons - prominence hierarchy */}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
        <Button 
          color="success" 
          size="lg"
          className="w-full sm:w-auto px-6 font-medium"
          onClick={() => {
            setShowEmergencyModal(false);
            // Open booking flow
          }}
        >
          <div className="flex items-center justify-center">
            <FaCalendarAlt className="mr-2" />
            <span>Schedule Inspection</span>
          </div>
        </Button>
        
        <Button 
          color="light" 
          size="lg"
          className="w-full sm:w-auto border-gray-200 text-gray-700 font-normal"
          onClick={() => {
            setShowEmergencyModal(false);
            // Navigate to info page
          }}
        >
          <div className="flex items-center justify-center">
            <FaBell className="mr-2" />
            <span>View Prevention Guide</span>
          </div>
        </Button>
      </div>
    </div>
  </Modal.Body>
  
  <Modal.Footer className="border-t border-gray-200 bg-gray-50 flex justify-between items-center">
    <div className="text-gray-500 text-sm flex items-center">
      <FaCalendarAlt className="mr-1 text-gray-400" /> 
      <span>Alert ID: #23A719 • Issued today</span>
    </div>
    <div className="flex items-center">
      <button 
        className="text-gray-500 mr-4 text-sm hover:text-gray-700"
        onClick={() => {
          // Handle reminders
        }}
      >
        Remind me later
      </button>
      <Button 
        color="gray" 
        size="sm"
        onClick={() => {
          setShowEmergencyModal(false);
        }}
      >
        Dismiss
      </Button>
    </div>
  </Modal.Footer>
</Modal>

    </div>
  );
}
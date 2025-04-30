import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
};


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartItems] = useState(3);

  const navigate = useNavigate();

  const userMenuRef = useRef(null);
  useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  const navigation = [
    { name: 'Home', href: '/homepage' },
    { name: 'Products', href: '/getproduct' },
    { name: 'Coconut & Other', href: '/getcoconut' },
    { name: 'Expert', href: '/addland' },
  ];

  const handleLogout =  () => {
        
        axios.post("http://localhost:5001/api/authuser/logout", {}, { withCredentials: true });
        setIsLoggedIn(false);
        setIsUserMenuOpen(false);
        navigate("/homepage");
        
  };

  return (
    <nav className="bg-white shadow-lg">
   
      <div className="bg-green-800 text-white py-2 text-center text-sm">
        Buy and Sell fresh coconut related products & others! 🥥 get advice for grow the coconut plants!
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
         
          <div className="flex items-center space-x-2">
            <Link to="/homepage" className="flex items-center">
              <svg 
                className="h-12 w-12 text-green-600 hover:text-green-700 hover:rotate-12 transition-all duration-300 cursor-pointer"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                
  <path 
    d="M12 3L12 22C12 22 14 21 12 18C10 21 12 22 12 22" 
    strokeLinecap="round"
    className="stroke-green-800"
  />


  <path 
    d="M12 3 Q6 2 2 8" 
    className="opacity-80 hover:opacity-100 transition-opacity"
  />
  <path 
    d="M12 3 Q18 2 22 8" 
    className="opacity-80 hover:opacity-100 transition-opacity"
  />
  <path 
    d="M12 4 Q4 6 3 12" 
    className="opacity-80 hover:opacity-100 transition-opacity"
  />
  <path 
    d="M12 4 Q20 6 21 12" 
    className="opacity-80 hover:opacity-100 transition-opacity"
  />


  <path 
    d="M12 5 Q8 8 6 16" 
    className="opacity-60 hover:opacity-80 transition-opacity"
  />
  <path 
    d="M12 5 Q16 8 18 16" 
    className="opacity-60 hover:opacity-80 transition-opacity"
  />


  <circle 
    cx="11" 
    cy="8" 
    r="1.3" 
    className="fill-amber-700 hover:fill-amber-800 transition-colors"
  />
  <circle 
    cx="13" 
    cy="7" 
    r="1.3" 
    className="fill-amber-700 hover:fill-amber-800 transition-colors"
  />
  <circle 
    cx="12" 
    cy="9" 
    r="1.3" 
    className="fill-amber-700 hover:fill-amber-800 transition-colors"
  />


  <path 
    d="M3 22H21" 
    className="stroke-green-900"
    strokeLinecap="round"
  />
              </svg>
              <span className="ml-2 text-2xl font-bold text-green-800">
                Coco<span className="text-amber-600">Nut</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-green-700 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
            
         
            <div className="relative ml-4">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

      
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 hover:text-green-700">
              <ShoppingBagIcon className="h-6 w-6" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>

         
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 hover:text-green-700 focus:outline-none"
              >
                <UserIcon className="h-6 w-6" />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border z-50">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

       
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:text-green-700"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

    
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-t shadow-lg z-40">
            <div className="px-4 pt-4 pb-8 space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-gray-700 hover:text-green-700"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>

                <div className="mt-4 flex space-x-4">
                  <Link
                    to="/cart"
                    className="flex items-center text-gray-700 hover:text-green-700"
                  >
                    <ShoppingBagIcon className="h-5 w-5 mr-1" />
                    Cart ({cartItems})
                  </Link>
                  
                  <Link
                    to={isLoggedIn ? "/account" : "/login"}
                    className="flex items-center text-gray-700 hover:text-green-700"
                  >
                    <UserIcon className="h-5 w-5 mr-1" />
                    {isLoggedIn ? 'Account' : 'Sign In'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-gray-100">
              We are a leading e-commerce platform offering the best coconut products and coconut realted product. Our mission is to provide high-quality items at affordable prices.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-100 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-100 hover:text-white">
                  Expert
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-100 hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-100 hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-100">
                Email: Coconut@gmail.com
              </li>
              <li className="text-sm text-gray-100">
                Phone: +94 (72) 9161426
              </li>
              <li className="text-sm text-gray-100">
                Address: 123 Malabe, Colombo, Srilanka
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white mt-8 pt-8 text-center">
          <p className="text-sm text-white">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
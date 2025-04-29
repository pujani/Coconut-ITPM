import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const Homeproductlist = () => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/product/getproduct")
      .then((res) => {
        setProduct(res.data);
      })
      .catch((e) => {
        console.error("Error getting data", e);
      });
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 py-8">Products</h2>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {product.length > 0 ? (
          
            product.slice(0, 4).map((products) => (
              <a key={products.id} href={`/productdescribe/${products._id}`} className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-200">
                  
                <img
                  alt={products.PName}
                  src={`http://localhost:5001/uploads/${products.PImage}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                </div>
                <div className="p-4">
                                                            <div className="flex justify-between items-start">
                                                              <h3 className="text-lg font-semibold text-gray-900 truncate">{products.PName}</h3>
                                                              <span className="text-lg font-medium text-amber-600">Rs{products.PPrice}.00</span>
                                                            </div>
                                                          </div>

              </a>
            ))
          ) : (
            <p className="text-gray-500">No products available.</p>
          )}
        </div>

        {product.length > 4 && (
          <div className="mt-6 text-right">
            <Link 
              to="/getproduct"  
              className="text-gray-900 hover:text-green-800 transition-colors text-sm font-medium"
            >
              View more
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homeproductlist;

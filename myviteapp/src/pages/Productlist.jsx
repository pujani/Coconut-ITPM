import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layoutt from '../components/Layoutt';
import Layout from '../components/Layout';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const Productlist = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5001/api/product/getproduct")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((e) => {
        console.error("Error getting data", e);
      }).finally(() => {
        setIsLoading(false)
      })
  }, []);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-green-800 border-t-transparent rounded-full animate-spin">
        .
          </div>
        </div>
      ); 
}

  return (
    <div className="bg-white h-screen overflow-y-auto">
      <Layoutt>
        <Layout>
          
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 py-8">Products</h2>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >

<Link 
                                         to={`/productdescribe/${product._id}`}
                                         >

                    <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-200">
                      <img
                        alt={product.PName}
                        src={`http://localhost:5001/uploads/${product.PImage}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    </Link>
                     <div className="p-4">
                                            <div className="flex justify-between items-start">
                                              <h3 className="text-lg font-semibold text-gray-900 truncate">{product.PName}</h3>
                                              <span className="text-lg font-medium text-amber-600">Rs{product.PPrice}.00</span>
                                            </div>
                                            
                                          </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No products available.</p>
              )}
              
            </div>
          </div>
        </Layout>
      </Layoutt>
    </div>
  );
};

export default Productlist;
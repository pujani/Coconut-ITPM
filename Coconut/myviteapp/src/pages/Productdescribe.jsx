import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Layoutt from '../components/Layoutt';
import Layout from '../components/Layout'

const ProductDescribe = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        axios.get(`http://localhost:5001/api/product/getproduct/${id}`)
            .then((res) => {
                setProduct(res.data);
            })
            .catch((e) => {
                console.error("Product not available", e);
            });
    }, [id]);

    const handleQuantity = (type) => {
        setQuantity(prev => Math.max(1, type === 'inc' ? prev + 1 : prev - 1));
    };

    if (!product) {
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
         
        <div className="max-w-6xl mx-auto px-4 py-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-center items-center bg-gray-100 rounded-lg p-4">
                    <img
                        alt={product.PName}
                        src={`http://localhost:5001/uploads/${product.PImage}`}
                        className="w-full h-96 object-contain rounded-lg"
                    />
                </div>

              
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900">{product.PName}</h1>
                    <p className="text-gray-600 text-lg leading-relaxed">{product.PNote}</p>

                    <div className="flex items-center space-x-4">
                        <span className="text-1xl font-bold text-amber-600">
                            Rs.{product.PPrice}.00
                        </span>
                    </div>

                   
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center border rounded-lg">
                            <button
                                onClick={() => handleQuantity('dec')}
                                className="px-4 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                            >
                                -
                            </button>
                            <span className="px-4 py-2 w-16 text-center">{quantity}</span>
                            <button
                                onClick={() => handleQuantity('inc')}
                                className="px-4 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={() => alert(`added to cart: ${quantity}`)}
                            className="flex items-center bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
                        >
                            <ShoppingCartIcon className="h-5 w-5 mr-2" />
                            Add to Cart
                        </button>
                    </div>

            
                    <div className="pt-6 border-t border-gray-200">
                        <dl className="grid grid-cols-2 gap-4">
                            
                            <div className="flex items-center">
                                <dt className="text-gray-500 mr-2">status:</dt>
                                <dd className="text-green-800">{product.PStatus}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
        </Layout>
        </Layoutt>

        </div>
    );
};

export default ProductDescribe;
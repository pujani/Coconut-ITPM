import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Layoutt from '../components/Layoutt';
import Layout from '../components/Layout'


const Coconutdescribe = () => {

    const [coconut,setcoconut] = useState(null);
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        axios.get(`http://localhost:5001/api/coconut/getcoconut/${id}`).then((res) => {
            setcoconut(res.data);
        }).catch((e) => {
            console.error("error getting while data", e);
        })
    },[id])

    const handleQuantity = (type) => {
        setQuantity(prev => Math.max(1, type === 'inc' ? prev + 1 : prev - 1));
    };

    if (!coconut) {
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
                    alt={coconut.PName}
                    src={`http://localhost:5001/uploads/${coconut.CImage}`}
                    className="w-full h-96 object-contain rounded-lg"
                />
            </div>

          
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">{coconut.CName}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{coconut.CNote}</p>

                <div className="flex items-center space-x-4">
                    <span className="text-1xl font-bold text-amber-600">
                        Rs.{coconut.CPrice}.00
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
                        <span className="px-4 py-1 w-16 text-center">{quantity}</span>
                        <button
                            onClick={() => handleQuantity('inc')}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
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

                {/* Additional Info */}
                <div className="pt-6 border-t border-gray-200">
                    <dl className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <dt className="text-gray-500 mr-2">note:</dt>
                            <dd className="text-gray-900">{}</dd>
                        </div>
                        <div className="flex items-center">
                            <dt className="text-gray-500 mr-2">status:</dt>
                            <dd className="text-emerald-600">available</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
    </Layout>
    </Layoutt>

    </div>
  )
}

export default Coconutdescribe

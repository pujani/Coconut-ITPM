import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {

  PencilSquareIcon,
  TrashIcon,

} from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import Layoutt from "../components/Layoutt";
import Layout from "../components/Layout";

const Controllproduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    PName: "",
    PPrice: "",
    PNote: "",
    PStatus:""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, userRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/product/getproduct/${id}`),
          axios.get("http://localhost:5001/api/authuser/profile", {
            withCredentials: true,
          }),
        ]);

        setProduct(productRes.data);
        setUser(userRes.data);

        if (productRes.data) {
          setEditForm({
            PName: productRes.data.PName,
            PPrice: productRes.data.PPrice,
            PNote: productRes.data.PNote,
            PStatus:productRes.data.PStatus,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Handle form changes
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // ✅ Handle product update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5001/api/product/updateproduct/${id}`,
        editForm,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setProduct(response.data.product);
      setIsEditOpen(false);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update product: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/product/deleteproduct/${id}`, {
        withCredentials: true,
      });

      alert("Product deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product: " + (error.response?.data?.message || error.message));
    }
  };


  if (!product || !user) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const isOwner = user._id === product.userId; // Ensure ownership check

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
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                    e.target.alt = "Product image not available";
                  }}
                />
              </div>

              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">{product.PName}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{product.PNote}</p>

                <div className="flex items-center space-x-4">
                  <span className="text-1xl font-bold text-amber-600">
                    Rs.{product.PPrice}
                  </span>
                </div>

                <div className="pt-6 border-t border-gray-200">
                        <dl className="grid grid-cols-2 gap-4">
                            
                            <div className="flex items-center">
                                <dt className="text-gray-500 mr-2">status:</dt>
                                <dd className="text-green-800">{product.PStatus}</dd>
                            </div>
                        </dl>
                    </div>
                   <div className="pt-30">
                                       {isOwner && (
                                 <div className="flex justify-end space-x-4 mb-4">
                                   <button
                                     onClick={() => setIsEditOpen(true)}
                                     className="flex items-center bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                                   >
                                     <PencilSquareIcon className="h-5 w-5 mr-2" />
                                     Edit
                                   </button>
                                   <button
                                     onClick={handleDelete}
                                     className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                                   >
                                     <TrashIcon className="h-5 w-5 mr-2" />
                                     Delete
                                   </button>
                                 </div>
                               )}
                               </div>
              </div>
            </div>

            <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} className="relative z-50">
              <div className="fixed inset-0 flex items-center justify-center">
              <div className="w-full max-w-md p-6 space-y-6 bg-white shadow-md rounded-lg">
              <h2 className="text-center text-2xl font-bold">Edit Product</h2>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <input type="text" name="PName" value={editForm.PName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-green-50" />
                    <input type="text" name="PPrice" value={editForm.PPrice} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-green-50" />
                    <textarea name="PNote" value={editForm.PNote} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-green-50"></textarea>
                    <input type="text" name="PStatus" value={editForm.PStatus} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-green-50" />
                    <button type="submit"
                        className="w-full bg-green-700 hover:bg-green-800 text-white p-2 rounded-md ">Submit</button>
                  </form>
                </div>
              </div>
            </Dialog>
            
          </div>
        </Layout>
      </Layoutt>
    </div>
  );
};

export default Controllproduct;
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Layout from '../components/Layout';
import Layoutt from '../components/Layoutt';
const Register = () => {
    const [authUser, setAuthUser] = useState({
        UName: "",
        UEmail: "",
        Uaddress: "",
        Upassword: ""
    });

    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAuthUser({
            ...authUser,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5001/api/authuser/register", authUser, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            setResult({ message: "You are successfully registered!", success: true });

            setAuthUser({ UName: "", UEmail: "", Uaddress: "", Upassword: "" });

            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setResult({ message: err.response?.data?.message || "Registration failed. Please try again.", success: false });
        }
    };

    return (

        <div className="bg-white h-screen overflow-y-auto">
      
        <Layoutt>
      <Layout>


        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md p-6 space-y-6 bg-white shadow-md rounded-lg">
                <h2 className="text-center text-2xl font-bold">Sign Up</h2>

                {result && (
                    <div className={`p-4 rounded-md flex items-center gap-2 
                        ${result.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {result.success ? <FaCheckCircle className="text-green-500 text-xl" /> : <FaTimesCircle className="text-red-500 text-xl" />}
                        <span>{result.message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            name="UName"
                            type="text"
                            required
                            onChange={handleChange}
                            value={authUser.UName}
                            className="w-full mt-1 p-2 border rounded-md bg-green-50"
                            placeholder="enter the name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="UEmail"
                            type="email"
                            required
                            onChange={handleChange}
                            value={authUser.UEmail}
                            className="w-full mt-1 p-2 border rounded-md bg-green-50"
                           placeholder="enter the email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            name="Uaddress"
                            type="text"
                            required
                            onChange={handleChange}
                            value={authUser.Uaddress}
                            className="w-full mt-1 p-2 border rounded-md bg-green-50"
                           placeholder="enter the address"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            name="Upassword"
                            type="password"  
                            required
                            onChange={handleChange}
                            value={authUser.Upassword}
                            className="w-full mt-1 p-2 border rounded-md bg-green-50"
                           placeholder="enter the password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-700 hover:bg-green-800 text-white p-2 rounded-md "
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm">
                    Already a member? <Link to="/login" className="text-green-800">Sign in</Link>
                </p>
            </div>
        </div>
         </Layout>
              </Layoutt>
            </div>
    );
};

export default Register;

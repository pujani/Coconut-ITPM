import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiLock, FiUser, FiSend } from 'react-icons/fi';
import Layout from '../components/Layout';
import Layoutt from '../components/Layoutt';

const Addmsg = () => {
    const [msg, setMsg] = useState({ MContent: "", MIsPrivate: false, MRecipient: null });
    const [umsg, setUmsg] = useState([]);
    const [users, setUsers] = useState([]);
    const [showRecipientList, setShowRecipientList] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await axios.get("http://localhost:5001/api/authuser/profile", {
                    withCredentials: true
                });
                setCurrentUser(res.data);
            } catch (error) {
                navigate('/login');
            }
        };

        const fetchMessages = async () => {
            try {
                const res = await axios.get("http://localhost:5001/api/massege/messages/", {
                    withCredentials: true
                });
                // Reverse the array to show newest messages at the bottom
                setUmsg(res.data.reverse());
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        const fetchRecipients = async () => {
            try {
                const endpoint = currentUser?.Urole === 'admin' 
                    ? '/authuser/users' 
                    : '/authuser/admins';
                
                const res = await axios.get(`http://localhost:5001/api${endpoint}`, {
                    withCredentials: true
                });
                // Filter out current user and ensure we have valid IDs
                setUsers(res.data.filter(user => 
                    user._id !== currentUser?._id && user._id !== undefined
                ));
            } catch (error) {
                console.error("Error fetching recipients:", error);
            }
        };

        const initialize = async () => {
            await fetchSession();
            await fetchMessages();
            await fetchRecipients();
        };

        initialize();
        const interval = setInterval(fetchMessages, 2000);
        return () => clearInterval(interval);
    }, [navigate, currentUser?.Urole]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 5000); // small delay to ensure layout updated
    
        return () => clearTimeout(timeout);
    }, [umsg]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!msg.MContent.trim()) return;

        try {
            const messageData = {
                MContent: msg.MContent,
                MIsPrivate: msg.MIsPrivate,
                MRecipient: msg.MIsPrivate ? msg.MRecipient : null
            };

            const res = await axios.post(
                "http://localhost:5001/api/massege/messages/",
                messageData,
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );

            setUmsg(prev => [...prev, res.data]); // Add new message to the end
            setMsg({ MContent: "", MIsPrivate: false, MRecipient: null });

        } catch (err) {
            err.response?.status === 401 
                ? navigate('/login')
                : alert(`Error: ${err.response?.data?.error || 'Server error'}`);
        }
    };

    const handleEditMessage = async (messageId) => {
        const newContent = prompt('Edit message:', 
            umsg.find(msg => msg._id === messageId)?.MContent);
        if (!newContent) return;

        try {
            await axios.patch(
                `http://localhost:5001/api/massege/messages/${messageId}`,
                { MContent: newContent },
                { withCredentials: true }
            );
            setUmsg(prev => prev.map(msg => 
                msg._id === messageId ? { ...msg, MContent: newContent } : msg
            ));
        } catch (error) {
            alert('Update failed: ' + (error.response?.data?.error || 'Server error'));
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!confirm('Delete this message permanently?')) return;
        
        try {
            await axios.delete(
                `http://localhost:5001/api/massege/messages/${messageId}`,
                { withCredentials: true }
            );
            setUmsg(prev => prev.filter(msg => msg._id !== messageId));
        } catch (error) {
            alert('Delete failed: ' + (error.response?.data?.error || 'Server error'));
        }
    };



    return (
       
            <Layoutt>
                <Layout>
                    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto rounded-xl bg-white shadow-sm mb-4 p-4 sm:p-6">
                            <div className="space-y-4">
                                {umsg.map(msg => {
                                    const isCurrentUser = msg.Muser?._id === currentUser?._id;
                                    const isPrivate = msg.MIsPrivate;
                                    const isRecipient = msg.MRecipient?._id === currentUser?._id;

                                    return (
                                        <div 
                                            key={msg._id}
                                            className={`flex flex-col p-4 rounded-xl transition-all duration-200 ${
                                                isCurrentUser 
                                                    ? 'ml-auto bg-green-100 text-black max-w-[85%]'
                                                    : 'bg-gray-100 max-w-[85%]'
                                            } ${
                                                isPrivate ? 'border-l-4 border-amber-600' : ''
                                            }`}
                                        >
                                            {/* Message Header */}
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        {msg.Muser?.UName}
                                                        {msg.Muser?.Urole === 'admin' && (
                                                            <span className="ml-2 text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </span>
                                                    {isPrivate && (
                                                        <FiLock className="text-sm text-amber-500" />
                                                    )}
                                                </div>
                                                <span className="text-xs opacity-75">
                                                    {new Date(msg.McreatedAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            {/* Message Content */}
                                            <p className="text-sm leading-relaxed break-words">
                                                {msg.MContent}
                                            </p>

                                            {/* Message Actions */}
                                            {isCurrentUser && (
                                                <div className="flex gap-3 mt-3 justify-end">
                                                    <button
                                                        onClick={() => handleEditMessage(msg._id)}
                                                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                                        aria-label="Edit message"
                                                    >
                                                        <FiEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMessage(msg._id)}
                                                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                                        aria-label="Delete message"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Admin Reply */}
                                            {currentUser?.Urole === 'admin' && isPrivate && !isCurrentUser && (
                                                <button
                                                    onClick={() => setMsg({
                                                        MContent: "",
                                                        MIsPrivate: true,
                                                        MRecipient: msg.Muser._id
                                                    })}
                                                    className="mt-3 text-xs flex items-center gap-1 self-end hover:underline"
                                                >
                                                    <FiSend className="w-3 h-3" />
                                                    Reply Privately
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Message Input Form */}
                        <form 
                            onSubmit={handleSubmit}
                            className="sticky bottom-0 bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200"
                        >
                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="MContent"
                                        value={msg.MContent}
                                        onChange={e => setMsg(prev => ({ ...prev, MContent: e.target.value }))}
                                        placeholder="Write your message..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-800 outline-none transition-all pr-16"
                                        autoComplete="off"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-2 p-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                                        aria-label="Send message"
                                    >
                                        <FiSend className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-4 items-center">
                                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={msg.MIsPrivate}
                                            onChange={e => setMsg(prev => ({
                                                ...prev,
                                                MIsPrivate: e.target.checked,
                                                MRecipient: e.target.checked ? users[0]?._id : null
                                            }))}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-green-700"
                                        />
                                        <span className="flex items-center gap-1">
                                            <FiLock className="w-4 h-4" />
                                            Private Message
                                        </span>
                                    </label>

                                    {msg.MIsPrivate && users.length > 0 && (
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowRecipientList(!showRecipientList)}
                                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <FiUser className="w-4 h-4 text-gray-600" />
                                                <span className="text-sm">
                                                    {users.find(u => u._id === msg.MRecipient)?.UName || 'Select Recipient'}
                                                </span>
                                            </button>
                                            
                                            {showRecipientList && (
                                                <div className="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                                    {users.map(user => (
                                                        <div
                                                            key={user._id}
                                                            onClick={() => {
                                                                setMsg(prev => ({ ...prev, MRecipient: user._id }));
                                                                setShowRecipientList(false);
                                                            }}
                                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-sm"
                                                        >
                                                            <span>{user.UName}</span>
                                                            {user.Urole === 'admin' && (
                                                                <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                                                                    Admin
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </Layout>
            </Layoutt>
       
    );
};

export default Addmsg;
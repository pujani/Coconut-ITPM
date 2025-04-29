import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Layoutt from "../components/Layoutt";
import { EllipsisVerticalIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllCoconuts, setShowAllCoconuts] = useState(false);
  const [products, setProducts] = useState([]);
  const [coconuts, setCoconuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const [setShowButton] = useState(false);
  

  const navigate = useNavigate();
  
  
       useEffect(() => {
         if (containerRef.current) {
           containerRef.current.scrollTo({
             top: containerRef.current.scrollHeight, 
             behavior: 'smooth', 
           });
         }
       }, []);
     
       const checkScroll = () => {
         if (!containerRef.current) return;
         const { scrollTop } = containerRef.current;
         setShowButton(scrollTop > 200);
       };
     
       useEffect(() => {
         const currentContainer = containerRef.current;
         currentContainer?.addEventListener('scroll', checkScroll);
         return () => currentContainer?.removeEventListener('scroll', checkScroll);
       }, []);
     

       const handleAi = (e) => {
        navigate('/addmsg')
      }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, productsRes, coconutRes] = await Promise.all([
          axios.get("http://localhost:5001/api/authuser/profile", { withCredentials: true }),
          axios.get('http://localhost:5001/api/product/dashboard', { withCredentials: true }),
          axios.get('http://localhost:5001/api/coconut/dashboard', { withCredentials: true })
        ]);
        
        setUser(profileRes.data);
        setProducts(productsRes.data);
        setCoconuts(coconutRes.data);
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const SectionHeader = ({ title, count, showAll, setShowAll, items }) => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-500">{count} items</span>
        {items.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-gray-800  hover:text-emerald-800 transition-colors text-sm font-medium flex items-center gap-1"
          >
            {showAll ? (
              <>
                <span>Show Less</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>Show More</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  const ProductCard = ({ item, type }) => (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-gray-100">
        <img
          alt={type === 'product' ? item.PName : item.CName}
          src={`http://localhost:5001/uploads/${type === 'product' ? item.PImage : item.CImage}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300';
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {type === 'product' ? item.PName : item.CName}
          </h3>
          <span className="text-lg font-medium text-amber-600">
            Rs{type === 'product' ? item.PPrice : item.CPrice}.00
          </span>
        </div>
    
        <Link
          to={`/${type === 'product' ? 'controllproduct' : 'controllcoconut'}/${item._id}`}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-700 transition-colors"
        >
          <EllipsisVerticalIcon className="w-4 h-4 mr-2" />
          View Details
        </Link>
      </div>
    </div>
  );

  const ActionButton = ({ onClick, children, icon: Icon }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  );

  const ProfileField = ({ label, value }) => (
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-lg text-gray-900 truncate">{value || '-'}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white h-screen overflow-y-auto">
        <Layoutt>
          <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="animate-pulse space-y-8">
            
                <div className="h-40 bg-gray-100 rounded-2xl"></div>
                
          
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-16 bg-gray-100 rounded-lg"></div>
                  <div className="h-16 bg-gray-100 rounded-lg"></div>
                </div>

             
                <div className="space-y-4">
                  <div className="h-8 bg-gray-100 w-1/3 rounded"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-72 bg-gray-100 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        </Layoutt>
      </div>
    );
  }

  return (
    <div className="bg-white h-screen overflow-y-auto">
      <Layoutt>
        <Layout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Overview</h2>
                <UserCircleIcon className="w-12 h-12 text-gray-400" />
              </div>
              
              {user ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ProfileField label="Full Name" value={user.UName} />
                  <ProfileField label="Email Address" value={user.UEmail} />
                  <ProfileField label="Physical Address" value={user.Uaddress} />
                  <ProfileField label="Account Role" value={user.Urole} />
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Failed to load profile information
                </div>
              )}
            </div>

       
<div className={`grid grid-cols-1 ${user?.Urole === 'admin' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-8`}>
  <ActionButton onClick={() => navigate("/addproduct")} icon={PlusIcon}>
    Add New Product
  </ActionButton>
  <ActionButton onClick={() => navigate("/addcoconut")} icon={PlusIcon}>
    Add New Coconut & Other
  </ActionButton>
  
  {user?.Urole === 'admin' && (
    <ActionButton onClick={() => navigate("/addnote")} icon={PlusIcon}>
      Add New Post
    </ActionButton>
  )}
</div>

          

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <SectionHeader
                title="My Products"
                count={products.length}
                showAll={showAllProducts}
                setShowAll={setShowAllProducts}
                items={products}
              />

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.slice(0, showAllProducts ? products.length : 4).map((product) => (
                    <ProductCard key={product._id} item={product} type="product" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">No products available yet</p>
                  <button
                    onClick={() => navigate("/addproduct")}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Add your first product →
                  </button>
                </div>
              )}
            </div>

       
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <SectionHeader
                title="My Coconuts & Others"
                count={coconuts.length}
                showAll={showAllCoconuts}
                setShowAll={setShowAllCoconuts}
                items={coconuts}
              />

              {coconuts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {coconuts.slice(0, showAllCoconuts ? coconuts.length : 4).map((coconut) => (
                    <ProductCard key={coconut._id} item={coconut} type="coconut" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">No coconuts available yet</p>
                  <button
                    onClick={() => navigate("/addcoconut")}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Add your first coconut & other →
                  </button>
                </div>
              )}
            </div>
          </div>
        </Layout>
      </Layoutt>

      <button 
          onClick={handleAi}
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-200"
          aria-label="Scroll to top"
        >
         <div className="relative group">
  <button 
    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
    aria-describedby="ai-tooltip"
  >
   <svg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 24 24" 
     className='text-gray-800'
     width="24" 
     height="24" 
     aria-label="Message"
     role="img">
  <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
</svg>
  </button>
  
 
  <div 
    id="ai-tooltip"
    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block 
               bg-gray-800 text-white text-sm px-3 py-1 rounded-md 
               after:content-[''] after:absolute after:top-full after:left-1/2
               after:-translate-x-1/2 after:border-8 after:border-x-transparent 
               after:border-b-transparent after:border-t-gray-800"
  >
    The Community 

    <span className="sr-only">(Community Help)</span>
  </div>
</div>
        </button>


    </div>
  );
};

export default Dashboard;



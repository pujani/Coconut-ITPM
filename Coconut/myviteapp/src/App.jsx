import React from "react";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import "./index.css";
import Prehomepage from "./pages/Prehomepage";
import Homepage from "./pages/Homepage";
import Addproduct from "./pages/Addproduct";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Addland from "./pages/Addland";
import Productlist from "./pages/Productlist";
import Coconutlist from "./pages/Coconutlist";
import Addcoconut from "./pages/Addcoconut";
import Productdescribe from "./pages/Productdescribe";
import Dashboard from "./pages/Dashboard";
import Coconutdescribe from "./pages/Coconutdescribe";
import Addnote from "./pages/Addnote";
import Controllproduct from "./pages/controllproduct";
import Addmsg from "./pages/Addmsg";
import Controllcoconut from "./pages/Controllcoconut";

function App() {
  return (
    <div>
     
    <Router>


    <Routes>
      <Route path="/" element={<Prehomepage/>}/>
      <Route path="/homepage" element={<Homepage/>}/>
      <Route path="/addproduct" element={<Addproduct/>}/>
      <Route path="/addcoconut" element={<Addcoconut/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/addland" element={<Addland/>}/>
      <Route path="/getproduct" element={<Productlist/>}/>
      <Route path="/getcoconut" element={<Coconutlist/>}/>
      <Route path="/productdescribe/:id" element={<Productdescribe/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/coconutdescribe/:id" element={<Coconutdescribe/>}/>
      <Route path="/addnote" element={<Addnote/>}/>
      <Route path="/controllproduct/:id" element={<Controllproduct/>}/>
      <Route path="/controllcoconut/:id" element={<Controllcoconut/>}/>
      <Route path="/addmsg" element={<Addmsg/>}/>
  

    </Routes>

    

    </Router>
    
    </div>
  );
}

export default App;

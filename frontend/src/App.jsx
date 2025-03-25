import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Restaurants from "./pages/Home";
import Appointment from "./pages/Appointment";
import CreateClient from "./pages/CreateReport";
import Signup from "./pages/Singup";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import UpdateClient from "./pages/UpdateClient";
import HeaderAdmin from "./components/HeaderAdmin";
import PrivateRoute from "./components/PrivateRoute";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import CreateReport from "./pages/CreateReport";

function Layout() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/update-client/");

  return (
    <>
      {isAdminRoute ? <HeaderAdmin /> : <Header />}
      <Routes>
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route  element={<PrivateRoute />}>
          <Route path="/" element={<Restaurants />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/client" element={<CreateClient />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/createReport" element={<CreateReport />} />
          <Route path="/update-client/:id" element={<UpdateClient />} />
       
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <Layout />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

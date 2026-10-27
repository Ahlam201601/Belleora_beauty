
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ClientProtectedRoute from "./components/ClientProtectedRoute";

import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Booking from "./pages/Booking";
import ClientRegister from "./pages/ClientRegister";
import ClientLogin from "./pages/ClientLogin";
import Confirmation from "./pages/Confirmation";
import MyAppointments from "./pages/MyAppointments";

import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./pages/admin/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Appointments from "./pages/admin/Appointments";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminClients from "./pages/admin/AdminClients";

function App() {
  return (
    <Routes>
      {/* Public website */}
      <Route
        path="/*"
        element={
          <>
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/confirmation" element={<Confirmation />} />

              <Route
                path="/client/register"
                element={<ClientRegister />}
              />

              <Route
                path="/client/login"
                element={<ClientLogin />}
              />

              {/* Booking requires client authentication */}
              <Route element={<ClientProtectedRoute />}>
                <Route path="/booking" element={<Booking />} />
                <Route path="/my-appointments" element={<MyAppointments />} />
              </Route>
            </Routes>

            <Footer />
          </>
        }
      />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/calendar"
        element={<AdminCalendar />}
      />

      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute>
            <AdminClients />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

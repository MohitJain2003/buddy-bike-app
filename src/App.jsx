import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Bikes from './pages/Bikes';
import BikeDetails from './pages/BikeDetails';
import Contact from './pages/Contact';
import EmiCalculator from './pages/EmiCalculator';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBikes from './pages/admin/ManageBikes';
import AddBike from './pages/admin/AddBike';
import EditBike from './pages/admin/EditBike';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bikes" element={<Bikes />} />
            <Route path="/bikes/:id" element={<BikeDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/emi-calculator" element={<EmiCalculator />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/manage-bikes" element={<ProtectedRoute><ManageBikes /></ProtectedRoute>} />
            <Route path="/admin/add-bike" element={<ProtectedRoute><AddBike /></ProtectedRoute>} />
            <Route path="/admin/edit-bike/:id" element={<ProtectedRoute><EditBike /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

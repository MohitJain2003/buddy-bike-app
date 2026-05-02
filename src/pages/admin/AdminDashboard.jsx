import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabaseClient } from '../../utils/supabaseClient';
import ThreeBg from '../../components/ThreeBg';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabaseClient.auth.getSession();
      if (!data.session) {
        navigate('/admin');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    alert("Logged out successfully");
    navigate('/admin');
  };

  return (
    <>
      <ThreeBg />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
        <div style={{ textAlign: 'center', width: '90%', maxWidth: '800px' }}>
          
          <h1 style={{ marginBottom: '40px', color: '#ff0000', textShadow: '0 0 15px #ff0004', fontSize: '36px' }}>Admin Panel</h1>
          
          <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/admin/add-bike" style={{ textDecoration: 'none' }}>
              <div 
                style={{ background: '#111', padding: '30px', borderRadius: '15px', width: '220px', color: 'white', transition: '0.3s', boxShadow: '0 0 10px rgba(0,255,255,0.2)', cursor: 'pointer' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 0 25px rgb(255, 0, 0)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 10px rgba(0,255,255,0.2)'; }}
              >
                <h2 style={{ marginBottom: '10px', color: '#ff0000' }}>Add Bike</h2>
                <p>Add new bike listings</p>
              </div>
            </Link>

            <Link to="/admin/manage-bikes" style={{ textDecoration: 'none' }}>
              <div 
                style={{ background: '#111', padding: '30px', borderRadius: '15px', width: '220px', color: 'white', transition: '0.3s', boxShadow: '0 0 10px rgba(0,255,255,0.2)', cursor: 'pointer' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 0 25px rgb(255, 0, 0)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 10px rgba(0,255,255,0.2)'; }}
              >
                <h2 style={{ marginBottom: '10px', color: '#ff0000' }}>Manage Bikes</h2>
                <p>Edit / Delete existing bikes</p>
              </div>
            </Link>
          </div>

          <button 
            onClick={handleLogout}
            style={{ marginTop: '40px', padding: '12px 30px', border: 'none', background: '#ff3b3b', color: 'white', fontSize: '16px', borderRadius: '8px', cursor: 'pointer', transition: '0.3s' }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#ff0000'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#ff3b3b'; e.currentTarget.style.transform = 'none'; }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

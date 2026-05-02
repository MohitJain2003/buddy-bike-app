import { useState, useEffect } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import ThreeBg from '../../components/ThreeBg';

const ManageBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        navigate('/admin');
        return;
      }
      fetchBikes();
    };
    checkAuthAndLoad();
  }, [navigate]);

  const fetchBikes = async () => {
    setLoading(true);
    let { data, error } = await supabaseClient
      .from("bikes")
      .select("*")
      .order("createdAt", { ascending: false });

    if (!error) {
      setBikes(data);
    } else {
      console.error(error);
      alert("Failed to load bikes: " + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bike? This action cannot be undone.")) {
      try {
        const { error } = await supabaseClient
          .from("bikes")
          .delete()
          .eq("id", id);
        
        if (error) {
          console.error("Delete error:", error);
          alert("Failed to delete: " + error.message);
        } else {
          setBikes(bikes.filter(b => b.id !== id));
        }
      } catch (err) {
        console.error("System error:", err);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <ThreeBg />
      <section className="admin-section" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="glow page-title" style={{ marginBottom: '30px' }}>Manage Bikes</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
          <Link to="/admin/dashboard"><button className="neon-btn">Dashboard</button></Link>
          <Link to="/admin/add-bike"><button className="neon-btn">Add Bike</button></Link>
        </div>

        <div className="table-container" style={{ background: '#111', padding: '20px', borderRadius: '15px', overflowX: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', color: 'white', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ padding: '15px' }}>Vehicle No.</th>
                <th style={{ padding: '15px' }}>Bike Name</th>
                <th style={{ padding: '15px' }}>Status</th>
                <th style={{ padding: '15px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#aaa' }}>Loading bikes from database...</td>
                </tr>
              ) : bikes.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#aaa' }}>No bikes found.</td>
                </tr>
              ) : (
                bikes.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ color: '#fc0e0e', fontFamily: 'monospace', padding: '15px' }}>{b.vehicleNumber || '-'}</td>
                    <td style={{ fontWeight: 'bold', fontSize: '16px', padding: '15px' }}>{b.name}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ 
                        padding: '5px 10px', 
                        borderRadius: '5px', 
                        fontSize: '14px',
                        background: b.status === 'Sold' ? '#fc0e0e' : '#00e5ff',
                        color: b.status === 'Sold' ? 'white' : 'black' 
                      }}>
                        {b.status || "Available"}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <Link to={`/admin/edit-bike/${b.id}`} style={{ marginRight: '10px' }}>
                        <button style={{ padding: '8px 15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        style={{ padding: '8px 15px', background: '#fc0e0e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default ManageBikes;

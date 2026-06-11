import { useState, useEffect } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import ThreeBg from '../../components/ThreeBg';
import { PlusCircle, Pencil, Trash2, LayoutDashboard, Bike } from 'lucide-react';

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
      <section className="admin-section">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-subtle)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-lg)', color: 'var(--primary)' }}>
              <Bike size={22} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Manage Bikes</h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{bikes.length} total listings</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/admin/dashboard" className="btn btn-secondary btn-sm">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/admin/add-bike" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Add Bike
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bike Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <div className="spinner" style={{ margin: '0 auto' }} />
                    <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>Loading bikes...</p>
                  </td>
                </tr>
              ) : bikes.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                    <Bike size={32} style={{ color: 'var(--text-muted)', opacity: 0.4, margin: '0 auto var(--space-3)', display: 'block' }} />
                    <p style={{ color: 'var(--text-muted)' }}>No bikes found. <Link to="/admin/add-bike" style={{ color: 'var(--primary)' }}>Add your first bike</Link></p>
                  </td>
                </tr>
              ) : (
                bikes.map(b => (
                  <tr key={b.id}>
                    <td data-label="Bike Name">
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{b.name}</div>
                      {b.vehicleNumber && (
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>{b.vehicleNumber}</div>
                      )}
                    </td>
                    <td data-label="Brand" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{b.brand || '-'}</td>
                    <td data-label="Price" style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--primary)' }}>
                      ₹ {!isNaN(b.price) ? Number(b.price).toLocaleString('en-IN') : b.price}
                    </td>
                    <td data-label="Status">
                      <span className={`status-badge ${b.status === 'Sold' ? 'status-sold' : 'status-available'}`}>
                        {b.status || 'Available'}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-start' }}>
                        <Link to={`/admin/edit-bike/${b.id}`} className="action-btn edit-btn">
                          <Pencil size={14} /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="action-btn delete-btn"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
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

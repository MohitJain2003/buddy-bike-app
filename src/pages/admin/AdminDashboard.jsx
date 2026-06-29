import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabaseClient } from '../../utils/supabaseClient';
import ThreeBg from '../../components/ThreeBg';
import { LayoutDashboard, PlusCircle, List, LogOut, Bike, TrendingUp, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabaseClient.from('bikes').select('*');
      if (data) {
        const total = data.length;
        const available = data.filter(b => b.status !== 'Sold').length;
        const sold = data.filter(b => b.status === 'Sold').length;
        const revenue = data.filter(b => b.status === 'Sold').reduce((sum, b) => sum + (Number(b.price) || 0), 0);
        setStats({ total, available, sold, revenue });
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    navigate('/admin');
  };

  const cards = [
    {
      to: '/admin/add-bike',
      icon: <PlusCircle size={28} />,
      title: 'Add New Bike',
      description: 'Create a new bike listing with images and details',
      color: 'var(--primary)',
    },
    {
      to: '/admin/manage-bikes',
      icon: <List size={28} />,
      title: 'Manage Bikes',
      description: 'Edit, update, or delete existing bike listings',
      color: 'var(--secondary)',
    },
  ];

  const statItems = [
    { icon: <Bike size={20} />, label: 'Total Bikes', value: stats.total, color: 'var(--text-primary)' },
    { icon: <TrendingUp size={20} />, label: 'Available', value: stats.available, color: 'var(--success)' },
    { icon: <DollarSign size={20} />, label: 'Sold', value: stats.sold, color: 'var(--warning)' },
    { icon: <DollarSign size={20} />, label: 'Revenue', value: `₹ ${stats.revenue.toLocaleString('en-IN')}`, color: 'var(--primary)' },
  ];

  return (
    <>
      <ThreeBg />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 'var(--space-6)' }}>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-subtle)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-lg)', color: 'var(--primary)' }}>
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Admin Dashboard</h1>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Manage your inventory</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              <LogOut size={16} /> Logout
            </button>
          </div>

          {/* Stats */}
          <div className="admin-stats-grid">
            {statItems.map((stat, i) => (
              <div key={i} className="card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
                <div style={{ color: stat.color, display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>{stat.icon}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
 
          {/* Action Cards */}
          <div className="admin-action-grid">
            {cards.map((card, i) => (
              <Link key={i} to={card.to} style={{ textDecoration: 'none' }}>
                <div
                  className="card admin-form-card"
                  style={{
                    color: 'var(--text-primary)',
                    transition: 'all var(--transition-base)',
                    cursor: 'pointer',
                    height: '100%',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = `0 8px 30px ${card.color}20`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${card.color}15`, border: `1px solid ${card.color}30`, borderRadius: 'var(--radius-lg)', color: card.color, marginBottom: 'var(--space-5)' }}>
                    {card.icon}
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>{card.title}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

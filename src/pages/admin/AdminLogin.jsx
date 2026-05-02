import { useState } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import ThreeBg from '../../components/ThreeBg';
import '../../index.css'; // Global styles

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login Successful ✅");
    navigate('/admin/dashboard');
  };

  return (
    <>
      <ThreeBg />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
        <div className="login-container" style={{ background: '#020617', padding: '40px', borderRadius: '10px', width: '300px', textAlign: 'center', boxShadow: '0 0 15px cyan' }}>
          <h2 style={{ marginBottom: '20px', color: '#ff0000' }}>Admin Login</h2>
          
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Enter Email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', margin: '10px 0', border: 'none', borderRadius: '5px' }}
            />
            <input 
              type="password" 
              placeholder="Enter Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', margin: '10px 0', border: 'none', borderRadius: '5px' }}
            />
            
            <button 
              type="submit"
              style={{ width: '100%', padding: '10px', background: 'transparent', border: '2px solid #ff0000', color: '#ff0000', cursor: 'pointer', transition: '0.3s', marginTop: '10px' }}
              onMouseOver={(e) => { e.target.style.background = '#ff002b'; e.target.style.color = 'black'; }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#ff0000'; }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;

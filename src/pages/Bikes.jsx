import { useState, useEffect } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import { useLocation } from 'react-router-dom';
import BikeCard from '../components/BikeCard';

const Bikes = () => {
  const [bikesData, setBikesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bikesPerPage = 8;
  const [brands, setBrands] = useState([]);

  // Filters state
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const location = useLocation();

  useEffect(() => {
    const fetchBikes = async () => {
      const { data, error } = await supabaseClient
        .from('bikes')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error(error);
        alert('Failed to load bikes');
        return;
      }

      setBikesData(data);
      
      const uniqueBrands = [...new Set(data.map(b => b.brand).filter(Boolean))];
      setBrands(uniqueBrands);

      // Check URL params for initial brand filter
      const params = new URLSearchParams(location.search);
      const initialBrand = params.get('brand');
      if (initialBrand) {
        setBrandFilter(initialBrand);
        if (!uniqueBrands.includes(initialBrand)) {
          setBrands(prev => [...prev, initialBrand]);
        }
      } else {
        setFilteredData(data);
      }
    };

    fetchBikes();
  }, [location.search]);

  useEffect(() => {
    let filtered = bikesData.filter(bike => {
      const matchesSearch = (bike.name || '').toLowerCase().includes(search.toLowerCase());
      const matchesBrand = brandFilter === '' || bike.brand === brandFilter;
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || Infinity;
      const matchesPrice = bike.price >= min && bike.price <= max;
      
      return matchesSearch && matchesBrand && matchesPrice;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [search, brandFilter, minPrice, maxPrice, bikesData]);

  const totalPages = Math.ceil(filteredData.length / bikesPerPage);
  const start = (currentPage - 1) * bikesPerPage;
  const paginatedBikes = filteredData.slice(start, start + bikesPerPage);

  return (
    <section className="bikes-page">
      <h2 className="glow page-title" style={{ fontSize: '28px' }}>Available Bikes</h2>

      <div className="filters-grid">
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="custom-input" 
          placeholder="Search bike..." 
        />
        <select 
          value={brandFilter} 
          onChange={(e) => setBrandFilter(e.target.value)} 
          className="custom-input"
        >
          <option value="">All Brands</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <input 
          type="number" 
          value={minPrice} 
          onChange={(e) => setMinPrice(e.target.value)} 
          className="custom-input" 
          placeholder="Min Price" 
        />
        <input 
          type="number" 
          value={maxPrice} 
          onChange={(e) => setMaxPrice(e.target.value)} 
          className="custom-input" 
          placeholder="Max Price" 
        />
      </div>

      <div className="gallery-grid">
        {paginatedBikes.length === 0 ? (
          <h4 style={{ color: '#aaa', gridColumn: '1 / -1', textAlign: 'center', marginTop: '50px' }}>
            No bikes found matching your filters.
          </h4>
        ) : (
          paginatedBikes.map(bike => <BikeCard key={bike.id} bike={bike} />)
        )}
      </div>

      <div className="pagination-container">
        <button 
          className="neon-btn" 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span id="pageNumber" style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button 
          className="neon-btn" 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
          disabled={currentPage >= totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Bikes;

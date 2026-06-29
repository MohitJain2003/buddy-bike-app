import { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import { useLocation } from 'react-router-dom';
import BikeCard from '../components/BikeCard';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, Motorbike } from 'lucide-react';

const Bikes = () => {
  const [bikesData, setBikesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const bikesPerPage = 8;
  const [brands, setBrands] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters state
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const location = useLocation();

  const activeFilterCount = [brandFilter, minPrice, maxPrice].filter(Boolean).length;

  const clearFilters = useCallback(() => {
    setSearch('');
    setBrandFilter('');
    setMinPrice('');
    setMaxPrice('');
  }, []);

  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from('bikes')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setBikesData(data);
      const uniqueBrands = [...new Set(data.map(b => b.brand).filter(Boolean))];
      setBrands(uniqueBrands);

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
      setLoading(false);
    };

    fetchBikes();
  }, [location.search]);

  useEffect(() => {
    let filtered = bikesData.filter(bike => {
      const matchesSearch = (bike.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (bike.brand || '').toLowerCase().includes(search.toLowerCase());
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
  const showingStart = filteredData.length === 0 ? 0 : start + 1;
  const showingEnd = Math.min(start + bikesPerPage, filteredData.length);

  return (
    <section className="bikes-page">
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="page-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-2)' }}>Explore Bikes</h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Find your perfect ride from our curated collection</p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="filter-toggle-btn" style={{ display: 'none' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal size={16} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        {activeFilterCount > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-wrapper">
        <div className="filters-grid">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="custom-input"
              placeholder="Search by name or brand..."
              style={{ paddingLeft: '40px' }}
            />
          </div>
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

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Active:</span>
            {brandFilter && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 10px', background: 'var(--primary-subtle)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 600 }}>
                {brandFilter}
                <button onClick={() => setBrandFilter('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={12} /></button>
              </span>
            )}
            {minPrice && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 10px', background: 'var(--primary-subtle)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 600 }}>
                Min ₹{Number(minPrice).toLocaleString('en-IN')}
                <button onClick={() => setMinPrice('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={12} /></button>
              </span>
            )}
            {maxPrice && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 10px', background: 'var(--primary-subtle)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 600 }}>
                Max ₹{Number(maxPrice).toLocaleString('en-IN')}
                <button onClick={() => setMaxPrice('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={12} /></button>
              </span>
            )}
            <button onClick={clearFilters} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      {!loading && (
        <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{showingStart}-{showingEnd}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{filteredData.length}</strong> bikes
          </p>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)' }}>Loading bikes...</p>
          </div>
        ) : paginatedBikes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Motorbike size={48} />
            </div>
            <h4>No bikes found</h4>
            <p>Try adjusting your filters or search terms</p>
            {activeFilterCount > 0 && (
              <button className="btn btn-outline" style={{ marginTop: 'var(--space-4)' }} onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          paginatedBikes.map(bike => <BikeCard key={bike.id} bike={bike} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Bikes;

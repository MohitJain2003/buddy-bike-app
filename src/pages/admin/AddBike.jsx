import { useState, useEffect } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import ThreeBg from '../../components/ThreeBg';

const AddBike = () => {
  const [formData, setFormData] = useState({
    name: '',
    vehicleNumber: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    kmDriven: '',
    status: 'Available'
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        navigate('/admin');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const compressImage = (file, maxWidth = 1920, quality = 0.85) => {
    return new Promise((resolve) => {
      const maxSizeInBytes = 1048576; 
      if (file.size <= maxSizeInBytes) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }, 'image/jpeg', quality);
        };
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let urls = [];

      for (let file of files) {
        const processedFile = await compressImage(file);
        const fileName = Date.now() + "-" + processedFile.name;

        const { error: uploadError } = await supabaseClient.storage
          .from("bike-images")
          .upload(fileName, processedFile);

        if (uploadError) {
          alert(uploadError.message);
          setIsSubmitting(false);
          return;
        }

        const { data } = supabaseClient.storage
          .from("bike-images")
          .getPublicUrl(fileName);

        urls.push(data.publicUrl);
      }

      const bikeData = {
        name: formData.name,
        vehicleNumber: formData.vehicleNumber,
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        price: Number(formData.price),
        kmDriven: Number(formData.kmDriven),
        imageUrls: urls,
        status: formData.status
      };

      const { error } = await supabaseClient
        .from("bikes")
        .insert([bikeData]);

      if (error) {
        alert(error.message);
        setIsSubmitting(false);
        return;
      }

      alert("Bike Added Successfully ✅");
      navigate('/admin/manage-bikes');
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ThreeBg />
      <section className="admin-section" style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
        <h2 className="glow page-title" style={{ marginBottom: '30px', textAlign: 'center' }}>Add New Bike</h2>

        <div className="bike-card" style={{ padding: '30px', background: '#0a0a0a', textAlign: 'left' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
              <div className="input-group">
                <label>Bike Name</label>
                <input type="text" name="name" className="custom-input" placeholder="e.g. Royal Enfield Classic 350" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Vehicle No. (Admin)</label>
                <input type="text" name="vehicleNumber" className="custom-input" placeholder="e.g. MH-12-AB-1234" value={formData.vehicleNumber} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <div className="input-group">
                <label>Brand</label>
                <input type="text" name="brand" className="custom-input" placeholder="e.g. Royal Enfield" required value={formData.brand} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Model</label>
                <input type="text" name="model" className="custom-input" placeholder="e.g. Classic 350" required value={formData.model} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <div className="input-group">
                <label>Manufacturing Year</label>
                <input type="number" name="year" className="custom-input" placeholder="2024" required value={formData.year} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Price (₹)</label>
                <input type="number" name="price" className="custom-input" placeholder="150000" required value={formData.price} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Kilometers Driven</label>
                <input type="number" name="kmDriven" className="custom-input" placeholder="12000" required value={formData.kmDriven} onChange={handleChange} />
              </div>
            </div>

            <div className="input-group" style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ddd', fontWeight: 'bold' }}>Upload Images</label>
              <input type="file" className="custom-input" multiple required style={{ padding: '10px' }} onChange={(e) => setFiles(Array.from(e.target.files))} />
            </div>

            <div className="input-group" style={{ marginTop: '15px' }}>
              <label>Availability Status</label>
              <select name="status" className="custom-input" value={formData.status} onChange={handleChange}>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            <button type="submit" className="solid-btn" disabled={isSubmitting} style={{ width: '100%', marginTop: '25px', padding: '12px', fontSize: '16px' }}>
              {isSubmitting ? 'Processing & Uploading...' : 'Add Bike'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <Link to="/admin/manage-bikes" style={{ color: '#aaa', textDecoration: 'none' }}>Cancel</Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddBike;

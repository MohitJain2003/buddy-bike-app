import { useState, useEffect } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import ThreeBg from '../../components/ThreeBg';
import { PlusCircle, ArrowLeft, Save, Image, Upload, X } from 'lucide-react';

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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
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

    if (files.length === 0) {
      alert("Please upload at least one image of the bike.");
      return;
    }

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
      <section className="admin-section" style={{ maxWidth: '720px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-subtle)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-lg)', color: 'var(--primary)' }}>
              <PlusCircle size={22} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Add New Bike</h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Create a new listing</p>
            </div>
          </div>
          <Link to="/admin/manage-bikes" className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Cancel
          </Link>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <form onSubmit={handleSubmit}>
            {/* Name & Vehicle No */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
              <div className="input-group">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>Bike Name *</label>
                <input type="text" name="name" className="custom-input" placeholder="e.g. Royal Enfield Classic 350" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>Vehicle No.</label>
                <input type="text" name="vehicleNumber" className="custom-input" placeholder="e.g. MH-12-AB-1234" value={formData.vehicleNumber} onChange={handleChange} />
              </div>
            </div>

            {/* Brand & Model */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              <div className="input-group">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>Brand *</label>
                <input type="text" name="brand" className="custom-input" placeholder="e.g. Royal Enfield" required value={formData.brand} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>Model *</label>
                <input type="text" name="model" className="custom-input" placeholder="e.g. Classic 350" required value={formData.model} onChange={handleChange} />
              </div>
            </div>

            {/* Year, Price, KM */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              <div className="input-group">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>Year *</label>
                <input type="number" name="year" className="custom-input" placeholder="2024" required value={formData.year} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>Price (₹) *</label>
                <input type="number" name="price" className="custom-input" placeholder="150000" required value={formData.price} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>KM Driven *</label>
                <input type="number" name="kmDriven" className="custom-input" placeholder="12000" required value={formData.kmDriven} onChange={handleChange} />
              </div>
            </div>

            {/* Image Upload */}
            <div style={{ marginTop: 'var(--space-4)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Image size={16} /> Upload Images *
              </label>
              <div style={{
                border: '2px dashed var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                background: 'var(--bg-tertiary)',
              }}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--border-default)';
                const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                if (droppedFiles.length > 0) setFiles([...files, ...droppedFiles]);
              }}
              >
                <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="bike-images-input" />
                <label htmlFor="bike-images-input" style={{ cursor: 'pointer', display: 'block' }}>
                  <Upload size={32} style={{ color: 'var(--text-muted)', margin: '0 auto var(--space-3)' }} />
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
                    Click to upload or drag & drop
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    PNG, JPG up to 1MB each. Images will be auto-compressed.
                  </p>
                </label>
              </div>

              {/* File Preview */}
              {files.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                  {files.map((file, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '1', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
                      <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        style={{ position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2px 4px', background: 'rgba(0,0,0,0.6)', fontSize: '9px', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div style={{ marginTop: 'var(--space-4)' }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)', display: 'block' }}>Availability Status</label>
              <select name="status" className="custom-input" value={formData.status} onChange={handleChange} style={{ maxWidth: '240px' }}>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            {/* Submit */}
            <button type="submit" className="solid-btn btn-lg" disabled={isSubmitting} style={{ width: '100%', marginTop: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
              {isSubmitting ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  Processing & Uploading...
                </>
              ) : (
                <> <Save size={18} /> Add Bike </>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddBike;

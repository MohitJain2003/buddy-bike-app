// --- Helper Function: Compress Image Before Upload ---
function compressImage(file, maxWidth = 1920, quality = 0.85) {
    return new Promise((resolve) => {
        
        // Size Check: 1 MB = 1,048,576 bytes
        const maxSizeInBytes = 1048576; 
        
        // If the image is already smaller than 1MB, skip compression entirely
        if (file.size <= maxSizeInBytes) {
            console.log("Image is small enough, skipping compression.");
            resolve(file); // Return the original, untouched file
            return;
        }

        console.log("Image is large, compressing now...");
        
        // Otherwise, compress it
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Scale down if the image is too wide
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert canvas back to a file
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
}

// --- Main Form Submission ---
document.getElementById("bikeForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const files = document.getElementById("images").files;
    let urls = [];

    // Alert user that upload is starting (since compression takes a second)
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerText = "Processing & Uploading...";
        submitBtn.disabled = true;
    }

    // Upload and Compress Images
    for (let file of files) {
      
      // 1. Run the file through our smart compressor
      const processedFile = await compressImage(file);
      
      // 2. Create a unique file name
      const fileName = Date.now() + "-" + processedFile.name;

      // 3. Upload to Supabase
      const { error: uploadError } = await supabaseClient.storage
        .from("bike-images")
        .upload(fileName, processedFile);

      if (uploadError) {
        alert(uploadError.message);
        if (submitBtn) {
            submitBtn.innerText = "Add Bike";
            submitBtn.disabled = false;
        }
        return;
      }

      // 4. Get the public URL
      const { data } = supabaseClient.storage
        .from("bike-images")
        .getPublicUrl(fileName);

      urls.push(data.publicUrl);
    }

    // Collect Form Data
    const bikeData = {
      name: document.getElementById("name").value,
      vehicleNumber: document.getElementById("vehicleNumber").value, // Admin field
      brand: document.getElementById("brand").value,
      model: document.getElementById("model").value,
      year: Number(document.getElementById("year").value),
      price: Number(document.getElementById("price").value),
      kmDriven: Number(document.getElementById("km").value),
      imageUrls: urls,
      status: document.getElementById("status").value
    };

    // Insert Into Database
    const { error } = await supabaseClient
      .from("bikes")
      .insert([bikeData]);

    if (error) {
      alert(error.message);
      if (submitBtn) {
          submitBtn.innerText = "Add Bike";
          submitBtn.disabled = false;
      }
      return;
    }

    alert("Bike Added Successfully ✅");
    document.getElementById("bikeForm").reset();

    // Reset button state
    if (submitBtn) {
        submitBtn.innerText = "Add Bike";
        submitBtn.disabled = false;
    }

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
    
    // Reset button state if something crashes
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerText = "Add Bike";
        submitBtn.disabled = false;
    }
  }
});
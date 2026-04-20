let bikesData = [];
let filteredData = [];
let currentPage = 1;
const bikesPerPage = 8; // Showing 8 bikes per page looks great on a grid

// ================= LOAD BIKES =================
async function loadBikes() {
  const { data, error } = await supabaseClient
    .from("bikes")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error(error);
    alert("Failed to load bikes");
    return;
  }

  bikesData = data;
  filteredData = data;

  // 1. Fill the dropdown menu with all available brands from the database
  populateBrands(data);

  // 2. Read the URL to see what was clicked
  const urlParams = new URLSearchParams(window.location.search);
  const selectedBrand = urlParams.get('brand');

  if (selectedBrand) {
    let select = document.getElementById("brandFilter");
    
    // Search the dropdown options ignoring uppercase/lowercase differences
    let options = Array.from(select.options);
    let match = options.find(opt => opt.value.toLowerCase() === selectedBrand.toLowerCase());

    if (match) {
        // If a match is found in the database, select it
        select.value = match.value; 
    } else {
        // If the brand doesn't exist in the database yet, add it temporarily so it filters correctly to show 0 results
        select.innerHTML += `<option value="${selectedBrand}">${selectedBrand}</option>`;
        select.value = selectedBrand;
    }

    // Run the filter
    applyFilters(); 
  } else {
    // If no brand was clicked, just load normally
    renderBikes();
  }
}

// ================= POPULATE BRAND FILTER =================
function populateBrands(bikes) {
  let select = document.getElementById("brandFilter");
  select.innerHTML = `<option value="">All Brands</option>`;

  let brands = [...new Set(bikes.map(b => b.brand))];

  brands.forEach(b => {
    if (b) {
      select.innerHTML += `<option value="${b}">${b}</option>`;
    }
  });
}

// ================= APPLY FILTERS =================
function applyFilters() {
  let search = document.getElementById("searchInput").value.toLowerCase();
  let brand = document.getElementById("brandFilter").value;
  let min = Number(document.getElementById("minPrice").value) || 0;
  let max = Number(document.getElementById("maxPrice").value) || Infinity;

  filteredData = bikesData.filter(bike =>
    (bike.name || "").toLowerCase().includes(search) &&
    (brand === "" || bike.brand === brand) &&
    bike.price >= min &&
    bike.price <= max
  );

  currentPage = 1;
  renderBikes();
}

// ================= RENDER BIKES =================
function renderBikes() {
  let container = document.getElementById("bikeContainer");
  container.innerHTML = "";

  let start = (currentPage - 1) * bikesPerPage;
  let paginated = filteredData.slice(start, start + bikesPerPage);

  if (paginated.length === 0) {
    container.innerHTML = `<h4 style="color: #aaa; grid-column: 1 / -1; text-align: center; margin-top: 50px;">No bikes found matching your filters.</h4>`;
    updatePagination();
    return;
  }

  paginated.forEach(bike => {
    let card = document.createElement("div");
    // No bootstrap classes here anymore, CSS Grid handles it
    card.className = "gallery-card-wrapper"; 

    let displayPrice = !isNaN(bike.price) ? Number(bike.price).toLocaleString('en-IN') : bike.price;

    card.innerHTML = `
    <div class="gallery-card liquid-hover" style="background: rgba(17, 17, 17, 0.6); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.1);">
      <div class="sold-badge ${bike.status === "Sold" ? "" : "d-none"}">
        SOLD
      </div>

      <div class="gallery-img-container">
        <img 
          loading="lazy"
          src="${bike.imageUrls?.[0] || 'assets/placeholder.jpg'}"
          class="gallery-img"
          alt="${bike.name}"
        >
      </div>

      <div class="gallery-details">
        <div class="gallery-title" title="${bike.name}">${bike.name}</div>
        <div class="gallery-price">₹ ${displayPrice}</div>
        
        <div class="gallery-meta">
          <span class="meta-tag">${bike.brand || 'N/A'}</span>
          <span class="meta-tag">${bike.year || 'N/A'}</span>
          <span class="meta-tag">${bike.kmDriven ? bike.kmDriven + ' km' : '0 km'}</span>
        </div>

        <button class="neon-btn" style="width: 100%; margin-top: auto;" onclick="window.location.href='bike-details.html?id=${bike.id}'">View Details</button>
      </div>
    </div>
    `;

    container.appendChild(card);
  });

  updatePagination();
}

// ================= PAGINATION =================
function updatePagination() {
  let totalPages = Math.ceil(filteredData.length / bikesPerPage);

  document.getElementById("pageNumber").innerText = `Page ${currentPage} of ${totalPages || 1}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage >= totalPages || totalPages === 0;
}

// ================= PAGINATION BUTTONS =================
document.getElementById("nextPage").onclick = () => {
  let totalPages = Math.ceil(filteredData.length / bikesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderBikes();
  }
};

document.getElementById("prevPage").onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderBikes();
  }
};

// ================= FILTER EVENTS =================
document.querySelectorAll("#searchInput, #brandFilter, #minPrice, #maxPrice").forEach(el => {
  el.addEventListener("input", applyFilters);
});

// ================= INIT =================
loadBikes();
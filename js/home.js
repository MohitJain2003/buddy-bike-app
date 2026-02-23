async function loadFeaturedBikes() {

  const { data, error } = await supabaseClient
    .from("bikes")
    .select("*")
    .eq("status", "Available")
    .limit(6);

  if (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById("featuredContainer");
  container.innerHTML = "";

  data.forEach(bike => {

    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-md-4 col-lg-3";

    card.innerHTML = `
      <div class="bike-card position-relative">

        ${bike.status === "Sold" ? `<div class="sold-badge">SOLD</div>` : ""}

        <img loading="lazy"
             src="${bike.imageUrls?.[0] || 'assets/placeholder.jpg'}"
             class="bike-img">

        <div class="card-body">
          <h5>${bike.name}</h5>
          <p class="small-text">${bike.kmDriven} km • ${bike.year}</p>
          <h4 class="price">₹ ${bike.price}</h4>
        </div>

      </div>
    `;

    container.appendChild(card);
  });
}

loadFeaturedBikes();

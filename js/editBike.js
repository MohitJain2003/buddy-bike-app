// Get the bike ID from the web address (e.g., edit-bike.html?id=123)
const urlParams = new URLSearchParams(window.location.search);
const bikeId = urlParams.get('id');

// Automatically run this function when the page loads
async function loadBikeData() {
    if (!bikeId) {
        alert("No bike ID found. Redirecting back to manage page.");
        window.location.href = "manage-bikes.html";
        return;
    }

    // Fetch the single bike's current details from Supabase
    const { data, error } = await supabaseClient
        .from('bikes')
        .select('*')
        .eq('id', bikeId)
        .single();

    if (error) {
        console.error("Error fetching bike:", error);
        alert("Failed to load bike details.");
        return;
    }

    // Pre-fill the HTML inputs with the database values
    document.getElementById('name').value = data.name || "";
    document.getElementById('vehicleNumber').value = data.vehicleNumber || ""; // Added Admin field
    document.getElementById('brand').value = data.brand || "";
    document.getElementById('year').value = data.year || "";
    document.getElementById('price').value = data.price || "";
    document.getElementById('kmDriven').value = data.kmDriven || "";
    
    // Set the dropdown to the correct status
    const statusDropdown = document.getElementById('status');
    if (data.status) {
        statusDropdown.value = data.status;
    }
}

// Handle the form submission
document.getElementById('editForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevents the page from refreshing instantly

    // Gather the newly typed values
    const updatedBike = {
        name: document.getElementById('name').value,
        vehicleNumber: document.getElementById('vehicleNumber').value, // Save the Admin field
        brand: document.getElementById('brand').value,
        year: parseInt(document.getElementById('year').value),
        price: parseInt(document.getElementById('price').value),
        kmDriven: parseInt(document.getElementById('kmDriven').value),
        status: document.getElementById('status').value
    };

    // Send the updates to Supabase
    const { error } = await supabaseClient
        .from('bikes')
        .update(updatedBike)
        .eq('id', bikeId);

    if (error) {
        console.error("Error updating bike:", error);
        alert("Failed to update bike: " + error.message);
    } else {
        alert("Bike successfully updated!");
        window.location.href = "manage-bikes.html"; // Send user back to the list
    }
});

// Start the loading process
loadBikeData();
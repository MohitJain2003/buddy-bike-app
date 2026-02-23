// ===============================
// LOGIN FUNCTION
// ===============================

async function login() {

  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

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
  window.location.href = "admin-dashboard.html";
}


// ===============================
// LOGOUT FUNCTION
// ===============================

async function logout() {

  await supabaseClient.auth.signOut();

  alert("Logged out successfully");
  window.location.href = "admin-login.html";
}


// ===============================
// SESSION CHECK
// ===============================

async function checkAuth() {

  const { data } = await supabaseClient.auth.getSession();

  if (!data.session) {
    window.location.href = "admin-login.html";
  }
}


// ===============================
// AUTO CHECK
// ===============================

document.addEventListener("DOMContentLoaded", async () => {

  const currentPage = window.location.pathname;

  if (
    currentPage.includes("admin-dashboard") ||
    currentPage.includes("add-bike") ||
    currentPage.includes("manage-bikes") ||
    currentPage.includes("edit-bike")
  ) {
    await checkAuth();
  }

});

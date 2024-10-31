// src/utils/auth.js
export const isAuthenticated = () => {
  return !!localStorage.getItem("user"); // Checking if user exists in localStorage
};

export const loginUser = async (user) => {
  try {
    // Set the token or update session
    localStorage.setItem("user", JSON.stringify(user)); // Set user in localStorage
    localStorage.setItem("token", user.token);
    localStorage.setItem("fitnessemail", user.email);
    localStorage.setItem("fitnesspassword", user.password);
    window.location.replace("/dashboard");
  } catch (error) {
    console.error("Error in loginUser:", error);
  }
};

export const logoutUser = () => {
  localStorage.clear(); // Clear all data from localStorage
  localStorage.removeItem("user"); // Remove user from localStorage
  localStorage.removeItem("fitnessemail");
  localStorage.removeItem("fitnesspassword");
};
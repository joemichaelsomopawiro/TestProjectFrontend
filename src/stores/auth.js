import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => {
    const userData = localStorage.getItem("user");
    console.log("Raw userData from localStorage:", userData); // Debugging
    let parsedUser = null;
    if (userData) {
      try {
        parsedUser = JSON.parse(userData);
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
        parsedUser = null;
      }
    }
    return {
      accessToken: localStorage.getItem("accessToken") || null,
      user: parsedUser,
      isAdmin: parsedUser ? parsedUser.is_admin : false, // Tambahkan isAdmin
    };
  },
  getters: {
    isLoggedIn() {
      return this.accessToken !== null;
    },
    // Getter untuk isAdmin (opsional, karena sudah ada di state)
    isUserAdmin() {
      return this.isAdmin;
    },
  },
  actions: {
    setAccessToken(token) {
      this.accessToken = token;
      localStorage.setItem("accessToken", token);
    },
    removeAccessToken() {
      this.accessToken = null;
      localStorage.removeItem("accessToken");
    },
    setUser(user) {
      this.user = user;
      this.isAdmin = user.is_admin; // Set isAdmin berdasarkan data user
      localStorage.setItem("user", JSON.stringify(user));
    },
    async fetchUserProfile() {
      if (this.accessToken) {
        try {
          const response = await axios.get("/api/users", {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          });

          const currentUserEmail = localStorage.getItem("email");
          console.log("Current email:", currentUserEmail);

          const currentUser = response.data.data.find(
            (user) => user.email === currentUserEmail
          );

          console.log("Found user:", currentUser);

          if (currentUser) {
            this.setUser(currentUser);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    },
    logout() {
      try {
        axios.post(
          "/api/logout",
          null,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );
        this.removeAccessToken();
        this.user = null;
        this.isAdmin = false; // Reset isAdmin saat logout
        localStorage.removeItem("user");
        localStorage.removeItem("email");
        console.log("Logout successful");
      } catch (error) {
        console.error("Error during logout:", error.message);
      }
    },
  },
});
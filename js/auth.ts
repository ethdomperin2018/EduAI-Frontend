import type { User } from "./types"

// Auth related functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  checkAuthStatus()

  // Login and Register modal functionality
  setupAuthModals()

  // Login and Register form submission
  setupAuthForms()

  // Logout functionality
  setupLogout()
})

// Check if user is logged in
function checkAuthStatus(): void {
  const token = localStorage.getItem("authToken")

  if (token) {
    // User is logged in
    // Hide login/register buttons if on homepage
    const authButtons = document.querySelector(".auth-buttons")
    if (authButtons) {
      authButtons.innerHTML = `
                <a href="dashboard.html" class="btn btn-primary">Dashboard</a>
            `
    }

    // Get user info if on dashboard
    const userName = document.getElementById("userName")
    if (userName) {
      fetchUserInfo()
    }
  } else {
    // User is not logged in
    // Redirect to login page if trying to access protected pages
    const currentPage = window.location.pathname
    if (currentPage.includes("dashboard") || currentPage.includes("lesson") || currentPage.includes("profile")) {
      window.location.href = "index.html"
    }
  }
}

// Setup auth modals
function setupAuthModals(): void {
  const loginBtn = document.getElementById("loginBtn")
  const registerBtn = document.getElementById("registerBtn")
  const loginModal = document.getElementById("loginModal")
  const registerModal = document.getElementById("registerModal")
  const closeBtns = document.querySelectorAll(".close")
  const showRegister = document.getElementById("showRegister")
  const showLogin = document.getElementById("showLogin")

  if (loginBtn && registerBtn && loginModal && registerModal) {
    loginBtn.addEventListener("click", () => {
      loginModal.classList.add("active")
    })

    registerBtn.addEventListener("click", () => {
      registerModal.classList.add("active")
    })
  }

  if (closeBtns) {
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (loginModal) loginModal.classList.remove("active")
        if (registerModal) registerModal.classList.remove("active")
      })
    })
  }

  if (showRegister && loginModal && registerModal) {
    showRegister.addEventListener("click", (e) => {
      e.preventDefault()
      loginModal.classList.remove("active")
      registerModal.classList.add("active")
    })
  }

  if (showLogin && loginModal && registerModal) {
    showLogin.addEventListener("click", (e) => {
      e.preventDefault()
      registerModal.classList.remove("active")
      loginModal.classList.add("active")
    })
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (loginModal && e.target === loginModal) {
      loginModal.classList.remove("active")
    }
    if (registerModal && e.target === registerModal) {
      registerModal.classList.remove("active")
    }
  })
}

// Setup auth forms
function setupAuthForms(): void {
  const loginForm = document.getElementById("loginForm") as HTMLFormElement | null
  const registerForm = document.getElementById("registerForm") as HTMLFormElement | null

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const emailInput = document.getElementById("loginEmail") as HTMLInputElement
      const passwordInput = document.getElementById("loginPassword") as HTMLInputElement

      const email = emailInput.value
      const password = passwordInput.value

      login(email, password)
    })
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const nameInput = document.getElementById("registerName") as HTMLInputElement
      const emailInput = document.getElementById("registerEmail") as HTMLInputElement
      const passwordInput = document.getElementById("registerPassword") as HTMLInputElement

      const name = nameInput.value
      const email = emailInput.value
      const password = passwordInput.value

      register(name, email, password)
    })
  }
}

// Login function
async function login(email: string, password: string): Promise<void> {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      // Save token and redirect
      localStorage.setItem("authToken", data.access_token)
      localStorage.setItem("userInfo", JSON.stringify(data.user))

      window.location.href = "dashboard.html"
    } else {
      alert(data.message || "Login failed")
    }
  } catch (error) {
    console.error("Login error:", error)
    alert("An error occurred during login")
  }
}

// Register function
async function register(full_name: string, email: string, password: string): Promise<void> {
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ full_name, email, password, role: "student" }),
    })

    const data = await response.json()

    if (response.ok) {
      // Save token and redirect
      localStorage.setItem("authToken", data.access_token)
      localStorage.setItem("userInfo", JSON.stringify(data.user))

      window.location.href = "dashboard.html"
    } else {
      alert(data.message || "Registration failed")
    }
  } catch (error) {
    console.error("Registration error:", error)
    alert("An error occurred during registration")
  }
}

// Fetch user info
async function fetchUserInfo(): Promise<void> {
  const token = localStorage.getItem("authToken")

  if (!token) return

  try {
    const response = await fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data: User = await response.json()

    if (response.ok) {
      // Update user info in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data))

      // Update UI
      const userName = document.getElementById("userName")
      if (userName) {
        userName.textContent = data.full_name
      }

      const userAvatar = document.getElementById("userAvatar") as HTMLImageElement | null
      if (userAvatar) {
        if (data.avatar_url) {
          userAvatar.src = data.avatar_url
        }
      }
    } else {
      // Token might be expired
      logout()
    }
  } catch (error) {
    console.error("Error fetching user info:", error)
  }
}

// Setup logout
function setupLogout(): void {
  const logoutBtn = document.getElementById("logoutBtn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }
}

// Logout function
async function logout(): Promise<void> {
  const token = localStorage.getItem("authToken")

  if (token) {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Clear local storage and redirect
  localStorage.removeItem("authToken")
  localStorage.removeItem("userInfo")

  window.location.href = "index.html"
}

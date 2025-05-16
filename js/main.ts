// Main JavaScript functionality for the homepage

document.addEventListener("DOMContentLoaded", () => {
  // Initialize any homepage-specific functionality
  setupGetStartedButton()
  setupCourseButtons()
})

// Setup the "Get Started" button
function setupGetStartedButton(): void {
  const getStartedBtn = document.querySelector(".hero .btn-primary")

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      // Check if user is logged in
      const token = localStorage.getItem("authToken")

      if (token) {
        // Redirect to dashboard if logged in
        window.location.href = "dashboard.html"
      } else {
        // Show register modal if not logged in
        const registerModal = document.getElementById("registerModal")
        if (registerModal) {
          registerModal.classList.add("active")
        }
      }
    })
  }
}

// Setup course buttons
function setupCourseButtons(): void {
  const courseButtons = document.querySelectorAll(".course-card .btn")

  courseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Check if user is logged in
      const token = localStorage.getItem("authToken")

      if (token) {
        // Redirect to course page if logged in
        window.location.href = "courses.html"
      } else {
        // Show login modal if not logged in
        const loginModal = document.getElementById("loginModal")
        if (loginModal) {
          loginModal.classList.add("active")
        }
      }
    })
  })
}

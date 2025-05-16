import type { User, Course, Progress } from "./types"

// Dashboard functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const token = localStorage.getItem("authToken")
  if (!token) {
    window.location.href = "index.html"
    return
  }

  // Load user data
  loadUserData()

  // Load user courses
  loadUserCourses()

  // Setup continue buttons
  setupContinueButtons()

  // Setup recommended course buttons
  setupRecommendedButtons()
})

// Load user data
async function loadUserData(): Promise<void> {
  const userInfo = localStorage.getItem("userInfo")

  if (userInfo) {
    const user: User = JSON.parse(userInfo)

    // Update user name
    const userName = document.getElementById("userName")
    if (userName) {
      userName.textContent = user.full_name
    }

    // Update user avatar
    const userAvatar = document.getElementById("userAvatar") as HTMLImageElement | null
    if (userAvatar && user.avatar_url) {
      userAvatar.src = user.avatar_url
    }
  } else {
    // Fetch user data from API
    await fetchUserData()
  }

  // Load user stats
  loadUserStats()
}

// Fetch user data from API
async function fetchUserData(): Promise<void> {
  const token = localStorage.getItem("authToken")

  try {
    const response = await fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (response.ok) {
      const user: User = await response.json()

      // Save user info to localStorage
      localStorage.setItem("userInfo", JSON.stringify(user))

      // Update UI
      const userName = document.getElementById("userName")
      if (userName) {
        userName.textContent = user.full_name
      }

      const userAvatar = document.getElementById("userAvatar") as HTMLImageElement | null
      if (userAvatar && user.avatar_url) {
        userAvatar.src = user.avatar_url
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
  }
}

// Load user stats
async function loadUserStats(): Promise<void> {
  const token = localStorage.getItem("authToken")

  try {
    // Fetch courses count
    const coursesResponse = await fetch("http://localhost:5000/api/courses", {
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (coursesResponse.ok) {
      const courses: Course[] = await coursesResponse.json()

      const coursesCount = document.getElementById("coursesCount")
      if (coursesCount) {
        coursesCount.textContent = courses.length.toString()
      }
    }

    // Fetch progress data
    const progressResponse = await fetch("http://localhost:5000/api/progress/user", {
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (progressResponse.ok) {
      const progress: Progress[] = await progressResponse.json()

      // Count completed lessons
      const completedLessons = progress.filter((p) => p.status === "completed").length

      const lessonsCount = document.getElementById("lessonsCount")
      if (lessonsCount) {
        lessonsCount.textContent = completedLessons.toString()
      }

      // Calculate stars (2 stars per completed lesson)
      const stars = completedLessons * 2

      const starsCount = document.getElementById("starsCount")
      if (starsCount) {
        starsCount.textContent = stars.toString()
      }
    }
  } catch (error) {
    console.error("Error loading user stats:", error)
  }
}

// Load user courses
async function loadUserCourses(): Promise<void> {
  // This would typically fetch the user's enrolled courses from the API
  // For now, we're using the static HTML in the dashboard
}

// Setup continue buttons
function setupContinueButtons(): void {
  const continueButtons = document.querySelectorAll(".continue-card .btn")

  continueButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLElement
      const courseId = target.getAttribute("data-course-id")
      const lessonId = target.getAttribute("data-lesson-id")

      if (courseId && lessonId) {
        window.location.href = `lesson.html?id=${lessonId}`
      }
    })
  })
}

// Setup recommended course buttons
function setupRecommendedButtons(): void {
  const recommendedButtons = document.querySelectorAll(".recommended-cards .btn")

  recommendedButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLElement
      const courseId = target.getAttribute("data-course-id")

      if (courseId) {
        window.location.href = `courses.html?id=${courseId}`
      }
    })
  })
}

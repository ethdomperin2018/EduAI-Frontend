import type { Lesson, Exercise } from "./types"
import { triggerAvatarReaction } from "./avatar"
import { initDocumentAnnotation } from "./document-annotation"

// Lesson page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Initialize tabs
  initTabs()

  // Load lesson data
  loadLessonData()

  // Setup video controls
  setupVideoControls()

  // Setup document upload
  setupDocumentUpload()

  // Setup fullscreen
  setupFullscreen()

  // Setup navigation
  setupNavigation()
})

// Initialize tabs
function initTabs(): void {
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function (this: HTMLElement) {
      // Remove active class from all tabs
      tabBtns.forEach((b) => b.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked tab
      this.classList.add("active")

      // Show corresponding content
      const tabId = this.getAttribute("data-tab")
      if (tabId) {
        const contentElement = document.getElementById(`${tabId}Tab`)
        if (contentElement) {
          contentElement.classList.add("active")
        }

        // Update avatar state based on active tab
        updateAvatarState(tabId)
      }
    })
  })
}

// Load lesson data
async function loadLessonData(): Promise<void> {
  // Get lesson ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const lessonId = urlParams.get("id")

  if (!lessonId) {
    alert("Lesson ID is missing")
    window.location.href = "dashboard.html"
    return
  }

  const token = localStorage.getItem("authToken")

  try {
    const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, {
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    })

    const lesson: Lesson = await response.json()

    if (response.ok) {
      // Update lesson title
      const lessonTitleElement = document.getElementById("lessonTitle")
      if (lessonTitleElement) {
        lessonTitleElement.textContent = lesson.title
      }

      // Load video if available
      if (lesson.content && lesson.content.video_url) {
        const video = document.getElementById("lessonVideo") as HTMLVideoElement | null
        if (video) {
          video.src = lesson.content.video_url
          video.load()
        }
      }

      // Load exercises
      loadExercises(lessonId)

      // Update progress
      updateLessonProgress(lessonId, "in_progress")
    } else {
      alert(lesson.message || "Failed to load lesson")
      window.location.href = "dashboard.html"
    }
  } catch (error) {
    console.error("Error loading lesson:", error)
    alert("An error occurred while loading the lesson")
  }
}

// Load exercises for the lesson
async function loadExercises(lessonId: string): Promise<void> {
  const token = localStorage.getItem("authToken")

  try {
    const response = await fetch(`http://localhost:5000/api/exercises/lesson/${lessonId}`, {
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    })

    const exercises: Exercise[] = await response.json()

    if (response.ok && exercises.length > 0) {
      // Enable exercise tab
      const exerciseTab = document.querySelector('[data-tab="exercise"]')
      if (exerciseTab) {
        exerciseTab.classList.remove("disabled")
      }

      // Load first exercise
      loadExercise(exercises[0])
    }
  } catch (error) {
    console.error("Error loading exercises:", error)
  }
}

// Load a specific exercise
function loadExercise(exercise: Exercise): void {
  const exerciseContainer = document.getElementById("exerciseContainer")
  if (!exerciseContainer) return

  // Clear placeholder
  exerciseContainer.innerHTML = ""

  // Create exercise content based on type
  if (exercise.type === "quiz") {
    createQuizExercise(exercise, exerciseContainer)
  } else if (exercise.type === "fill-in-blanks") {
    createFillInBlanksExercise(exercise, exerciseContainer)
  } else if (exercise.type === "matching") {
    createMatchingExercise(exercise, exerciseContainer)
  } else {
    // Generic exercise display
    exerciseContainer.innerHTML = `
            <div class="exercise-header">
                <h3>${exercise.title}</h3>
                <p>${exercise.description || ""}</p>
            </div>
            <div class="exercise-content">
                <p>This exercise type is not supported yet.</p>
            </div>
        `
  }
}

// Create quiz exercise
function createQuizExercise(exercise: Exercise, container: HTMLElement): void {
  const content = exercise.content as any

  let html = `
        <div class="exercise-header">
            <h3>${exercise.title}</h3>
            <p>${exercise.description || ""}</p>
        </div>
        <div class="exercise-content">
            <form id="quizForm">
    `

  content.questions.forEach((question: any, index: number) => {
    html += `
            <div class="question">
                <p class="question-text">${index + 1}. ${question.text}</p>
                <div class="options">
        `

    question.options.forEach((option: string, optIndex: number) => {
      html += `
                <div class="option">
                    <input type="radio" id="q${index}_o${optIndex}" name="q${index}" value="${optIndex}">
                    <label for="q${index}_o${optIndex}">${option}</label>
                </div>
            `
    })

    html += `
                </div>
            </div>
        `
  })

  html += `
                <button type="submit" class="btn btn-primary">Submit Answers</button>
            </form>
        </div>
    `

  container.innerHTML = html

  // Add submit handler
  const quizForm = document.getElementById("quizForm")
  if (quizForm) {
    quizForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Calculate score
      let score = 0
      const total = content.questions.length

      content.questions.forEach((question: any, index: number) => {
        const selectedOption = document.querySelector(`input[name="q${index}"]:checked`) as HTMLInputElement | null

        if (selectedOption && Number.parseInt(selectedOption.value) === question.correct) {
          score++
        }
      })

      // Show result
      container.innerHTML += `
              <div class="exercise-result">
                  <h4>Your Score: ${score}/${total}</h4>
                  <p>${score === total ? "Great job!" : "Keep practicing!"}</p>
                  <button class="btn btn-secondary" id="retryBtn">Try Again</button>
              </div>
          `

      // Disable form
      const quizFormElement = document.getElementById("quizForm")
      if (quizFormElement) {
        quizFormElement.classList.add("disabled")
      }

      // Add retry handler
      const retryBtn = document.getElementById("retryBtn")
      if (retryBtn) {
        retryBtn.addEventListener("click", () => {
          loadExercise(exercise)
        })
      }

      // Update avatar to react to the score
      if (score === total) {
        triggerAvatarReaction("success")
      } else if (score >= total / 2) {
        triggerAvatarReaction("good")
      } else {
        triggerAvatarReaction("encouragement")
      }

      // Submit result to server
      submitExerciseResult(exercise.id, {
        score: score,
        total: total,
        answers: getSelectedAnswers(),
      })
    })
  }

  function getSelectedAnswers(): Record<string, number | null> {
    const answers: Record<string, number | null> = {}

    content.questions.forEach((question: any, index: number) => {
      const selectedOption = document.querySelector(`input[name="q${index}"]:checked`) as HTMLInputElement | null
      answers[index] = selectedOption ? Number.parseInt(selectedOption.value) : null
    })

    return answers
  }
}

// Create fill-in-blanks exercise
function createFillInBlanksExercise(exercise: Exercise, container: HTMLElement): void {
  const content = exercise.content as any

  let html = `
        <div class="exercise-header">
            <h3>${exercise.title}</h3>
            <p>${exercise.description || ""}</p>
        </div>
        <div class="exercise-content">
            <form id="fillBlanksForm">
                <div class="fill-blanks-text">
    `

  let text = content.text
  content.blanks.forEach((blank: any, index: number) => {
    const placeholder = `[BLANK_${index}]`
    text = text.replace(
      placeholder,
      `<input type="text" class="blank-input" id="blank_${index}" data-index="${index}">`,
    )
  })

  html += text

  html += `
                </div>
                <button type="submit" class="btn btn-primary">Check Answers</button>
            </form>
        </div>
    `

  container.innerHTML = html

  // Add submit handler
  const fillBlanksForm = document.getElementById("fillBlanksForm")
  if (fillBlanksForm) {
    fillBlanksForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Check answers
      let score = 0
      const total = content.blanks.length

      content.blanks.forEach((blank: any, index: number) => {
        const input = document.getElementById(`blank_${index}`) as HTMLInputElement | null
        if (!input) return

        const userAnswer = input.value.trim().toLowerCase()
        const correctAnswer = blank.answer.toLowerCase()

        if (userAnswer === correctAnswer) {
          score++
          input.classList.add("correct")
        } else {
          input.classList.add("incorrect")
        }
      })

      // Show result
      container.innerHTML += `
              <div class="exercise-result">
                  <h4>Your Score: ${score}/${total}</h4>
                  <p>${score === total ? "Great job!" : "Keep practicing!"}</p>
                  <button class="btn btn-secondary" id="retryBtn">Try Again</button>
              </div>
          `

      // Disable form
      const fillBlanksFormElement = document.getElementById("fillBlanksForm")
      if (fillBlanksFormElement) {
        fillBlanksFormElement.classList.add("disabled")
      }

      // Add retry handler
      const retryBtn = document.getElementById("retryBtn")
      if (retryBtn) {
        retryBtn.addEventListener("click", () => {
          loadExercise(exercise)
        })
      }

      // Update avatar to react to the score
      if (score === total) {
        triggerAvatarReaction("success")
      } else if (score >= total / 2) {
        triggerAvatarReaction("good")
      } else {
        triggerAvatarReaction("encouragement")
      }

      // Submit result to server
      submitExerciseResult(exercise.id, {
        score: score,
        total: total,
        answers: getFilledAnswers(),
      })
    })
  }

  function getFilledAnswers(): Record<string, string> {
    const answers: Record<string, string> = {}

    content.blanks.forEach((blank: any, index: number) => {
      const input = document.getElementById(`blank_${index}`) as HTMLInputElement | null
      if (input) {
        answers[index] = input.value.trim()
      }
    })

    return answers
  }
}

// Create matching exercise
function createMatchingExercise(exercise: Exercise, container: HTMLElement): void {
  const content = exercise.content as any

  let html = `
        <div class="exercise-header">
            <h3>${exercise.title}</h3>
            <p>${exercise.description || ""}</p>
        </div>
        <div class="exercise-content">
            <form id="matchingForm">
                <div class="matching-container">
                    <div class="matching-left">
    `

  content.pairs.forEach((pair: any, index: number) => {
    html += `
            <div class="matching-item" data-index="${index}">
                <span>${pair.left}</span>
            </div>
        `
  })

  html += `
                    </div>
                    <div class="matching-right">
    `

  // Shuffle right items
  const shuffledRight = [...content.pairs].sort(() => Math.random() - 0.5)

  shuffledRight.forEach((pair: any, index: number) => {
    html += `
            <div class="matching-item" data-index="${index}">
                <select class="matching-select" id="match_${index}">
                    <option value="">Select a match</option>
        `

    content.pairs.forEach((p: any, i: number) => {
      html += `<option value="${i}">${p.right}</option>`
    })

    html += `
                </select>
            </div>
        `
  })

  html += `
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Check Matches</button>
            </form>
        </div>
    `

  container.innerHTML = html

  // Add submit handler
  const matchingForm = document.getElementById("matchingForm")
  if (matchingForm) {
    matchingForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Check matches
      let score = 0
      const total = content.pairs.length

      const selects = document.querySelectorAll(".matching-select") as NodeListOf<HTMLSelectElement>

      selects.forEach((select, index) => {
        const selectedValue = Number.parseInt(select.value)
        const correctIndex = shuffledRight[index].index

        if (selectedValue === correctIndex) {
          score++
          select.classList.add("correct")
        } else {
          select.classList.add("incorrect")
        }
      })

      // Show result
      container.innerHTML += `
              <div class="exercise-result">
                  <h4>Your Score: ${score}/${total}</h4>
                  <p>${score === total ? "Great job!" : "Keep practicing!"}</p>
                  <button class="btn btn-secondary" id="retryBtn">Try Again</button>
              </div>
          `

      // Disable form
      const matchingFormElement = document.getElementById("matchingForm")
      if (matchingFormElement) {
        matchingFormElement.classList.add("disabled")
      }

      // Add retry handler
      const retryBtn = document.getElementById("retryBtn")
      if (retryBtn) {
        retryBtn.addEventListener("click", () => {
          loadExercise(exercise)
        })
      }

      // Update avatar to react to the score
      if (score === total) {
        triggerAvatarReaction("success")
      } else if (score >= total / 2) {
        triggerAvatarReaction("good")
      } else {
        triggerAvatarReaction("encouragement")
      }

      // Submit result to server
      submitExerciseResult(exercise.id, {
        score: score,
        total: total,
        matches: getSelectedMatches(),
      })
    })
  }

  function getSelectedMatches(): Record<string, number | null> {
    const matches: Record<string, number | null> = {}

    const selects = document.querySelectorAll(".matching-select") as NodeListOf<HTMLSelectElement>

    selects.forEach((select, index) => {
      matches[index] = select.value ? Number.parseInt(select.value) : null
    })

    return matches
  }
}

// Submit exercise result
async function submitExerciseResult(exerciseId: string, result: any): Promise<void> {
  const token = localStorage.getItem("authToken")

  try {
    await fetch("http://localhost:5000/api/exercises/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({
        exercise_id: exerciseId,
        content: result,
      }),
    })
  } catch (error) {
    console.error("Error submitting exercise result:", error)
  }
}

// Setup video controls
function setupVideoControls(): void {
  const video = document.getElementById("lessonVideo") as HTMLVideoElement | null
  const playPauseBtn = document.getElementById("playPauseBtn")
  const progressBar = document.getElementById("lessonProgressBar")
  const progressPercentage = document.getElementById("lessonProgressPercentage")

  if (video && playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play()
        playPauseBtn.innerHTML = '<img src="assets/icons/pause.svg" alt="Pause">'
      } else {
        video.pause()
        playPauseBtn.innerHTML = '<img src="assets/icons/play.svg" alt="Play">'
      }
    })

    video.addEventListener("play", () => {
      playPauseBtn.innerHTML = '<img src="assets/icons/pause.svg" alt="Pause">'
      triggerAvatarReaction("listening")
    })

    video.addEventListener("pause", () => {
      playPauseBtn.innerHTML = '<img src="assets/icons/play.svg" alt="Play">'
      triggerAvatarReaction("idle")
    })

    video.addEventListener("ended", () => {
      playPauseBtn.innerHTML = '<img src="assets/icons/play.svg" alt="Play">'
      triggerAvatarReaction("completion")

      // Enable exercise tab
      const exerciseTab = document.querySelector('[data-tab="exercise"]') as HTMLElement | null
      if (exerciseTab) {
        exerciseTab.click()
      }

      // Update progress
      const urlParams = new URLSearchParams(window.location.search)
      const lessonId = urlParams.get("id")
      if (lessonId) {
        updateLessonProgress(lessonId, "completed")
      }
    })

    video.addEventListener("timeupdate", () => {
      if (progressBar && progressPercentage) {
        const progress = (video.currentTime / video.duration) * 100
        progressBar.style.width = `${progress}%`
        progressPercentage.textContent = `${Math.round(progress)}%`
      }
    })
  }
}

// Setup document upload
function setupDocumentUpload(): void {
  const documentUpload = document.getElementById("documentUpload") as HTMLInputElement | null
  const documentContainer = document.getElementById("documentContainer")
  const annotationTools = document.getElementById("annotationTools")

  if (documentUpload && documentContainer && annotationTools) {
    documentUpload.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]

      if (file) {
        const reader = new FileReader()

        reader.onload = (e) => {
          const fileType = file.type
          const result = e.target?.result as string

          // Clear container
          documentContainer.innerHTML = ""

          if (fileType.startsWith("image/")) {
            // Display image
            const img = document.createElement("img")
            img.src = result
            img.className = "document-image"
            documentContainer.appendChild(img)

            // Create annotation layer
            const annotationLayer = document.createElement("div")
            annotationLayer.className = "annotation-layer"
            documentContainer.appendChild(annotationLayer)

            // Show annotation tools
            annotationTools.style.display = "flex"

            // Initialize document annotation
            initDocumentAnnotation(img, annotationLayer)

            // Trigger avatar reaction
            triggerAvatarReaction("document")
          } else if (fileType === "application/pdf") {
            // Display PDF
            const pdfContainer = document.createElement("div")
            pdfContainer.className = "pdf-container"

            const pdfEmbed = document.createElement("embed")
            pdfEmbed.src = result
            pdfEmbed.type = "application/pdf"
            pdfEmbed.className = "pdf-embed"

            pdfContainer.appendChild(pdfEmbed)
            documentContainer.appendChild(pdfContainer)

            // Create annotation layer
            const annotationLayer = document.createElement("div")
            annotationLayer.className = "annotation-layer"
            documentContainer.appendChild(annotationLayer)

            // Show annotation tools
            annotationTools.style.display = "flex"

            // Initialize document annotation
            initDocumentAnnotation(pdfEmbed, annotationLayer)

            // Trigger avatar reaction
            triggerAvatarReaction("document")
          } else {
            // Unsupported file type
            documentContainer.innerHTML = `
                            <div class="document-placeholder">
                                <h3>Unsupported File Type</h3>
                                <p>Please upload a PDF or image file</p>
                                <div class="document-upload">
                                    <label for="documentUpload" class="btn btn-secondary">Upload Document</label>
                                </div>
                            </div>
                        `

            // Hide annotation tools
            annotationTools.style.display = "none"
          }

          // Upload file to server
          uploadDocument(file)
        }

        reader.readAsDataURL(file)
      }
    })
  }
}

// Upload document to server
async function uploadDocument(file: File): Promise<void> {
  const token = localStorage.getItem("authToken")
  const urlParams = new URLSearchParams(window.location.search)
  const lessonId = urlParams.get("id")

  const formData = new FormData()
  formData.append("file", file)

  if (lessonId) {
    formData.append("lesson_id", lessonId)
  }

  try {
    const response = await fetch("http://localhost:5000/api/uploads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("Error uploading document:", result.message)
    }
  } catch (error) {
    console.error("Error uploading document:", error)
  }
}

// Setup fullscreen
function setupFullscreen(): void {
  const fullscreenBtn = document.getElementById("fullscreenBtn")
  const lessonContainer = document.getElementById("lessonContainer")

  if (fullscreenBtn && lessonContainer) {
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        lessonContainer.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    })
  }
}

// Setup navigation
function setupNavigation(): void {
  const prevLessonBtn = document.getElementById("prevLessonBtn")
  const nextLessonBtn = document.getElementById("nextLessonBtn")
  const exitLessonBtn = document.getElementById("exitLessonBtn")

  if (exitLessonBtn) {
    exitLessonBtn.addEventListener("click", () => {
      window.location.href = "dashboard.html"
    })
  }

  // TODO: Implement previous and next lesson navigation
}

// Update lesson progress
async function updateLessonProgress(
  lessonId: string,
  status: "not_started" | "in_progress" | "completed",
): Promise<void> {
  const token = localStorage.getItem("authToken")

  try {
    await fetch("http://localhost:5000/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({
        lesson_id: lessonId,
        status: status,
      }),
    })
  } catch (error) {
    console.error("Error updating lesson progress:", error)
  }
}

// Update avatar state based on active tab
function updateAvatarState(tabId: string): void {
  switch (tabId) {
    case "video":
      const video = document.getElementById("lessonVideo") as HTMLVideoElement | null
      if (video && !video.paused) {
        triggerAvatarReaction("listening")
      } else {
        triggerAvatarReaction("idle")
      }
      break
    case "exercise":
      triggerAvatarReaction("helping")
      break
    case "document":
      triggerAvatarReaction("document")
      break
  }
}

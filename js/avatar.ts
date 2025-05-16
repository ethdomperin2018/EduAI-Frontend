import type { AvatarState } from "./types"

// Avatar functionality
let currentAvatarState: AvatarState = "idle"
let avatarAnimationInterval: number | null = null

// Initialize avatar
document.addEventListener("DOMContentLoaded", () => {
  initAvatar()

  // Setup avatar controls
  setupAvatarControls()
})

// Initialize avatar
function initAvatar(): void {
  const avatarImage = document.getElementById("avatarImage") as HTMLImageElement | null

  if (avatarImage) {
    // Set default avatar
    avatarImage.src = "assets/mascots/default.svg"

    // Set initial state
    setAvatarState("idle")
  }
}

// Set avatar state
function setAvatarState(state: AvatarState): void {
  const avatarImage = document.getElementById("avatarImage") as HTMLImageElement | null

  if (!avatarImage) return

  // Clear any existing animation interval
  if (avatarAnimationInterval) {
    clearInterval(avatarAnimationInterval)
    avatarAnimationInterval = null
  }

  currentAvatarState = state

  // Set avatar image based on state
  switch (state) {
    case "idle":
      avatarImage.src = "assets/mascots/idle.svg"
      break
    case "listening":
      startListeningAnimation()
      break
    case "helping":
      startHelpingAnimation()
      break
    case "success":
      avatarImage.src = "assets/mascots/success.svg"
      // Reset to idle after 3 seconds
      setTimeout(() => setAvatarState("idle"), 3000)
      break
    case "encouragement":
      avatarImage.src = "assets/mascots/encouragement.svg"
      // Reset to idle after 3 seconds
      setTimeout(() => setAvatarState("idle"), 3000)
      break
    case "good":
      avatarImage.src = "assets/mascots/good.svg"
      // Reset to idle after 3 seconds
      setTimeout(() => setAvatarState("idle"), 3000)
      break
    case "completion":
      avatarImage.src = "assets/mascots/completion.svg"
      // Reset to idle after 3 seconds
      setTimeout(() => setAvatarState("idle"), 3000)
      break
    case "document":
      startDocumentAnimation()
      break
    default:
      avatarImage.src = "assets/mascots/default.svg"
  }
}

// Start listening animation
function startListeningAnimation(): void {
  const avatarImage = document.getElementById("avatarImage") as HTMLImageElement | null

  if (!avatarImage) return

  const listeningFrames = [
    "assets/mascots/listening_1.svg",
    "assets/mascots/listening_2.svg",
    "assets/mascots/listening_3.svg",
  ]

  let frameIndex = 0

  // Update frame every 500ms
  avatarAnimationInterval = window.setInterval(() => {
    avatarImage.src = listeningFrames[frameIndex]
    frameIndex = (frameIndex + 1) % listeningFrames.length
  }, 500)
}

// Start helping animation
function startHelpingAnimation(): void {
  const avatarImage = document.getElementById("avatarImage") as HTMLImageElement | null

  if (!avatarImage) return

  const helpingFrames = ["assets/mascots/helping_1.svg", "assets/mascots/helping_2.svg", "assets/mascots/helping_3.svg"]

  let frameIndex = 0

  // Update frame every 800ms
  avatarAnimationInterval = window.setInterval(() => {
    avatarImage.src = helpingFrames[frameIndex]
    frameIndex = (frameIndex + 1) % helpingFrames.length
  }, 800)
}

// Start document animation
function startDocumentAnimation(): void {
  const avatarImage = document.getElementById("avatarImage") as HTMLImageElement | null

  if (!avatarImage) return

  const documentFrames = ["assets/mascots/document_1.svg", "assets/mascots/document_2.svg"]

  let frameIndex = 0

  // Update frame every 1000ms
  avatarAnimationInterval = window.setInterval(() => {
    avatarImage.src = documentFrames[frameIndex]
    frameIndex = (frameIndex + 1) % documentFrames.length
  }, 1000)
}

// Trigger avatar reaction
export function triggerAvatarReaction(reaction: AvatarState): void {
  setAvatarState(reaction)
}

// Setup avatar controls
function setupAvatarControls(): void {
  const repeatBtn = document.getElementById("repeatBtn")
  const helpBtn = document.getElementById("helpBtn")

  if (repeatBtn) {
    repeatBtn.addEventListener("click", () => {
      // Repeat current content
      const activeTab = document.querySelector(".tab-btn.active")
      if (!activeTab) return

      const tabType = activeTab.getAttribute("data-tab")

      if (tabType === "video") {
        const video = document.getElementById("lessonVideo") as HTMLVideoElement | null
        if (video) {
          video.currentTime = 0
          video.play()
        }
      } else if (tabType === "exercise") {
        // Reset current exercise
        const exerciseContainer = document.getElementById("exerciseContainer")
        if (!exerciseContainer) return

        const exerciseResult = exerciseContainer.querySelector(".exercise-result")

        if (exerciseResult) {
          exerciseResult.remove()
        }

        const exerciseForm = exerciseContainer.querySelector("form")
        if (exerciseForm) {
          exerciseForm.classList.remove("disabled")
          ;(exerciseForm as HTMLFormElement).reset()
        }
      }

      // Trigger avatar reaction
      triggerAvatarReaction("helping")
    })
  }

  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      // Show help based on current content
      const activeTab = document.querySelector(".tab-btn.active")
      if (!activeTab) return

      const tabType = activeTab.getAttribute("data-tab")

      if (tabType === "video") {
        alert("Tip: Watch the video carefully and listen to the instructions.")
      } else if (tabType === "exercise") {
        alert("Tip: Take your time to think about each question before answering.")
      } else if (tabType === "document") {
        alert("Tip: You can use the annotation tools to mark important parts of the document.")
      }

      // Trigger avatar reaction
      triggerAvatarReaction("helping")
    })
  }
}

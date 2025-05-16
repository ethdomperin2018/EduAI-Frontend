import type { AnnotationTool } from "./types"
import { triggerAvatarReaction } from "./avatar"

// Document annotation functionality
let currentAnnotationTool: AnnotationTool = null
let isDrawing = false
let startX = 0
let startY = 0
let annotationLayer: HTMLElement | null = null
let documentElement: HTMLElement | null = null

// Initialize document annotation
export function initDocumentAnnotation(docElement: HTMLElement, annLayer: HTMLElement): void {
  documentElement = docElement
  annotationLayer = annLayer

  // Set annotation layer dimensions
  updateAnnotationLayerSize()

  // Add event listeners for window resize
  window.addEventListener("resize", updateAnnotationLayerSize)

  // Setup annotation tools
  setupAnnotationTools()

  // Add event listeners for annotation
  annotationLayer.addEventListener("mousedown", startAnnotation)
  annotationLayer.addEventListener("mousemove", moveAnnotation)
  annotationLayer.addEventListener("mouseup", endAnnotation)
  annotationLayer.addEventListener("mouseleave", endAnnotation)

  // Add touch support
  annotationLayer.addEventListener("touchstart", handleTouchStart)
  annotationLayer.addEventListener("touchmove", handleTouchMove)
  annotationLayer.addEventListener("touchend", handleTouchEnd)
}

// Update annotation layer size
function updateAnnotationLayerSize(): void {
  if (!documentElement || !annotationLayer) return

  const rect = documentElement.getBoundingClientRect()

  annotationLayer.style.position = "absolute"
  annotationLayer.style.top = `${documentElement.offsetTop}px`
  annotationLayer.style.left = `${documentElement.offsetLeft}px`
  annotationLayer.style.width = `${rect.width}px`
  annotationLayer.style.height = `${rect.height}px`
}

// Setup annotation tools
function setupAnnotationTools(): void {
  const annotationBtns = document.querySelectorAll(".annotation-btn")

  annotationBtns.forEach((btn) => {
    btn.addEventListener("click", function (this: HTMLElement) {
      const tool = this.getAttribute("data-tool") as AnnotationTool

      // Remove active class from all buttons
      annotationBtns.forEach((b) => b.classList.remove("active"))

      if (tool === "clear") {
        // Clear all annotations
        clearAnnotations()
        currentAnnotationTool = null
      } else {
        // Set current tool
        currentAnnotationTool = tool
        this.classList.add("active")

        // If text tool, prompt for text
        if (tool === "text") {
          const text = prompt("Enter text:")
          if (text) {
            addTextAnnotation(text)
          }
        }
      }

      // Trigger avatar reaction
      triggerAvatarReaction("document")
    })
  })
}

// Start annotation
function startAnnotation(e: MouseEvent): void {
  if (!currentAnnotationTool || currentAnnotationTool === "text" || !annotationLayer) return

  isDrawing = true

  const rect = annotationLayer.getBoundingClientRect()
  startX = e.clientX - rect.left
  startY = e.clientY - rect.top
}

// Move annotation
function moveAnnotation(e: MouseEvent): void {
  if (!isDrawing || !annotationLayer) return

  const rect = annotationLayer.getBoundingClientRect()
  const currentX = e.clientX - rect.left
  const currentY = e.clientY - rect.top

  // Clear temporary annotation
  const tempAnnotation = annotationLayer.querySelector(".temp-annotation")
  if (tempAnnotation) {
    tempAnnotation.remove()
  }

  // Create temporary annotation
  const annotation = document.createElement("div")
  annotation.className = "annotation temp-annotation"

  switch (currentAnnotationTool) {
    case "highlight":
      createHighlight(annotation, startX, startY, currentX, currentY)
      break
    case "circle":
      createCircle(annotation, startX, startY, currentX, currentY)
      break
    case "underline":
      createUnderline(annotation, startX, startY, currentX, currentY)
      break
  }

  annotationLayer.appendChild(annotation)
}

// End annotation
function endAnnotation(): void {
  if (!isDrawing || !annotationLayer) return

  isDrawing = false

  // Convert temporary annotation to permanent
  const tempAnnotation = annotationLayer.querySelector(".temp-annotation")
  if (tempAnnotation) {
    tempAnnotation.classList.remove("temp-annotation")
  }
}

// Add text annotation
function addTextAnnotation(text: string): void {
  if (!annotationLayer) return

  // Prompt for position
  alert("Click on the document where you want to add the text")

  // Add one-time click event listener
  const clickHandler = (e: MouseEvent) => {
    const rect = annotationLayer!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Create text annotation
    const annotation = document.createElement("div")
    annotation.className = "annotation text-annotation"
    annotation.style.position = "absolute"
    annotation.style.left = `${x}px`
    annotation.style.top = `${y}px`
    annotation.textContent = text

    annotationLayer!.appendChild(annotation)

    // Make text draggable
    makeAnnotationDraggable(annotation)

    // Remove event listener
    annotationLayer!.removeEventListener("click", clickHandler)
  }

  annotationLayer.addEventListener("click", clickHandler)
}

// Create highlight annotation
function createHighlight(element: HTMLElement, x1: number, y1: number, x2: number, y2: number): void {
  const left = Math.min(x1, x2)
  const top = Math.min(y1, y2)
  const width = Math.abs(x2 - x1)
  const height = Math.abs(y2 - y1)

  element.classList.add("highlight-annotation")
  element.style.position = "absolute"
  element.style.left = `${left}px`
  element.style.top = `${top}px`
  element.style.width = `${width}px`
  element.style.height = `${height}px`
  element.style.backgroundColor = "rgba(255, 255, 0, 0.3)"

  makeAnnotationDraggable(element)
}

// Create circle annotation
function createCircle(element: HTMLElement, x1: number, y1: number, x2: number, y2: number): void {
  const left = Math.min(x1, x2)
  const top = Math.min(y1, y2)
  const width = Math.abs(x2 - x1)
  const height = Math.abs(y2 - y1)

  element.classList.add("circle-annotation")
  element.style.position = "absolute"
  element.style.left = `${left}px`
  element.style.top = `${top}px`
  element.style.width = `${width}px`
  element.style.height = `${height}px`
  element.style.border = "2px solid red"
  element.style.borderRadius = "50%"

  makeAnnotationDraggable(element)
}

// Create underline annotation
function createUnderline(element: HTMLElement, x1: number, y1: number, x2: number, y2: number): void {
  const left = Math.min(x1, x2)
  const width = Math.abs(x2 - x1)

  element.classList.add("underline-annotation")
  element.style.position = "absolute"
  element.style.left = `${left}px`
  element.style.top = `${y1}px`
  element.style.width = `${width}px`
  element.style.height = "2px"
  element.style.backgroundColor = "blue"

  makeAnnotationDraggable(element)
}

// Make annotation draggable
function makeAnnotationDraggable(element: HTMLElement): void {
  let isDragging = false
  let offsetX = 0
  let offsetY = 0

  element.addEventListener("mousedown", (e) => {
    isDragging = true
    offsetX = e.clientX - element.getBoundingClientRect().left
    offsetY = e.clientY - element.getBoundingClientRect().top
    e.stopPropagation()
  })

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || !annotationLayer) return

    const rect = annotationLayer.getBoundingClientRect()
    const x = e.clientX - rect.left - offsetX
    const y = e.clientY - rect.top - offsetY

    element.style.left = `${x}px`
    element.style.top = `${y}px`
  })

  document.addEventListener("mouseup", () => {
    isDragging = false
  })
}

// Clear all annotations
function clearAnnotations(): void {
  if (!annotationLayer) return

  // Remove all annotations
  const annotations = annotationLayer.querySelectorAll(".annotation")
  annotations.forEach((annotation) => annotation.remove())
}

// Handle touch events
function handleTouchStart(e: TouchEvent): void {
  e.preventDefault()

  if (!currentAnnotationTool || currentAnnotationTool === "text" || !annotationLayer) return

  isDrawing = true

  const touch = e.touches[0]
  const rect = annotationLayer.getBoundingClientRect()
  startX = touch.clientX - rect.left
  startY = touch.clientY - rect.top
}

function handleTouchMove(e: TouchEvent): void {
  e.preventDefault()

  if (!isDrawing || !annotationLayer) return

  const touch = e.touches[0]
  const rect = annotationLayer.getBoundingClientRect()
  const currentX = touch.clientX - rect.left
  const currentY = touch.clientY - rect.top

  // Clear temporary annotation
  const tempAnnotation = annotationLayer.querySelector(".temp-annotation")
  if (tempAnnotation) {
    tempAnnotation.remove()
  }

  // Create temporary annotation
  const annotation = document.createElement("div")
  annotation.className = "annotation temp-annotation"

  switch (currentAnnotationTool) {
    case "highlight":
      createHighlight(annotation, startX, startY, currentX, currentY)
      break
    case "circle":
      createCircle(annotation, startX, startY, currentX, currentY)
      break
    case "underline":
      createUnderline(annotation, startX, startY, currentX, currentY)
      break
  }

  annotationLayer.appendChild(annotation)
}

function handleTouchEnd(e: TouchEvent): void {
  e.preventDefault()

  if (!isDrawing) return

  isDrawing = false

  // Convert temporary annotation to permanent
  if (annotationLayer) {
    const tempAnnotation = annotationLayer.querySelector(".temp-annotation")
    if (tempAnnotation) {
      tempAnnotation.classList.remove("temp-annotation")
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle")
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode")

      // Save preference to localStorage
      const isDarkMode = document.body.classList.contains("dark-mode")
      localStorage.setItem("dark-mode", isDarkMode)
    })

    // Check for saved theme preference
    const savedDarkMode = localStorage.getItem("dark-mode") === "true"
    if (savedDarkMode) {
      document.body.classList.add("dark-mode")
    }
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      const nav = document.querySelector(".nav")
      nav.classList.toggle("mobile-nav-active")
    })
  }

  // Form submission and validation
  const analysisForm = document.getElementById("analysis-form")
  if (analysisForm) {
    analysisForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const urlInput = document.getElementById("product-url")
      const urlError = document.getElementById("url-error")
      const submitText = document.getElementById("submit-text")
      const loadingSpinner = document.getElementById("loading-spinner")

      // Basic URL validation
      let isValid = true
      urlError.textContent = ""

      if (!urlInput.value) {
        urlError.textContent = "Please enter a product URL"
        isValid = false
      } else {
        try {
          new URL(urlInput.value)
        } catch (err) {
          urlError.textContent = "Please enter a valid URL"
          isValid = false
        }
      }

      if (isValid) {
        // Show loading state
        submitText.classList.add("hidden")
        loadingSpinner.classList.remove("hidden")

        // Simulate API call - in a real app this would be a fetch request
        setTimeout(() => {
          // Generate a random ID for the analysis
          const analysisId = Math.random().toString(36).substring(2, 10)
          window.location.href = `/analysis/${analysisId}`
        }, 2000)
      }
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")

      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        })
      }
    })
  })
})

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

  // Tabs functionality
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("tab-active"))

      // Add active class to clicked tab and corresponding content
      button.classList.add("active")
      const tabId = button.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("tab-active")
    })
  })

  // Accordion functionality
  const accordionItems = document.querySelectorAll(".accordion-item")

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header")

    header.addEventListener("click", () => {
      item.classList.toggle("active")
    })
  })

  // Review filters
  const filterButtons = document.querySelectorAll(".filter-btn")
  const reviewItems = document.querySelectorAll(".review-item")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all filter buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      button.classList.add("active")

      // Filter reviews
      const filter = button.getAttribute("data-filter")

      reviewItems.forEach((item) => {
        if (filter === "all") {
          item.style.display = "block"
        } else {
          const reviewType = item.getAttribute("data-review-type")

          if (reviewType === filter) {
            item.style.display = "block"
          } else {
            item.style.display = "none"
          }
        }
      })
    })
  })
})

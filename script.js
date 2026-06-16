/* ============================================================
   PORTFOLIO SCRIPT — BCA Student Portfolio
   Features:
   1. Mobile Menu Toggle
   2. Navbar Scroll Effect
   3. Active Nav Link on Scroll (Spy)
   4. Smooth Scrolling Navigation
   5. Scroll Reveal Animations
   6. Typing Effect (Hero Section)
   7. Skill Bar Animations
   8. Project Card Filter
   9. Contact Form Validation
   10. Back To Top Button
   11. Footer Year Auto-Update
   ============================================================ */


/* ============================================================
   HELPER — Wait for the page to fully load before running
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {

  /* ----------------------------------------------------------
     1. MOBILE MENU TOGGLE
     Toggles the hamburger icon and mobile dropdown menu
     when the hamburger button is clicked.
  ---------------------------------------------------------- */

  // Grab the elements we need
  const hamburgerBtn  = document.getElementById("hamburger-btn");
  const mobileMenu   = document.getElementById("mobile-menu");
  const mobileLinks  = document.querySelectorAll(".navbar__mobile-link");

  // Toggle the menu open/closed
  function toggleMobileMenu() {
    const isOpen = hamburgerBtn.classList.toggle("is-open");

    // Show or hide the dropdown
    mobileMenu.classList.toggle("is-open", isOpen);

    // Update ARIA attributes for accessibility
    hamburgerBtn.setAttribute("aria-expanded", isOpen);
    mobileMenu.setAttribute("aria-hidden", !isOpen);
  }

  // Listen for hamburger click
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", toggleMobileMenu);
  }

  // Close menu when any mobile nav link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburgerBtn.classList.remove("is-open");
      mobileMenu.classList.remove("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    });
  });

  // Close menu when clicking outside of it
  document.addEventListener("click", function (event) {
    const clickedInsideMenu   = mobileMenu && mobileMenu.contains(event.target);
    const clickedHamburger    = hamburgerBtn && hamburgerBtn.contains(event.target);

    if (!clickedInsideMenu && !clickedHamburger) {
      if (hamburgerBtn) hamburgerBtn.classList.remove("is-open");
      if (mobileMenu)  mobileMenu.classList.remove("is-open");
      if (hamburgerBtn) hamburgerBtn.setAttribute("aria-expanded", "false");
      if (mobileMenu)  mobileMenu.setAttribute("aria-hidden", "true");
    }
  });


  /* ----------------------------------------------------------
     2. NAVBAR SCROLL EFFECT
     Adds a shadow + darker background to the navbar
     once the user scrolls past 60px.
  ---------------------------------------------------------- */

  const navbar = document.getElementById("navbar");

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add("navbar--scrolled");
    } else {
      navbar.classList.remove("navbar--scrolled");
    }
  }

  // Run once on load (in case page is already scrolled)
  handleNavbarScroll();

  // Run every time the page scrolls
  window.addEventListener("scroll", handleNavbarScroll);


  /* ----------------------------------------------------------
     3. ACTIVE NAV LINK ON SCROLL (Scroll Spy)
     Highlights the correct nav link depending on which
     section is currently visible on screen.
  ---------------------------------------------------------- */

  const navLinks    = document.querySelectorAll(".navbar__nav-link");
  const sections    = document.querySelectorAll("section[id]");

  function updateActiveNavLink() {
    // How far down the page we are (with a small offset)
    const scrollPosition = window.scrollY + 100;

    sections.forEach(function (section) {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute("id");

      // Check if current scroll is inside this section
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {

        // Remove active class from all nav links
        navLinks.forEach(function (link) {
          link.classList.remove("active");
        });

        // Add active class to the matching nav link
        const matchingLink = document.querySelector(
          '.navbar__nav-link[href="#' + sectionId + '"]'
        );
        if (matchingLink) {
          matchingLink.classList.add("active");
        }
      }
    });
  }

  // Run on scroll
  window.addEventListener("scroll", updateActiveNavLink);
  // Run once on load
  updateActiveNavLink();


  /* ----------------------------------------------------------
     4. SMOOTH SCROLLING NAVIGATION
     When a nav link is clicked, smoothly scroll to
     that section instead of jumping instantly.
     (CSS scroll-behavior handles most browsers, but this
     adds extra control and closes the mobile menu.)
  ---------------------------------------------------------- */

  const allNavLinks = document.querySelectorAll('a[href^="#"]');

  allNavLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      // Make sure it's a real section ID, not just "#"
      if (targetId === "#") return;

      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        event.preventDefault(); // Stop the default jump

        // Calculate scroll position accounting for fixed navbar
        const navbarHeight  = navbar ? navbar.offsetHeight : 70;
        const sectionTop    = targetSection.getBoundingClientRect().top + window.scrollY;
        const scrollTo      = sectionTop - navbarHeight;

        window.scrollTo({
          top: scrollTo,
          behavior: "smooth"
        });
      }
    });
  });


  /* ----------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS
     Elements with the class "reveal" will fade in and
     slide up when they enter the viewport.
     Uses IntersectionObserver — a modern browser API.
  ---------------------------------------------------------- */

  // Find all elements that should be revealed
  const revealElements = document.querySelectorAll(".reveal");

  // Create an observer that watches when elements become visible
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        // If the element is visible on screen
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          // Stop watching once it's revealed (so it doesn't re-hide)
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,   // Trigger when 12% of element is visible
      rootMargin: "0px 0px -50px 0px" // Trigger a little before it enters view
    }
  );

  // Attach the observer to every reveal element
  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });


  /* ----------------------------------------------------------
     6. TYPING EFFECT — Hero Section
     Cycles through a list of role titles and types
     them out letter-by-letter in the hero heading.
  ---------------------------------------------------------- */

  const typingTarget = document.getElementById("typed-role");

  // The list of strings to cycle through
  const typingStrings = [
    "Web Developer",
  ];

  // Typing settings
  var typingIndex    = 0;   // Which string we're currently on
  var charIndex      = 0;   // Which character position we're at
  var isDeleting     = false; // Are we deleting or typing?
  var typingSpeed    = 100;  // Milliseconds per character

  function runTypingEffect() {
    if (!typingTarget) return; // Safety check

    var currentString = typingStrings[typingIndex];

    if (isDeleting) {
      // Remove one character at a time
      typingTarget.textContent = currentString.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 55; // Delete faster than typing
    } else {
      // Add one character at a time
      typingTarget.textContent = currentString.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing speed
    }

    // Finished typing the full string — pause then start deleting
    if (!isDeleting && charIndex === currentString.length) {
      typingSpeed = 1800; // Wait before deleting
      isDeleting = true;

    // Finished deleting — move to the next string
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      typingIndex = (typingIndex + 1) % typingStrings.length; // Loop back to start
      typingSpeed = 400; // Small pause before typing next string
    }

    // Schedule the next character
    setTimeout(runTypingEffect, typingSpeed);
  }

  // Add a blinking cursor via a CSS class, then start the effect
  if (typingTarget) {
    typingTarget.style.borderRight = "2px solid #00e5cc";
    typingTarget.style.paddingRight = "4px";
    typingTarget.style.animation = "none"; // Reset any existing CSS animation

    // Blinking cursor animation using CSS
    var cursorStyle = document.createElement("style");
    cursorStyle.textContent =
      "#typed-role { " +
      "  border-right: 2px solid #00e5cc;" +
      "  animation: cursorBlink 0.8s step-end infinite;" +
      "}" +
      "@keyframes cursorBlink {" +
      "  0%, 100% { border-color: #00e5cc; }" +
      "  50%       { border-color: transparent; }" +
      "}";
    document.head.appendChild(cursorStyle);

    // Small delay before typing starts
    setTimeout(runTypingEffect, 800);
  }


  /* ----------------------------------------------------------
     7. SKILL BAR ANIMATIONS
     Animates the skill progress bars when the
     skills section scrolls into view.
  ---------------------------------------------------------- */

  const skillCards = document.querySelectorAll(".skills__category-card");

  const skillObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Adding "in-view" makes CSS animate the bar width
          entry.target.classList.add("in-view");
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  skillCards.forEach(function (card) {
    skillObserver.observe(card);
  });


  /* ----------------------------------------------------------
     8. PROJECT CARD FILTER
     Filters project cards by category when
     the filter buttons are clicked.
  ---------------------------------------------------------- */

  const filterButtons  = document.querySelectorAll(".projects__filter-btn");
  const projectCards   = document.querySelectorAll(".project-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var selectedFilter = button.getAttribute("data-filter");

      // Update active state on buttons
      filterButtons.forEach(function (btn) {
        btn.classList.remove("projects__filter-btn--active");
      });
      button.classList.add("projects__filter-btn--active");

      // Show or hide cards based on category
      projectCards.forEach(function (card) {
        var cardCategory = card.getAttribute("data-category");

        if (selectedFilter === "all" || cardCategory === selectedFilter) {
          // Show this card with a smooth fade-in
          card.classList.remove("is-hidden");
          card.style.opacity = "0";
          card.style.transform = "translateY(16px)";

          // Tiny timeout so the browser registers the initial state
          setTimeout(function () {
            card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 20);

        } else {
          // Hide this card
          card.style.opacity = "0";
          card.style.transform = "translateY(16px)";

          setTimeout(function () {
            card.classList.add("is-hidden");
          }, 350); // Wait for fade-out transition
        }
      });
    });
  });


  /* ----------------------------------------------------------
     9. CONTACT FORM VALIDATION
     Checks that all fields are filled in correctly
     before (simulating) form submission.
  ---------------------------------------------------------- */

  const submitBtn      = document.getElementById("submit-btn");
  const formFeedback   = document.getElementById("form-feedback");

  // Individual field references
  const nameInput      = document.getElementById("contact-name");
  const emailInput     = document.getElementById("contact-email");
  const subjectInput   = document.getElementById("contact-subject");
  const messageInput   = document.getElementById("contact-message");

  // Error message spans
  const nameError      = document.getElementById("name-error");
  const emailError     = document.getElementById("email-error");
  const subjectError   = document.getElementById("subject-error");
  const messageError   = document.getElementById("message-error");

  // --- Helper: Show an error on a field ---
  function showFieldError(input, errorSpan, message) {
    if (input)     input.classList.add("is-error");
    if (errorSpan) errorSpan.textContent = message;
  }

  // --- Helper: Clear an error from a field ---
  function clearFieldError(input, errorSpan) {
    if (input)     input.classList.remove("is-error");
    if (errorSpan) errorSpan.textContent = "";
  }

  // --- Helper: Basic email format check ---
  function isValidEmail(email) {
    // Simple regex — checks for something@something.something
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Clear errors as user types (live feedback)
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      clearFieldError(nameInput, nameError);
    });
  }

  if (emailInput) {
    emailInput.addEventListener("input", function () {
      clearFieldError(emailInput, emailError);
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener("input", function () {
      clearFieldError(subjectInput, subjectError);
    });
  }

  if (messageInput) {
    messageInput.addEventListener("input", function () {
      clearFieldError(messageInput, messageError);
    });
  }

  // --- Main submit handler ---
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      var isValid = true; // Assume valid until a check fails

      // Reset all errors before re-checking
      clearFieldError(nameInput, nameError);
      clearFieldError(emailInput, emailError);
      clearFieldError(subjectInput, subjectError);
      clearFieldError(messageInput, messageError);

      // Hide previous feedback message
      if (formFeedback) {
        formFeedback.className = "form__feedback";
        formFeedback.textContent = "";
      }

      // --- Check: Name ---
      if (!nameInput || nameInput.value.trim().length < 2) {
        showFieldError(nameInput, nameError, "Please enter your full name.");
        isValid = false;
      }

      // --- Check: Email ---
      if (!emailInput || !emailInput.value.trim()) {
        showFieldError(emailInput, emailError, "Please enter your email address.");
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showFieldError(emailInput, emailError, "Please enter a valid email address.");
        isValid = false;
      }

      // --- Check: Subject ---
      if (!subjectInput || subjectInput.value.trim().length < 3) {
        showFieldError(subjectInput, subjectError, "Please enter a subject.");
        isValid = false;
      }

      // --- Check: Message ---
      if (!messageInput || messageInput.value.trim().length < 20) {
        showFieldError(messageInput, messageError, "Message must be at least 20 characters.");
        isValid = false;
      }

      // --- If all checks pass, simulate submission ---
      if (isValid) {
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        // Simulate a network request (replace with real fetch/EmailJS later)
        setTimeout(function () {
          // Show success message
          if (formFeedback) {
            formFeedback.textContent = "✅ Message sent! I'll get back to you soon.";
            formFeedback.className = "form__feedback is-success";
          }

          // Reset the form fields
          if (nameInput)    nameInput.value    = "";
          if (emailInput)   emailInput.value   = "";
          if (subjectInput) subjectInput.value = "";
          if (messageInput) messageInput.value = "";

          // Restore the button
          submitBtn.disabled    = false;
          submitBtn.textContent = "Send Message >";

          // Hide the success message after 5 seconds
          setTimeout(function () {
            if (formFeedback) {
              formFeedback.className  = "form__feedback";
              formFeedback.textContent = "";
            }
          }, 5000);

        }, 1500); // Simulated 1.5s delay
      }
    });
  }


  /* ----------------------------------------------------------
     10. BACK TO TOP BUTTON
     Shows a "scroll to top" button once the user
     has scrolled down 400px. Hides it at the top.
  ---------------------------------------------------------- */

  const backToTopBtn = document.getElementById("back-to-top-btn");

  function handleBackToTop() {
    if (!backToTopBtn) return;

    if (window.scrollY > 400) {
      backToTopBtn.classList.add("is-visible");
    } else {
      backToTopBtn.classList.remove("is-visible");
    }
  }

  if (backToTopBtn) {
    // Scroll back to the top when clicked
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  window.addEventListener("scroll", handleBackToTop);
  handleBackToTop(); // Run once on load


  /* ----------------------------------------------------------
     11. FOOTER YEAR AUTO-UPDATE
     Keeps the copyright year in the footer always
     up-to-date automatically.
  ---------------------------------------------------------- */

  var footerYear = document.getElementById("footer-year");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }


  /* ----------------------------------------------------------
     PERFORMANCE: Throttle scroll events
     Running many functions on every scroll event can
     slow down the page. This groups them into one
     efficient scroll handler.
  ---------------------------------------------------------- */

  var scrollTimeout = null;

  window.addEventListener(
    "scroll",
    function () {
      if (scrollTimeout) return; // Skip if already scheduled

      scrollTimeout = requestAnimationFrame(function () {
        // All scroll-dependent functions are already attached above.
        // This block can be used for any extra scroll logic.
        scrollTimeout = null;
      });
    },
    { passive: true } // Improves scroll performance on mobile
  );


  /* ----------------------------------------------------------
     BONUS: Highlight current section on page load
     (handles cases where user lands on a bookmarked URL)
  ---------------------------------------------------------- */
  updateActiveNavLink();


}); // END DOMContentLoaded
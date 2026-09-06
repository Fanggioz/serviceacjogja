document.addEventListener("DOMContentLoaded", () => {
  // Isi tahun copyright otomatis (pengganti document.write versi Blogger)
  const yearEl = document.getElementById("copyright-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Animasi counter statistik
  const counterElements = document.querySelectorAll(".stat-number");
  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    const suffix = counter.getAttribute("data-suffix") || "";
    const duration = 2000;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const currentCount = Math.floor(easeProgress * target);
      counter.innerText = currentCount.toLocaleString("id-ID") + suffix;
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target.toLocaleString("id-ID") + suffix;
      }
    };
    requestAnimationFrame(updateCount);
  };

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observerInstance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counterElements.forEach((counter) => observer.observe(counter));

  // Accordion FAQ 
  const faqColumns = document.querySelectorAll(".faq-column");
  const allFaqItems = document.querySelectorAll(".faq-item");

  allFaqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const wrapper = item.querySelector(".faq-answer-wrapper");

    if (question && wrapper) {
      question.addEventListener("click", function () {
        const isActive = item.classList.contains("active");
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
          allFaqItems.forEach((otherItem) => {
            otherItem.classList.remove("active");
            const otherWrapper = otherItem.querySelector(".faq-answer-wrapper");
            if (otherWrapper) otherWrapper.style.maxHeight = null;
          });
        } else {

          const parentColumn = item.closest(".faq-column");
          if (parentColumn) {
            parentColumn.querySelectorAll(".faq-item").forEach((otherItem) => {
              otherItem.classList.remove("active");
              const otherWrapper = otherItem.querySelector(".faq-answer-wrapper");
              if (otherWrapper) otherWrapper.style.maxHeight = null;
            });
          }
        }

        if (!isActive) {
          item.classList.add("active");
          wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        }
      });
    }
  });

  // Toggle menu mobile
  const menuToggle = document.querySelector(".menu-toggle");
  const menuIcon = document.querySelector(".menu-toggle i");
  const navLinks = document.querySelector(".landing-page header .links");
  const header = document.querySelector(".landing-page header");

  if (menuToggle && navLinks) {
    function closeMenu() {
      navLinks.classList.remove("active");
      if (menuIcon) menuIcon.className = "ri-menu-line";
    }
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      navLinks.classList.toggle("active");
      if (navLinks.classList.contains("active")) {
        menuIcon.className = "ri-close-line";
      } else {
        menuIcon.className = "ri-menu-line";
      }
    });
    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) {
        closeMenu();
      }
    });
    window.addEventListener("scroll", function () {
      if (navLinks.classList.contains("active")) {
        closeMenu();
      }
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });
  }

  // Share button (Web Share API + fallback Twitter intent)
  const shareBtn = document.querySelector(".share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const pageUrl = window.location.href;
      const pageTitle = document.title;
      if (navigator.share) {
        navigator.share({ title: pageTitle, url: pageUrl }).catch((err) => {
          console.log("Share canceled or failed", err);
        });
      } else {
        const windowOptions = "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=520,height=420";
        const twitterShareUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(pageTitle) + "&url=" + encodeURIComponent(pageUrl);
        window.open(twitterShareUrl, "_blank", windowOptions);
      }
    });
  }
});
// Smooth
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
// Lazy Loading Gambar + Efek Fade-In
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = image.dataset.src;
        image.classList.add("fade-in");
        observer.unobserve(image);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
});

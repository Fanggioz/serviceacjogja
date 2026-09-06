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
  faqColumns.forEach((column) => {
    const items = column.querySelectorAll(".faq-item");
    items.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const wrapper = item.querySelector(".faq-answer-wrapper");
      question.addEventListener("click", function () {
        const isActive = item.classList.contains("active");
        items.forEach((otherItem) => {
          otherItem.classList.remove("active");
          otherItem.querySelector(".faq-answer-wrapper").style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add("active");
          wrapper.style.maxHeight = wrapper.scrollHeight + "px";
        }
      });
    });
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

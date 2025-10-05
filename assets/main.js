// Webpack Imports
import * as bootstrap from 'bootstrap';

(function () {
    'use strict';

    // Focus input if Searchform is empty
    [].forEach.call(document.querySelectorAll('.search-form'), (el) => {
        el.addEventListener('submit', function (e) {
            var search = el.querySelector('input');
            if (search.value.length < 1) {
                e.preventDefault();
                search.focus();
            }
        });
    });

    // Initialize Popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl, { trigger: 'focus' });
    });
})();

// Scroll classes for Navbar
document.addEventListener("scroll", function () {
    const navbar = document.getElementById("header");
    if (window.scrollY > 10) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Homepage projects functionality
document.addEventListener('DOMContentLoaded', () => {
    const reel = document.querySelector('.projects-reel');
    if (!reel) return;

    const menuLinks = document.querySelectorAll('.project-menu a');
    const sections = reel.querySelectorAll('.wp-block-cover');

    let isScrolling = false;

    const scrollToSection = (targetIndex) => {
        if (targetIndex < 0 || targetIndex >= sections.length) return;
        isScrolling = true;
        reel.scrollTo({
            top: sections[targetIndex].offsetTop,
            behavior: 'smooth'
        });
        setTimeout(() => {
            isScrolling = false;
        }, 600); // allow smooth scroll to finish
    };

    // Wheel event to iterate one section at a time
    reel.addEventListener('wheel', (e) => {
        if (isScrolling) {
            e.preventDefault();
            return;
        }

        const delta = e.deltaY;
        const scrollTop = reel.scrollTop;

        // Determine current section
        let currentIndex = 0;
        sections.forEach((section, idx) => {
            if (scrollTop >= section.offsetTop) currentIndex = idx;
        });

        if (delta > 0 && currentIndex < sections.length - 1) {
            // Scroll down
            e.preventDefault();
            scrollToSection(currentIndex + 1);
        } else if (delta < 0 && currentIndex > 0) {
            // Scroll up
            e.preventDefault();
            scrollToSection(currentIndex - 1);
        }
        // Otherwise allow normal scrolling if at start or end
    }, { passive: false });

    // Update menu active state
    function updateMenu() {
        const viewportCenter = reel.scrollTop + reel.clientHeight / 2;
        let currentSectionId = null;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (viewportCenter >= top && viewportCenter < bottom) {
                currentSectionId = section.id;
            }
        });

        menuLinks.forEach(link => {
            const li = link.parentElement;
            const targetId = link.getAttribute('href').replace('#', '');

            li.classList.remove('active');
            const oldBtn = li.querySelector('.open-project-btn');
            if (oldBtn) oldBtn.remove();

            if (targetId === currentSectionId) {
                li.classList.add('active');

                const btn = document.createElement('a');
                btn.href = '#'; // blank link for now
                btn.textContent = '[Open Project]';
                btn.classList.add('open-project-btn');
                li.appendChild(btn);
            }
        });
    }

    // Smooth scroll for menu links
    menuLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                reel.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
            setTimeout(updateMenu, 100);
        });
    });

    // Listen to reel scroll
    reel.addEventListener('scroll', updateMenu);

    // Initialize menu state
    updateMenu();


	// Project Menu visibility

	const projectMenu = document.querySelector('.project-menu');
	const lastSection = sections[sections.length - 1];

	function toggleMenuVisibility() {
		const reelRect = reel.getBoundingClientRect();
		const lastSectionBottom = lastSection.getBoundingClientRect().bottom;

		// Hide menu if bottom of last section is above the top of viewport
		if (lastSectionBottom <= 0) {
			projectMenu.style.opacity = '0';
			projectMenu.style.pointerEvents = 'none';
		} else {
			projectMenu.style.opacity = '1';
			projectMenu.style.pointerEvents = 'auto';
		}
	}

	// Call on reel scroll
	reel.addEventListener('scroll', toggleMenuVisibility);

	// Optional: call on window scroll too if needed
	window.addEventListener('scroll', toggleMenuVisibility);

	// Initialize
	toggleMenuVisibility();

});


// "Active" classes for the Gutenburg Cover blocks and "Scrolling" class for the <main> 

document.addEventListener('DOMContentLoaded', () => {
  const covers = document.querySelectorAll('.wp-block-cover');
  const main = document.querySelector('main');
  const projectsReel = document.querySelector('.projects-reel');

  // ---- Intersection Observer for active cover blocks ----
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    },
    {
      threshold: 0.25, // 25% visible
    }
  );

  covers.forEach((cover) => observer.observe(cover));

  // ---- "scrolling" class for <main> ----
  let mainScrollTimeout;
  window.addEventListener('scroll', () => {
    if (!main) return;
    main.classList.add('scrolling');
    clearTimeout(mainScrollTimeout);
    mainScrollTimeout = setTimeout(() => {
      main.classList.remove('scrolling');
    }, 250);
  });

  // ---- "scrolling" class for .projects-reel ----
  if (projectsReel) {
    let reelScrollTimeout;

    projectsReel.addEventListener('scroll', () => {
      projectsReel.classList.add('scrolling');
      clearTimeout(reelScrollTimeout);

      reelScrollTimeout = setTimeout(() => {
        projectsReel.classList.remove('scrolling');
      }, 250); // 250ms after user stops scrolling
    });
  }
});


// Slide counter for homepage projects

document.addEventListener('DOMContentLoaded', () => {
  const covers = document.querySelectorAll('.wp-block-cover');
  const projectsReel = document.querySelector('.projects-reel');
  const slideCounter = document.getElementById('slide-counter');
  const totalSlides = covers.length;
  let currentSlide = 1;

  if (slideCounter) {
    slideCounter.textContent = `1 / ${totalSlides}`;
  }

  // Observe which cover is in view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          covers.forEach((cover, i) => {
            if (cover === entry.target) {
              currentSlide = i + 1;
              if (slideCounter) {
                slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
              }
            }
          });
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    },
    { threshold: 0.5 }
  );

  covers.forEach((cover) => observer.observe(cover));

  // Fade counter in/out when the projects reel enters/leaves viewport
  const reelObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (slideCounter) {
          slideCounter.classList.toggle('visible', entry.isIntersecting);
        }
      });
    },
    { threshold: 0.1 }
  );

  if (projectsReel) reelObserver.observe(projectsReel);
});


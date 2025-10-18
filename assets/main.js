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
          if (oldBtn) oldBtn.remove(); // optional, in case old ones still exist

          if (targetId === currentSectionId) {
              li.classList.add('active');
              // no button creation anymore
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


	// Animate in project menu items with stagger
	const projectItems = document.querySelectorAll('.project-menu li');
	projectItems.forEach((item, i) => {
	item.style.animationDelay = `${i * 0.1}s`; // 0.1s stagger
	});


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


// Splash Screen functionality

document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash-screen");
  const percent = document.getElementById("splash-percent");
  const bar = document.querySelector(".progress-fill");


  if (!splash || !percent) return;

  document.body.style.overflow = "hidden"; // Lock scroll until loaded

  const images = document.images;
  const total = images.length;
  let loaded = 0;
  let displayedProgress = 0; // Smooth counter display

  if (total === 0) {
    finishLoading();
  } else {
    [...images].forEach((img) => {
      const imageClone = new Image();
      imageClone.onload = imageClone.onerror = () => {
        loaded++;
        updateProgress();
      };
      imageClone.src = img.src;
    });
  }

  function updateProgress() {
    const targetProgress = Math.floor((loaded / total) * 100);
    animateCounter(targetProgress);

    if (loaded === total) {
      setTimeout(finishLoading, 500);
    }
  }

  // Smoothly animates number transitions
  function animateCounter(target) {
  const step = () => {
    displayedProgress += (target - displayedProgress) * 0.2;
    if (Math.abs(target - displayedProgress) < 1) {
      displayedProgress = target;
    }

    percent.textContent = `${Math.round(displayedProgress)}%`;
    if (bar) bar.style.width = `${Math.round(displayedProgress)}%`;

    if (displayedProgress < target) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}


  function finishLoading() {
    setTimeout(() => {
      splash.classList.add("hidden");
      document.body.style.overflow = "auto";
    }, 300); // allow small fade buffer
  }
});


// Reset project video on re-entry to viewport (with auto-pause)

document.addEventListener("DOMContentLoaded", () => {
  const covers = document.querySelectorAll(".wp-block-cover");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector("video");

      if (video) {
        if (entry.isIntersecting) {
          // Pause all other videos
          document.querySelectorAll(".wp-block-cover video").forEach(v => {
            if (v !== video) {
              v.pause();
              v.classList.remove("is-visible");
            }
          });

          // Reset & play the current one
          video.currentTime = 0;
          video.classList.add("is-visible");
          video.play().catch(() => {}); // Prevent autoplay error
        } else {
          // Pause when leaving viewport
          video.pause();
          video.classList.remove("is-visible");
        }
      }
    });
  }, { threshold: 0.25 }); // Trigger when 25% visible

  covers.forEach(cover => observer.observe(cover));
});


// Works thumbnails functionality 

document.addEventListener("DOMContentLoaded", () => {
	const posts = document.querySelectorAll(".wp-block-post");
	const bar = document.querySelector(".project-data-bar");
	if (!bar) return;

	const titleEl = bar.querySelector(".film-title");
	const directorEl = bar.querySelector(".film-director");
	const releaseEl = bar.querySelector(".film-release");
	const viewBtn = bar.querySelector(".view-project-btn");
	const fullLink = bar.querySelector(".full-project-link");

	const updateBar = (post) => {
		titleEl.textContent = post.dataset.title || "Untitled";
		directorEl.textContent = post.dataset.director || "Unknown";
		releaseEl.textContent = post.dataset.release || "TBC";
		viewBtn.href = post.dataset.url || "#";
		fullLink.href = post.dataset.url || "#";
	};

	posts.forEach(post => {
		post.addEventListener("mouseenter", () => updateBar(post));
		post.addEventListener("click", () => updateBar(post)); // Mobile tap
	});
});


// Adding data attributes to Works posts for easier JS access

document.addEventListener('DOMContentLoaded', () => {
  const films = document.querySelectorAll('.wp-block-post');

  films.forEach(film => {
    // Fetch title from the DOM
    const title = film.querySelector('.wp-block-post-title')?.textContent || film.getAttribute('aria-label') || 'Untitled';

    // Fetch director and release from ACF fields rendered in the content, if present
    // (Replace these selectors with where your ACF fields actually appear)
    const director = film.getAttribute('data-director') || 'Unknown';
    const release = film.getAttribute('data-release') || 'Unknown';

    // Add data attributes
    film.setAttribute('data-title', title);
    film.setAttribute('data-director', director);
    film.setAttribute('data-release', release);

    // Add URL
    const link = film.querySelector('a');
    if (link) film.setAttribute('data-url', link.href);
  });
});


// Disabling scrolling when the mobile menu is open 

document.addEventListener('DOMContentLoaded', function () {
  const mobileNav = document.getElementById('mobileNav');

  const toggleBodyScroll = () => {
    if (mobileNav.classList.contains('show')) {
      document.body.style.overflow = 'hidden'; // disable scroll
    } else {
      document.body.style.overflow = ''; // re-enable scroll
    }
  };

  // Run on load in case it's already open
  toggleBodyScroll();

  // Observe changes to the class
  const observer = new MutationObserver(toggleBodyScroll);
  observer.observe(mobileNav, { attributes: true, attributeFilter: ['class'] });
});


// Auto-scroll up to the top of the page when not on footer

document.addEventListener('DOMContentLoaded', function () {
  // Only run on the homepage
  if (!document.body.classList.contains('home')) return;

  const main = document.querySelector('main');
  if (!main) return;

  let isScrollingToTop = false;

  main.addEventListener('wheel', function (e) {
    // Trigger only when scrolling upward
    if (e.deltaY < -30 && !isScrollingToTop) {
      isScrollingToTop = true;

      window.scrollTo({
        top: 0,
        behavior: 'smooth' // ✅ smooth scroll
      });

      // Cooldown to avoid multiple triggers in one gesture
      setTimeout(() => {
        isScrollingToTop = false;
      }, 1000);
    }
  });
});


// Resume all videos on resize

document.addEventListener('DOMContentLoaded', function () {
  const videos = document.querySelectorAll('.wp-block-cover__video-background');

  // Function to resume all videos
  function resumeVideos() {
    videos.forEach(video => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    });
  }

  // Listen for resize (debounced to prevent spam)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resumeVideos, 250); // small delay for stability
  });
});


// Parallax Effect for pages with background images

let latestScroll = 0;
let ticking = false;

window.addEventListener('scroll', function() {
	latestScroll = window.pageYOffset;
	if (!ticking) {
		window.requestAnimationFrame(function() {
			const main = document.querySelector('#main.has-background-image');
			if (main) {
				main.style.backgroundPositionY = -(latestScroll * 0.2) + 'px';
			}
			ticking = false;
		});
		ticking = true;
	}
});


// Adding "Selected" class to work items on click

// Select all the film list items
const filmItems = document.querySelectorAll('.films-reel .wp-block-post');

filmItems.forEach(item => {
	// Function to handle selection
	const selectItem = () => {
		// Remove 'selected' from all items
		filmItems.forEach(i => i.classList.remove('selected'));

		// Add 'selected' to the current item
		item.classList.add('selected');
	};

	// Add click and touch event listeners
	item.addEventListener('click', selectItem);
	item.addEventListener('touchstart', selectItem);
});

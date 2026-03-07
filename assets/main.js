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

// Homepage / Works projects functionality
document.addEventListener('DOMContentLoaded', () => {
	const reel = document.querySelector('.projects-reel');
	if (!reel) return;

	const menuLinks = document.querySelectorAll('.project-menu a');
	const sections = [...reel.querySelectorAll('.wp-block-cover')];
	if (!sections.length) return;

	let currentIndex = 0;
	let isAnimating = false;

	let wheelGestureLocked = false;
	let wheelAccumulator = 0;
	let wheelUnlockTimer = null;

	let touchStartY = 0;
	let touchEndY = 0;

	const ANIMATION_DURATION = 1200;
	const SWIPE_THRESHOLD = 60;
	const WHEEL_THRESHOLD = 80;
	const WHEEL_GESTURE_TIMEOUT = 220;

	const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

	const getClosestSectionIndex = () => {
		const reelTop = reel.scrollTop;
		let closestIndex = 0;
		let smallestDistance = Infinity;

		sections.forEach((section, index) => {
			const distance = Math.abs(section.offsetTop - reelTop);
			if (distance < smallestDistance) {
				smallestDistance = distance;
				closestIndex = index;
			}
		});

		return closestIndex;
	};

	const updateMenu = () => {
		menuLinks.forEach((link, index) => {
			const li = link.parentElement;
			li.classList.toggle('active', index === currentIndex);
		});
	};

	const scrollToSection = (targetIndex) => {
		const nextIndex = clamp(targetIndex, 0, sections.length - 1);
		if (nextIndex === currentIndex || isAnimating) return;

		isAnimating = true;
		currentIndex = nextIndex;
		updateMenu();

		reel.scrollTo({
			top: sections[currentIndex].offsetTop,
			behavior: 'smooth'
		});

		setTimeout(() => {
			isAnimating = false;
		}, ANIMATION_DURATION);
	};

	const goToNext = () => scrollToSection(currentIndex + 1);
	const goToPrev = () => scrollToSection(currentIndex - 1);

	currentIndex = getClosestSectionIndex();
	updateMenu();

	// WHEEL / TRACKPAD: treat one swipe as one gesture
	reel.addEventListener('wheel', (e) => {
		e.preventDefault();

		if (isAnimating) return;
		if (Math.abs(e.deltaY) < 2) return;

		// If already triggered during this gesture, ignore momentum events
		if (wheelGestureLocked) return;

		wheelAccumulator += e.deltaY;

		clearTimeout(wheelUnlockTimer);
		wheelUnlockTimer = setTimeout(() => {
			wheelAccumulator = 0;
			wheelGestureLocked = false;
		}, WHEEL_GESTURE_TIMEOUT);

		if (Math.abs(wheelAccumulator) < WHEEL_THRESHOLD) return;

		wheelGestureLocked = true;

		if (wheelAccumulator > 0) {
			goToNext();
		} else {
			goToPrev();
		}

		wheelAccumulator = 0;

		setTimeout(() => {
			wheelGestureLocked = false;
		}, ANIMATION_DURATION + 150);
	}, { passive: false });

	// TOUCH SWIPE
	reel.addEventListener('touchstart', (e) => {
		if (!e.touches.length) return;
		touchStartY = e.touches[0].clientY;
	}, { passive: true });

	reel.addEventListener('touchend', (e) => {
		if (isAnimating || !e.changedTouches.length) return;

		touchEndY = e.changedTouches[0].clientY;
		const deltaY = touchStartY - touchEndY;

		if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;

		if (deltaY > 0) {
			goToNext();
		} else {
			goToPrev();
		}
	}, { passive: true });

	// KEYBOARD
	window.addEventListener('keydown', (e) => {
		if (isAnimating) return;

		if (e.key === 'ArrowDown' || e.key === 'PageDown') {
			e.preventDefault();
			goToNext();
		}

		if (e.key === 'ArrowUp' || e.key === 'PageUp') {
			e.preventDefault();
			goToPrev();
		}
	}, { passive: false });

	// MENU LINKS
	menuLinks.forEach((link, index) => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			scrollToSection(index);
		});
	});

	// Sync active state only when not animating
	reel.addEventListener('scroll', () => {
		if (isAnimating) return;
		currentIndex = getClosestSectionIndex();
		updateMenu();
	});

	// Project menu visibility
	const projectMenu = document.querySelector('.project-menu');
	const lastSection = sections[sections.length - 1];

	function toggleMenuVisibility() {
		if (!projectMenu || !lastSection) return;

		const lastSectionBottom = lastSection.getBoundingClientRect().bottom;

		if (lastSectionBottom <= 0) {
			projectMenu.style.opacity = '0';
			projectMenu.style.pointerEvents = 'none';
		} else {
			projectMenu.style.opacity = '1';
			projectMenu.style.pointerEvents = 'auto';
		}
	}

	reel.addEventListener('scroll', toggleMenuVisibility);
	window.addEventListener('scroll', toggleMenuVisibility);
	toggleMenuVisibility();

	const projectItems = document.querySelectorAll('.project-menu li');
	projectItems.forEach((item, i) => {
		item.style.animationDelay = `${i * 0.1}s`;
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

	// Mosaic row/column count helper for homepage mosaic (used elsewhere)
	const getRowCount = () => {
		const width = window.innerWidth;
		if (width >= 2560) return 5; // 4K+ / ultra-wide
		if (width >= 1200) return 4;
		if (width >= 768) return 4;
		if (width >= 576) return 5;
		return 5;
	};
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
  // Only run on the Works Page
  if (!document.body.classList.contains('page-template-page-works')) return;

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


// Live count-up effect for stats numbers 

document.addEventListener('DOMContentLoaded', () => {
  const statSection = document.querySelector('.stats');
  if (!statSection) return;

  const counters = statSection.querySelectorAll('.project-unit');
  let hasCounted = false;

  // Function to animate numbers
  function countUp(el, target, hasPlus) {
    const duration = 2000; // total time for animation
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value + (hasPlus ? '+' : '');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // Start the count for all counters
  function startCounting() {
    counters.forEach(el => {
      const text = el.dataset.originalValue || el.textContent.trim();
      const hasPlus = text.includes('+');
      const target = parseInt(text.replace(/\D/g, ''), 10);
      el.dataset.originalValue = text;
      el.textContent = '0';
      countUp(el, target, hasPlus);
    });
  }

  // Reset counters to 0 (for when the section leaves view)
  function resetCounters() {
    counters.forEach(el => {
      el.textContent = '0';
    });
    hasCounted = false;
    statSection.classList.remove('visible');
  }

  // Scroll event handler
  function handleScroll() {
    const rect = statSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    const completelyOutOfView = rect.bottom <= 0 || rect.top >= window.innerHeight;

    if (inView && !hasCounted) {
      startCounting();
      statSection.classList.add('visible');
      hasCounted = true;
    }

    if (completelyOutOfView && hasCounted) {
      resetCounters(); // ✅ re-enable replay after it leaves the screen
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();
});


// Showreel Carousel Auto-Scroll + NEW Dynamic Lightbox

document.addEventListener("DOMContentLoaded", function () {

  const carousel = document.querySelector('.showreel-carousel');
  if (!carousel) return;

  /* -------------------------------
     AUTO SCROLL
  --------------------------------*/
  let scrollSpeed = 0.3;
  let isHovered = false;
  let isLightboxOpen = false;

  carousel.addEventListener("mouseenter", () => {
    if (!isLightboxOpen) isHovered = true;
  });

  carousel.addEventListener("mouseleave", () => {
    if (!isLightboxOpen) isHovered = false;
  });

  function autoScroll() {
    if (!isHovered && !isLightboxOpen) {
      carousel.scrollLeft += scrollSpeed;

      if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
        carousel.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }
  autoScroll();


  /* -------------------------------
     CREATE LIGHTBOX ONLY ONCE
  --------------------------------*/
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  document.body.appendChild(lightbox);


  /* -------------------------------
     OPEN LIGHTBOX ON IMAGE CLICK
  --------------------------------*/
  const galleryImages = carousel.querySelectorAll("img");

  galleryImages.forEach(img => {
    img.addEventListener("click", () => {
      isLightboxOpen = true;
      isHovered = true; // pause scroll

      // Clear previous content
      lightbox.innerHTML = "";

      // Create image element dynamically
      const bigImg = document.createElement("img");
      bigImg.src = img.src;
      bigImg.alt = img.alt || "";

      // Append to lightbox
      lightbox.appendChild(bigImg);

      // Show lightbox
      lightbox.classList.add("visible");

      // Disable body scroll
      document.body.style.overflow = "hidden";
    });
  });


  /* -------------------------------
     CLOSE LIGHTBOX ON CLICK OUTSIDE
  --------------------------------*/
  lightbox.addEventListener("click", (e) => {
    // Only close if they clicked OUTSIDE the inserted image
    if (e.target === lightbox) {
      lightbox.classList.remove("visible");
      isLightboxOpen = false;
      isHovered = false;
      document.body.style.overflow = "";
    }
  });

});


// Adding ACF Field values inside the film overlays for the homepage mosaic

document.querySelectorAll('.wp-block-post').forEach(tile => {

	const overlay = tile.querySelector('.film-overlay .wp-block-group__inner-container');
	if (!overlay) return;


	// --------------------------------
	// Store preview media for lightbox
	// --------------------------------

	if (tile.dataset.video_preview) {
		overlay.dataset.videoPreview = tile.dataset.video_preview;
	}

	if (tile.dataset.image_preview) {
		overlay.dataset.imagePreview = tile.dataset.image_preview;
	}

});

// Endless loop for homepage film oscillator

document.addEventListener("DOMContentLoaded", () => {
	const mosaic = document.querySelector(".mosaic-columns");
	if (!mosaic) return;

	// Grab original Gutenberg posts
	const originalPosts = Array.from(mosaic.querySelectorAll(".wp-block-post"));
	if (!originalPosts.length) return;

	/* ----------------------------------------
	   Helpers
	---------------------------------------- */

	// Fisher–Yates shuffle (true random, fast)
	const shuffle = (array) => {
		const arr = [...array];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	};

	const getRowCount = () => {
		const w = window.innerWidth;
		if (w < 576) return 5;   // mobile
		if (w < 768) return 4;
		return 4;
	};

	/* ----------------------------------------
	   Build Rows
	---------------------------------------- */

	const buildRows = () => {
		// Remove previously generated rows
		document.querySelectorAll(".oscillating-row").forEach(r => r.remove());

		const rowCount = getRowCount();
		const rows = Array.from({ length: rowCount }, () => {
			const row = document.createElement("div");
			row.classList.add("oscillating-row");
			return row;
		});

		// Randomise order ON LOAD / RESIZE
		const shuffledPosts = shuffle(originalPosts);

		// Distribute posts evenly across rows
		shuffledPosts.forEach((post, i) => {
			rows[i % rowCount].appendChild(post.cloneNode(true));
		});

		// Duplicate contents ×3 for seamless looping
		rows.forEach((row, index) => {
			const tiles = Array.from(row.children);

			for (let i = 0; i < 2; i++) {
				tiles.forEach(tile => {
					row.appendChild(tile.cloneNode(true));
				});
			}

			// Alternate direction
			row.classList.add(index % 2 === 0 ? "scroll-left" : "scroll-right");

			// Insert AFTER the Gutenberg UL
			mosaic.parentNode.appendChild(row);
		});
	};

	// Initial build
	buildRows();

	// Rebuild on resize (debounced)
	let resizeTimer;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(buildRows, 250);
	});
});

// Make whole mosaic tile clickable 

document.addEventListener("DOMContentLoaded", function () {
    const tiles = document.querySelectorAll(".film-tile"); // your tile selector

    tiles.forEach(tile => {
        const anchor = tile.querySelector("a");

        if (!anchor) return; // Skip tiles with no links

        // Make cursor a link
        tile.style.cursor = "pointer";

        tile.addEventListener("click", (e) => {
            // Prevent double-activating when clicking the real <a>
            if (e.target.tagName.toLowerCase() === "a") return;

            // Simulate click on the internal link
            anchor.click();
        });
    });
});

// Custom cursor for the site

document.addEventListener('DOMContentLoaded', () => {

	const cursor = document.querySelector('.solace-cursor');
	if (!cursor) return;

	const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	if (!isDesktop) return;

	const interactiveSelector = `
		a,
		button,
		input,
		textarea,
		select,
		label,
		[role="button"],
		.film-tile,
		.wp-block-post,
		.nav-link,
		.navbar-brand
	`;

	let visible = false;

	let mouseX = window.innerWidth / 2;
	let mouseY = window.innerHeight / 2;

	let currentX = mouseX;
	let currentY = mouseY;

	const speed = 0.14; // 0.1 = floatier, 0.18 = snappier

	const showCursor = () => {
		if (!visible) {
			cursor.classList.add('is-visible');
			visible = true;
		}
	};

	const hideCursor = () => {
		cursor.classList.remove('is-visible');
		cursor.classList.remove('is-hovering');
		cursor.classList.remove('is-clicking');
		visible = false;
	};

	document.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;

		showCursor();

		const interactive = e.target.closest(interactiveSelector);
		cursor.classList.toggle('is-hovering', !!interactive);
	});

	document.addEventListener('mousedown', () => {
		cursor.classList.remove('is-clicking');
		void cursor.offsetWidth;
		cursor.classList.add('is-clicking');
	});

	document.addEventListener('mouseup', () => {
		setTimeout(() => {
			cursor.classList.remove('is-clicking');
		}, 180);
	});

	document.addEventListener('mouseleave', hideCursor);
	window.addEventListener('blur', hideCursor);

	const animateCursor = () => {
		currentX += (mouseX - currentX) * speed;
		currentY += (mouseY - currentY) * speed;

		cursor.style.left = `${currentX}px`;
		cursor.style.top = `${currentY}px`;

		requestAnimationFrame(animateCursor);
	};

	animateCursor();
});
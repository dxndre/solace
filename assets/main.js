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

	// Initialize Popovers: https://getbootstrap.com/docs/5.0/components/popovers
	var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
	var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
		return new bootstrap.Popover(popoverTriggerEl, {
			trigger: 'focus',
		});
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


// Homepage scrolling functionality

document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.project-menu a');
    const sections = document.querySelectorAll('.wp-block-cover');
    const mediaImg = document.getElementById('dynamic-media');

    function updateMenu() {
        let current = null;
        const viewportCenter = window.scrollY + window.innerHeight / 2;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
                current = section.id || section.dataset.anchor;
            }
        });

        menuLinks.forEach(link => {
            const li = link.parentElement;
            li.classList.remove('active');

            // Remove old Open Project buttons
            const oldButton = li.querySelector('.open-project-btn');
            if (oldButton) oldButton.remove();

            if (link.getAttribute('href') === '#' + current) {
                li.classList.add('active');

                // Add Open Project button wrapped in <a>
                const btnLink = document.createElement('a');
                btnLink.href = '#'; // temporary blank link
                btnLink.classList.add('open-project-btn');
                btnLink.textContent = '[Open Project]';
                li.appendChild(btnLink);

                // Update media
                const mediaUrl = link.dataset.media;
                if (mediaUrl) {
                    mediaImg.style.opacity = 0;
                    setTimeout(() => {
                        mediaImg.src = mediaUrl;
                        mediaImg.style.opacity = 1;
                    }, 200);
                }
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
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateMenu(); // immediately highlight clicked item
            }
        });
    });

    // Scroll event
    window.addEventListener('scroll', updateMenu);

    // Initialize menu state
    updateMenu();
});



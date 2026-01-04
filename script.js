document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Spy for Nav Links
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Budget Buttons Selection
    const budgetBtns = document.querySelectorAll('.budget-btn');
    const budgetInput = document.getElementById('budget');

    budgetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            budgetBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            // Update hidden input
            if (budgetInput) {
                budgetInput.value = btn.getAttribute('data-value');
            }
        });
    });

    // Contact Form Handling (Mock CMS)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get values
            const formData = {
                id: Date.now(),
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                type: document.getElementById('type').value,
                budget: document.getElementById('budget').value,
                message: document.getElementById('message').value,
                date: new Date().toLocaleDateString(),
                status: 'New'
            };

            // Save to LocalStorage
            let messages = JSON.parse(localStorage.getItem('messages') || '[]');
            messages.push(formData);
            localStorage.setItem('messages', JSON.stringify(messages));

            // Show success (simple alert for now, or custom UI)
            alert('Request sent successfully! We will contact you shortly.');
            contactForm.reset();
        });
    }

    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    // Simple Intersection Observer for stats
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateStats();
                hasAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) observer.observe(statsSection);

    function animateStats() {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            if (!target) return; // Skip if no target (e.g. 100%)

            const increment = target / 50;
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target + '+';
                }
            };
            updateCount();
        });
    }


    // Video Modal Logic
    const videoModal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    const closeBtn = document.querySelector('.close-modal');
    const videoCards = document.querySelectorAll('.video-card');
    const heroVideoBtn = document.getElementById('heroVideoBtn');

    if (videoModal) {

        // Helper to open video
        function openVideo(videoId) {
            if (videoId) {
                // Use youtube-nocookie for better compatibility with local files
                // Added playsinline and mute=0 (removed rel=0 which is sometimes problematic)
                // videoFrame.src = `https://www.youtube-nocookie.com/embed/${videoId.trim()}?autoplay=1&playsinline=1`;
                videoFrame.src = `https://www.youtube.com/embed/${videoId.trim()}?autoplay=1&playsinline=1`;
                videoModal.classList.add('active');
            }
        }

        // Open Modal from Cards
        if (videoCards.length > 0) {
            videoCards.forEach(card => {
                card.addEventListener('click', () => {
                    const videoId = card.getAttribute('data-video-id');
                    openVideo(videoId);
                });
            });
        }



        // Close Modal Function
        function closeModal() {
            videoModal.classList.remove('active');
            videoFrame.src = ''; // Stop video playback
        }

        // Close events
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Close on outside click
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Portfolio Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    const category = item.querySelector('.portfolio-overlay p').innerText.toLowerCase();

                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'block';
                        // Add fade animation
                        item.style.opacity = '0';
                        setTimeout(() => item.style.opacity = '1', 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});

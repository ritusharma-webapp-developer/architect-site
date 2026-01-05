import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBOPzRY9EBi_Zcro-by975YnrizOnom7IU",
    authDomain: "cent-creative-homes-3749c.firebaseapp.com",
    projectId: "cent-creative-homes-3749c",
    storageBucket: "cent-creative-homes-3749c.firebasestorage.app",
    messagingSenderId: "897296608212",
    appId: "1:897296608212:web:2eb7ba601a62079025c441",
    measurementId: "G-QLQ359797X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize EmailJS
(function () {
    // Replace with your actual EmailJS Public Key
    emailjs.init("YOUR_PUBLIC_KEY");
})();

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

    // Helper to show form feedback
    function showFeedback(elementId, message, isSuccess) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerText = message;
            element.style.display = 'block';
            element.style.backgroundColor = isSuccess ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';
            element.style.color = isSuccess ? '#4ade80' : '#f87171';
            element.style.border = `1px solid ${isSuccess ? '#4ade8055' : '#f8717155'}`;

            // Show Success Modal if submission worked
            if (isSuccess) {
                const successModal = document.getElementById('successModal');
                if (successModal) {
                    successModal.classList.add('active');
                    document.body.classList.add('no-scroll');
                }

                // Also hide the inline message after 5 seconds
                setTimeout(() => {
                    element.style.display = 'none';
                }, 5000);
            }
        }
    }

    // Success Modal Closing Logic
    const successModal = document.getElementById('successModal');
    const closeSuccessBtn = document.getElementById('closeSuccessModal');
    const whatsappNotifyBtn = document.getElementById('whatsappNotifyBtn');

    let lastSubmittedData = null;

    if (successModal && closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });

        // Close on outside click
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    if (whatsappNotifyBtn) {
        whatsappNotifyBtn.addEventListener('click', () => {
            if (lastSubmittedData) {
                const adminPhone = "918821833411";
                const message = `*New Inquiry Received!*%0A%0A` +
                    `*Name:* ${lastSubmittedData.name}%0A` +
                    `*Email:* ${lastSubmittedData.email}%0A` +
                    `*Mobile:* ${lastSubmittedData.mobile}%0A` +
                    `*Type:* ${lastSubmittedData.type}%0A` +
                    `*Budget:* ${lastSubmittedData.budget}%0A` +
                    `*Time:* ${lastSubmittedData.contactTime}%0A` +
                    `*Details:* ${lastSubmittedData.message}`;

                window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');
            }
        });
    }

    // Contact Form Handling (Firebase)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Get values
                const formData = {
                    formId: 'cent-creative-homes-booking-form-id',
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    mobile: document.getElementById('mobile').value,
                    type: document.getElementById('type').value,
                    budget: document.getElementById('budget').value,
                    contactTime: document.getElementById('contactTime').value,
                    message: document.getElementById('message').value,
                    createdAt: serverTimestamp(),
                    status: 'New'
                };

                lastSubmittedData = formData;

                // 1. Save to Firestore
                await addDoc(collection(db, "cent-creative-homes-booking-form"), formData);

                // 2. Send Email via EmailJS
                try {
                    await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
                        to_name: "Cent Creative Homes Admin",
                        from_name: formData.name,
                        from_email: formData.email,
                        mobile: formData.mobile,
                        project_type: formData.type,
                        budget: formData.budget,
                        preferred_time: formData.contactTime,
                        message: formData.message,
                        reply_to: formData.email
                    });
                    console.log("Email sent successfully!");
                } catch (emailError) {
                    console.warn("EmailJS failed (probably keys not set):", emailError);
                }

                showFeedback('contactMessage', 'Request sent successfully! We will contact you shortly.', true);
                contactForm.reset();
                // Reset budget buttons
                budgetBtns.forEach(b => b.classList.remove('active'));
                if (document.querySelector('[data-value="50k-150k"]')) {
                    document.querySelector('[data-value="50k-150k"]').classList.add('active');
                }
            } catch (error) {
                console.error("Error adding document: ", error);
                showFeedback('contactMessage', 'An error occurred. Please try again later.', false);
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Newsletter Form Handling
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmail');
            const submitBtn = document.getElementById('newsletterBtn');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            try {
                await addDoc(collection(db, "subscribers"), {
                    email: emailInput.value,
                    subscribedAt: serverTimestamp()
                });

                showFeedback('newsletterMessage', 'Thanks for subscribing!', true);
                newsletterForm.reset();
            } catch (error) {
                console.error("Error adding subscriber: ", error);
                showFeedback('newsletterMessage', 'Failed to subscribe.', false);
            } finally {
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
            }
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

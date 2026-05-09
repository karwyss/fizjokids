// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 500);
});

// ===== THREE.JS 3D BACKGROUND =====
let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        alpha: true,
        antialias: true,
        transparent: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Create particles
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;

        // Blue gradient colors - visible on light bg
        colors[i] = Math.random() * 0.3 + 0.2;     // R - less red (more blue)
        colors[i + 1] = Math.random() * 0.3 + 0.4; // G
        colors[i + 2] = Math.random() * 0.3 + 0.7; // B - more blue
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const shapes = [];

    // Mouse movement effect
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    animate();

    function animate() {
        requestAnimationFrame(animate);

        // Rotate particles slowly
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0002;

        // Follow mouse gently
        particles.rotation.y += mouseX * 0.0005;
        particles.rotation.x += mouseY * 0.0005;

        renderer.render(scene, camera);
    }
}

initThreeJS();

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, parseInt(delay));
        }
    });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach((counter, index) => {
                setTimeout(() => animateCounter(counter), index * 200);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-3d-section, .hero-stats-3d').forEach(section => {
    counterObserver.observe(section);
});

// ===== 3D CARD FLIP =====
function flipCard(card) {
    card.classList.toggle('flipped');
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== MOBILE MENU =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link-3d').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== FORM HANDLING =====
document.getElementById('contactForm3D').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Wysłano!';
        btn.style.background = 'linear-gradient(135deg, #6EC8FF 0%, #4A90D9 100%)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.background = '';
            this.reset();
        }, 3000);
    }, 1500);
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-parallax') || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link-3d').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== CUSTOM CURSOR EFFECT (optional) =====
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .service-3d-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ===== GALLERY HOVER EFFECT =====
document.querySelectorAll('.gallery-3d-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.03) rotateX(5deg)';
    });
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotateX(0deg)';
    });
});

// ===== PRICING CARD HOVER EFFECT =====
document.querySelectorAll('.pricing-3d-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 40px rgba(74, 144, 217, 0.25)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

console.log('%c FIZJOKIDS 3D %c Premium Experience ', 
    'background: linear-gradient(135deg, #4A90D9, #2D7BCB); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold;',
    'background: #1A1A2E; color: #6EC8FF; padding: 10px 20px; font-size: 14px;');

// ===== TESTIMONIALS CAROUSEL =====
let currentSlide = 0;
const track = document.querySelector('.testimonials-track');
const dots = document.querySelectorAll('.dot');
const totalSlides = document.querySelectorAll('.testimonial-card').length;

function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function moveCarousel(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Auto-play carousel
setInterval(() => {
    moveCarousel(1);
}, 5000);

// Form validation for RODO checkbox
document.getElementById('contactForm3D').addEventListener('submit', function(e) {
    const rodoCheckbox = document.getElementById('rodo3D');
    if (!rodoCheckbox.checked) {
        e.preventDefault();
        alert('Proszę wyrazić zgodę RODO, aby wysłać wiadomość.');
        return false;
    }
});

/**
 * THE JOURNEY - INTERACTIVE EMOTIONAL ENGINE
 * Built with GSAP & ScrollTrigger
 */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ==========================================================================
// INITIALIZATION
// ==========================================================================
window.addEventListener('load', () => {
    initSoundPrompt();
    initLoader();
    initCursor();
    initMobileMenu(); // New
    initProgressiveReveal();
    initSectionTransitions();
    initInteractions();
    initParallax();
    initParticles();
    initCinematicScroll();
    initFloatingQuotes();
    initNavbarScroll();
});

// ==========================================================================
// MOBILE MENU ENGINE
// ==========================================================================
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.mobile-nav-item');

    const toggleMenu = () => {
        btn.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.classList.toggle('is-locked');
    };

    btn.addEventListener('click', toggleMenu);

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
            const target = link.getAttribute('href');
            gsap.to(window, { duration: 1.5, scrollTo: target, ease: 'power4.inOut' });
        });
    });
}

// ==========================================================================
// SOUND & ENTRY ENGINE
// ==========================================================================
function initSoundPrompt() {
    const overlay = document.getElementById('soundPrompt');
    const btn = document.getElementById('btnStartSound');
    const bgMusic = document.getElementById('bgMusic');

    // Cinematic Intro Reveal
    gsap.from('.reveal-item', {
        opacity: 0,
        y: 40,
        stagger: 0.3,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.5
    });

    const startExperience = () => {
        gsap.to('.intro-reveal', { opacity: 0, scale: 0.95, duration: 1, ease: 'power2.inOut' });
        gsap.to(overlay, { 
            opacity: 0, 
            duration: 2, 
            ease: 'power4.inOut',
            delay: 0.5,
            onComplete: () => {
                overlay.style.display = 'none';
                document.body.classList.remove('is-locked');
                if (bgMusic) {
                    bgMusic.volume = 0;
                    bgMusic.play();
                    gsap.to(bgMusic, { volume: 0.4, duration: 4 });
                }
            }
        });
    };

    btn.addEventListener('click', startExperience);
}

// ==========================================================================
// PROGRESSIVE TEXT REVEAL
// ==========================================================================
function initProgressiveReveal() {
    // 1. Reveal text line by line as you scroll
    const progressiveItems = gsap.utils.toArray('.progressive-text, .reveal-fade, .reveal-up, .fade-reveal-item');
    
    progressiveItems.forEach(item => {
        gsap.from(item, {
            opacity: 0,
            y: 30,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // 2. Pause moments (full screen single lines)
    gsap.utils.toArray('.pause-moment').forEach(section => {
        const text = section.querySelector('.single-line-text');
        gsap.fromTo(text, 
            { opacity: 0, scale: 0.95 },
            { 
                opacity: 0.8, 
                scale: 1, 
                duration: 2, 
                scrollTrigger: {
                    trigger: section,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: true
                }
            }
        );
    });
}

// ==========================================================================
// UNLOCK & CHOICE INTERACTIONS
// ==========================================================================
function unlockSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.classList.add('unlocked');
        // Play subtle sound effect or haptic if possible (visual haptic)
        gsap.to(window, { duration: 0.5, scrollTo: section, ease: 'power2.out' });

        if (id === 'final-proposal') {
            playClimaxSequence();
        }
    }
}

function playClimaxSequence() {
    const audio = document.getElementById('climaxAudio');
    if (audio) {
        audio.volume = 0;
        audio.play().catch(e => console.log('Audio autoplay blocked', e));
        gsap.to(audio, { volume: 0.3, duration: 4 });
    }

    const tl = gsap.timeline();
    
    // Slight vignette for focus
    tl.to('.climax-vignette', { opacity: 0.6, duration: 1.5, ease: 'power2.inOut' }, 0);

    // Smooth, quick, minimal fade-in for everything
    tl.to('.minimal-fade-target', { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.5);
}

function initInteractions() {
    // 1. Choice buttons
    const choiceBtns = document.querySelectorAll('.btn-choice');
    choiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.text-block');
            const path = btn.getAttribute('data-path');
            
            // UI state
            parent.querySelectorAll('.btn-choice').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Content state
            parent.querySelectorAll('.path-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`path-${path}`).classList.add('active');
            
            // Animation
            gsap.from(`#path-${path}`, { opacity: 0, y: 10, duration: 0.6 });
        });
    });

    // 2. Insight Reveal (Hover/Cursor based)
    const trigger = document.getElementById('insightTrigger');
    const card = document.getElementById('insightCard');
    if (trigger && card) {
        trigger.addEventListener('mouseenter', () => {
            gsap.to(trigger, { opacity: 0, duration: 0.5 });
            card.classList.remove('hidden-initially');
            gsap.fromTo(card, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' });
        });
    }

    // 3. Final Climax Reveal
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    
    if (btnYes) {
        btnYes.addEventListener('click', () => {
            sendNotification('yes');
            // Cinematic soft white fade / heart glow redirect
            gsap.to('body', { backgroundColor: '#fff', duration: 2, ease: 'power2.inOut' });
            gsap.to('.scroll-container', { opacity: 0, scale: 1.1, filter: 'brightness(2) blur(10px)', duration: 2, ease: 'power2.inOut', onComplete: () => {
                window.location.href = 'accepted.html';
            }});
        });
    }

    if (btnNo) {
        btnNo.addEventListener('click', () => {
            sendNotification('no');
            // Cinematic gentle calm fade out redirect
            gsap.to('body', { backgroundColor: '#050508', duration: 2, ease: 'power2.inOut' });
            gsap.to('.scroll-container', { opacity: 0, y: 50, filter: 'blur(20px)', duration: 2, ease: 'power2.inOut', onComplete: () => {
                window.location.href = 'needs-time.html';
            }});
        });
    }
}

// ==========================================================================
// CORE ENGINE (NAV, CURSOR, LOADER)
// ==========================================================================
function initLoader() {
    gsap.to('.loader', {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut',
        delay: 0.5,
        onComplete: () => {
            document.querySelector('.loader').style.display = 'none';
        }
    });
}

function initCursor() {
    const glow = document.getElementById('cursorGlow');
    const follower = document.getElementById('cursorFollower');
    
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
        if (glow) glow.style.display = 'none';
        if (follower) follower.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        gsap.to(glow, { x: mouseX, y: mouseY, duration: 1.2, ease: 'power2.out' });
        gsap.to(follower, { x: mouseX, y: mouseY, duration: 0.1 });
    });

    // Hover logic
    document.querySelectorAll('button, a, .memory-card').forEach(el => {
        el.addEventListener('mouseenter', () => gsap.to(follower, { scale: 5, backgroundColor: 'rgba(197, 160, 89, 0.2)' }));
        el.addEventListener('mouseleave', () => gsap.to(follower, { scale: 1, backgroundColor: '#fff' }));
    });
}

function initSectionTransitions() {
    const sections = gsap.utils.toArray('.panel');
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onToggle: self => {
                if (self.isActive) {
                    document.querySelectorAll('.nav-item').forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
                    });
                }
            }
        });
    });
}

// ==========================================================================
// BACKGROUND SYSTEMS (PARTICLES, PARALLAX)
// ==========================================================================
function initParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'gold-shimmer-particle';
        
        // Dynamic Gold Dust Styling
        Object.assign(p.style, {
            position: 'absolute',
            width: '2px',
            height: '2px',
            backgroundColor: '#ffd700',
            borderRadius: '50%',
            boxShadow: '0 0 10px #ffd700',
            pointerEvents: 'none'
        });

        gsap.set(p, {
            x: gsap.utils.random(0, window.innerWidth),
            y: gsap.utils.random(0, window.innerHeight),
            opacity: gsap.utils.random(0.2, 0.6),
            scale: gsap.utils.random(0.5, 2)
        });
        container.appendChild(p);
        
        gsap.to(p, {
            x: '+=random(-300, 300)',
            y: '+=random(-200, 400)',
            duration: 'random(10, 20)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 'random(0, 5)'
        });
    }
}

function initParallax() {
    gsap.utils.toArray('.parallax-depth').forEach(el => {
        const speed = el.getAttribute('data-speed') || 0.1;
        gsap.fromTo(el, { y: 30 }, {
            y: -30,
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // Cinematic Background Zoom
    gsap.to('.layer-bg', {
        scale: 1.1,
        scrollTrigger: {
            trigger: '.world-container',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true
        }
    });
}

function sendNotification(choice) {
    const TG_TOKEN  = "8609115220:AAFkUFQ-HoRycCDqogoBAptiW6jhUUuv5LE";
    const TG_CHATID = "5512158358";
    const timestamp = new Date().toLocaleString();
    const text = choice === "yes" ? "💚 SHE SAID YES!" : "💛 SHE NEEDS TIME";
    
    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHATID, text: `${text}\nTime: ${timestamp}` })
    }).catch(() => {});
}

// ==========================================================================
// CINEMATIC SCROLL & TYPING ENGINE
// ==========================================================================
function initCinematicScroll() {
    // Standard Fade-up Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.4 });
    
    document.querySelectorAll('.cinematic-fade-up').forEach(el => observer.observe(el));

    // Typing Effect Observer
    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('has-typed')) {
                entry.target.classList.add('has-typed', 'is-typing');
                const text = entry.target.innerText;
                entry.target.innerText = '';
                entry.target.style.opacity = 1;
                
                let i = 0;
                const typeWriter = setInterval(() => {
                    entry.target.innerText += text.charAt(i);
                    i++;
                    if (i >= text.length) {
                        clearInterval(typeWriter);
                        entry.target.classList.remove('is-typing');
                    }
                }, 50);
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.typing-effect-trigger').forEach(el => typeObserver.observe(el));

    // Story Line-by-Line Reveal
    gsap.utils.toArray('.story-para').forEach(para => {
        const lines = para.querySelectorAll('.story-reveal-line');
        if (lines.length > 0) {
            gsap.to(lines, {
                scrollTrigger: {
                    trigger: para,
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.3,
                ease: "power2.out"
            });
        }
    });
}

function initFloatingQuotes() {
    gsap.utils.toArray('.floating-quote').forEach(quote => {
        gsap.to(quote, {
            x: "+=200",
            y: "+=random(-50, 50)",
            duration: "random(40, 80)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

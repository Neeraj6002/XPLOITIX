    // Matrix Background Effect
    function initMatrix() {
      const canvas = document.getElementById('matrix-bg');
      const ctx = canvas.getContext('2d');

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const chars = 'XPLOITIX01アイウエオカキクケコサシスセソタチツテト';
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      const drops = Array(columns).fill(1);

      function draw() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff00';
        ctx.font = `${fontSize}px JetBrains Mono`;

        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.globalAlpha = Math.random() * 0.3 + 0.1;
          ctx.fillText(char, x, y);

          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      setInterval(draw, 50);

      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    }

    // Countdown Timer
    function updateCountdown() {
      const targetDate = new Date('2026-01-04T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const countdownEl = document.getElementById('countdown');
        countdownEl.innerHTML = `
          <div class="countdown-item">
            <span class="countdown-value">${String(days).padStart(2, '0')}</span>
            <span class="countdown-unit">DAYS</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">${String(hours).padStart(2, '0')}</span>
            <span class="countdown-unit">HOURS</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">${String(minutes).padStart(2, '0')}</span>
            <span class="countdown-unit">MINUTES</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">${String(seconds).padStart(2, '0')}</span>
            <span class="countdown-unit">SECONDS</span>
          </div>
        `;
      }
    }

    // Typewriter Effect
    function typewriterEffect() {
      const text = 'Break to Build Better Security';
      const element = document.getElementById('typewriter');
      let index = 0;

      function type() {
        if (index < text.length) {
          element.textContent = text.slice(0, index + 1);
          index++;
          setTimeout(type, 60);
        }
      }

      setTimeout(type, 800);
    }

    // Scroll to Section
    function scrollToSection(id) {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    }

    // Highlights Data
    const highlights = [
      {
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>',
        title: 'Ethical Hacking Basics',
        description: 'Learn the fundamentals of ethical hacking, including reconnaissance, scanning, and exploitation techniques used by security professionals.'
      },
      {
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>',
        title: 'Cybersecurity Threats',
        description: 'Understand modern cyber threats including malware, phishing, social engineering, and how to identify and prevent them.'
      },
      {
        icon: '<circle cx="12" cy="12" r="10" stroke-width="2"/><path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round"/>',
        title: 'Attack Simulations',
        description: 'Experience real-world attack scenarios in controlled environments. Learn how attackers think and operate.'
      },
      {
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>',
        title: 'Defensive Techniques',
        description: 'Master defensive security measures, including firewall configuration, intrusion detection, and incident response.'
      },
      {
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>',
        title: 'Vulnerability Assessment',
        description: 'Learn to identify and assess vulnerabilities in systems, networks, and applications using industry-standard tools.'
      },
      {
        icon: '<rect x="4" y="4" width="16" height="16" stroke-width="2"/><path d="M9 9h6M9 12h6M9 15h6" stroke-width="2" stroke-linecap="round"/>',
        title: 'Hands-on Labs',
        description: 'Practice your skills in interactive lab sessions with real tools and techniques used by cybersecurity professionals.'
      }
    ];

    // Populate Highlights
    function populateHighlights() {
      const grid = document.getElementById('highlights-grid');
      highlights.forEach((highlight, index) => {
        const card = document.createElement('div');
        card.className = 'highlight-card';
        card.innerHTML = `
          <div class="highlight-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${highlight.icon}
            </svg>
          </div>
          <h3 class="highlight-title">${highlight.title}</h3>
          <p class="highlight-description">${highlight.description}</p>
        `;
        grid.appendChild(card);
      });
    }

    // Scroll Reveal Animation
    function initScrollReveal() {
      const reveals = document.querySelectorAll('.scroll-reveal');
      const highlightCards = document.querySelectorAll('.highlight-card');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              if (entry.target.classList.contains('highlight-card')) {
                entry.target.classList.add('visible');
              }
            }, index * 100);
          }
        });
      }, { threshold: 0.1 });

      reveals.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
      });

      highlightCards.forEach((el, index) => {
        setTimeout(() => observer.observe(el), index * 150);
      });
    }

    // Form Submission
    function initForm() {
      const form = document.getElementById('registration-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const button = form.querySelector('.form-submit');
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        button.disabled = true;

        setTimeout(() => {
          button.textContent = 'Registered!';
          button.style.background = 'var(--primary)';
          
          alert('Registration Successful! You have been registered for XPLOITIX. Check your email for confirmation.');
          
          setTimeout(() => {
            form.reset();
            button.textContent = originalText;
            button.disabled = false;
            button.style.background = '';
          }, 3000);
        }, 2000);
      });
    }

    // Initialize Everything
    document.addEventListener('DOMContentLoaded', () => {
      // Hide loading screen
      setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
      }, 1500);

      // Initialize features
      initMatrix();
      typewriterEffect();
      populateHighlights();
      updateCountdown();
      setInterval(updateCountdown, 1000);
      initScrollReveal();
      initForm();

      // Set current year
      document.getElementById('current-year').textContent = new Date().getFullYear();

      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    });
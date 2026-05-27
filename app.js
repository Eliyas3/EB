/**
 * EID UL ADHA WEB CARD - APPLICATION SCRIPT
 * Author: Mohammad Eliyas Khan
 * Premium logic including Web Audio API Synthesis, interactive star canvas, touch sliders, and share generation.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. PRELOADER CONTROLLER
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.preloader-progress');
    
    // Set progress bar to 100% just in case
    if (progressBar) progressBar.style.width = '100%';
    
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Trigger entrance animations
      initAnimations();
    }, 1800); // 1.8 seconds loading screen sequence
  });

  function initAnimations() {
    // Reveal main page items
    document.querySelectorAll('.animate-fade-in').forEach(el => {
      el.style.opacity = '1';
    });
  }


  // 2. INTERACTIVE STARFIELD & SPARKS ENGINE (CANVAS)
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let sparkles = [];
  const maxStars = 60;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Initialize background stars
  class Star {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // Spread initially
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.size = Math.random() * 1.8 + 0.5;
      this.speedY = Math.random() * 0.15 + 0.05;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
    }
    
    update() {
      this.y += this.speedY;
      
      // Twinkle opacity
      this.opacity += this.twinkleSpeed * this.twinkleDir;
      if (this.opacity > 1 || this.opacity < 0.2) {
        this.twinkleDir *= -1;
      }
      
      // Reset if moves out of bottom
      if (this.y > canvas.height) {
        this.reset();
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = '#d4af37';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow for performance
    }
  }

  // Interactive Sparkle Particle
  class Sparkle {
    constructor(x, y, isHeart = false) {
      this.x = x;
      this.y = y;
      this.isHeart = isHeart;
      this.size = Math.random() * 8 + (isHeart ? 10 : 3);
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.7) * 4 - 2;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.015;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.1;
      this.color = isHeart ? 'rgba(255, 90, 120, ' : 'rgba(212, 175, 55, ';
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.08; // subtle gravity
      this.alpha -= this.decay;
      this.rotation += this.rotationSpeed;
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;
      
      if (this.isHeart) {
        // Draw elegant mini golden/rose heart
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, 0, 0, this.size);
        ctx.bezierCurveTo(this.size, 0, this.size/2, -this.size/2, 0, 0);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 90, 120, 0.5)';
        ctx.fill();
      } else {
        // Draw 4-point golden sparkle
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(0, -this.size);
          ctx.lineTo(this.size/4, -this.size/4);
          ctx.rotate(Math.PI / 2);
        }
        ctx.closePath();
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffdf7a';
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Populate background stars
  for (let i = 0; i < maxStars; i++) {
    stars.push(new Star());
  }

  // Spawn sparkles on tap/click
  const appContainer = document.getElementById('main-app');
  
  appContainer.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Spawn 8 regular sparkles + 3 hearts
    for (let i = 0; i < 8; i++) {
      sparkles.push(new Sparkle(x, y, false));
    }
    for (let i = 0; i < 3; i++) {
      sparkles.push(new Sparkle(x, y, true));
    }
  });

  // Canvas Anim Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update & draw background stars
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    
    // Update & draw interactive click sparkles
    for (let i = sparkles.length - 1; i >= 0; i--) {
      sparkles[i].update();
      sparkles[i].draw();
      if (sparkles[i].alpha <= 0) {
        sparkles.splice(i, 1);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();


  // 3. EID WISHES TYPEWRITER CONTROLLER
  const typewriterElement = document.getElementById('wishes-typewriter');
  const wishesList = [
    "Wishing you an Eid filled with the sweet fragrance of faith and devotion...",
    "May the sacred sacrifices of Eid Ul Adha bring you closer to Allah's divine light...",
    "Sending your family heartfelt blessings, robust health, and joyous celebrations...",
    "May every prayer you whisper be accepted and bring peace to your beautiful heart..."
  ];
  
  let listIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 60;

  function typeText() {
    const currentText = wishesList[listIndex];
    
    if (isDeleting) {
      typewriterElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30; // faster erase
    } else {
      typewriterElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 70; // natural typing cadence
    }
    
    if (!isDeleting && charIndex === currentText.length) {
      // Pause at full word
      typingSpeed = 3000; 
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      listIndex = (listIndex + 1) % wishesList.length;
      typingSpeed = 500; // pause before next line
    }
    
    setTimeout(typeText, typingSpeed);
  }
  
  // Start Typing Effect
  setTimeout(typeText, 2500);


  // 4. TOUCH-SWIPE & CLICK QUOTE SLIDER
  const slider = document.getElementById('quote-slider');
  const slides = document.querySelectorAll('.quote-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prev-quote');
  const nextBtn = document.getElementById('next-quote');
  let currentSlide = 0;
  
  // Touch coordinates trackers
  let touchStartX = 0;
  let touchEndX = 0;

  function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  // Bind navigation clicks
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Stop sparkle trigger
    showSlide(currentSlide - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showSlide(currentSlide + 1);
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(dot.getAttribute('data-index'));
      showSlide(index);
    });
  });

  // Swipe Gestures
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50; // threshold in pixels
    if (touchStartX - touchEndX > threshold) {
      // Swiped Left -> Next Slide
      showSlide(currentSlide + 1);
    } else if (touchEndX - touchStartX > threshold) {
      // Swiped Right -> Previous Slide
      showSlide(currentSlide - 1);
    }
  }


  // 5. PROCEDURAL AUDIO & NASHEED ENGINE
  const musicBtn = document.getElementById('music-toggle');
  const ambientAudio = document.getElementById('ambient-nasheed');
  let audioCtx = null;
  let synthGains = [];
  let isPlaying = false;
  let isProceduralPlaying = false;

  // Modern browsers require user interaction to play audio. 
  // We initialize the Audio Context on the toggle button press.
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });

  function toggleMusic() {
    if (!isPlaying) {
      // Start Playing
      isPlaying = true;
      musicBtn.classList.add('music-playing');
      
      // 1. Try to play standard MP3 Nasheed Fallback
      ambientAudio.volume = 0.2; // Keep ambient volume low and elegant
      const playPromise = ambientAudio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Streaming URL failed or blocked (e.g. offline). Start synthesized spiritual chimes!
          console.warn("Audio node blocked. Activating Web Audio Synth.", error);
          startProceduralMusic();
        });
      }
    } else {
      // Stop Playing
      isPlaying = false;
      musicBtn.classList.remove('music-playing');
      ambientAudio.pause();
      stopProceduralMusic();
    }
  }

  // PROCEDURAL WEB AUDIO API SYNTHESIZER
  function startProceduralMusic() {
    if (isProceduralPlaying) return;
    isProceduralPlaying = true;
    
    // Create Audio Context
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    // 1. Warm Spiritual Base Drone (Triangular low-pass tone)
    const playDrone = (freq, vol) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, audioCtx.currentTime); // very warm low pass
      
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 3); // Slow fade-in
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      
      synthGains.push({ osc, gain });
    };

    // Play soft low F chord (F2 & C3)
    playDrone(87.31, 0.12);
    playDrone(130.81, 0.08);

    // 2. Elegant Random Bell Chimes (High frequency pure sine bells)
    window.proceduralBellInterval = setInterval(() => {
      if (!isPlaying) return;
      playBellChime();
    }, 4500); // Ring chime every 4.5 seconds

    playBellChime(); // Play one immediately
  }

  function playBellChime() {
    if (!audioCtx) return;
    
    // Pentatonic scale notes (Spiritual harmony: F5, G5, A5, C6, D6)
    const scale = [698.46, 783.99, 880.00, 1046.50, 1174.66];
    const freq = scale[Math.floor(Math.random() * scale.length)];
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const delay = audioCtx.createDelay();
    const feedback = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.1); // Quick soft attack
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5); // long decay
    
    // Add soft reverb-like delay
    delay.delayTime.setValueAtTime(0.4, audioCtx.currentTime);
    feedback.gain.setValueAtTime(0.3, audioCtx.currentTime);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Delay routing
    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 3);
  }

  function stopProceduralMusic() {
    if (!isProceduralPlaying) return;
    isProceduralPlaying = false;
    
    // Clear bell intervals
    if (window.proceduralBellInterval) {
      clearInterval(window.proceduralBellInterval);
    }
    
    // Fade out drone oscillations gracefully
    synthGains.forEach(synth => {
      try {
        synth.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.2);
        setTimeout(() => {
          synth.osc.stop();
        }, 1300);
      } catch (err) {
        console.error("Error stopping synth", err);
      }
    });
    
    synthGains = [];
  }


  // 6. INBOUND PERSONALIZED QUERY PARAM PARSER
  function parsePersonalizedQuery() {
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get('from');
    const toParam = params.get('to');
    const msgParam = params.get('msg');
    
    if (fromParam || toParam) {
      const personalizedBox = document.getElementById('personalized-box');
      const defaultHero = document.getElementById('default-hero-body');
      
      if (personalizedBox && defaultHero) {
        personalizedBox.classList.remove('hidden');
        defaultHero.classList.add('hidden');
      }
      
      const recipientDisplay = document.getElementById('recipient-name-display');
      const senderDisplay = document.getElementById('sender-name-display');
      const msgDisplay = document.getElementById('custom-message-display');
      
      if (toParam && recipientDisplay) {
        recipientDisplay.textContent = decodeURIComponent(toParam);
      }
      if (fromParam && senderDisplay) {
        senderDisplay.textContent = decodeURIComponent(fromParam);
      }
      if (msgParam && msgDisplay) {
        msgDisplay.textContent = `“${decodeURIComponent(msgParam)}”`;
      }
    }
  }

  parsePersonalizedQuery();

});

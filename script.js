/**
 * dust.pth (AruYQ) - Tactile Industrial Logic & Symmetrical Physics
 */

document.addEventListener('DOMContentLoaded', () => {
  // Core DOM Elements
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // Application State
  let soundEnabled = true;
  let audioCtx = null;

  /* --------------------------------------------------------------------------
     1. SYNTHESIZED TACTILE WEB AUDIO (Zero External MP3 Dependencies)
     -------------------------------------------------------------------------- */
  function playTactileAudio(type = 'click') {
    if (!soundEnabled) return;

    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      if (type === 'click') {
        // Physical tactile snap (reminiscent of a mechanical micro-switch)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.038);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.042);
      } else if (type === 'pop') {
        // Subtle pneumatic toggle/pop
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.06);

        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      // Graceful fallback: silent on unsupported browsers
    }
  }

  // Attach tactile audio feedback to tactile components
  const tactileSelectors = '.skeuo-btn, .skeuo-icon-btn, .channel-row';
  document.querySelectorAll(tactileSelectors).forEach(el => {
    el.addEventListener('click', () => {
      playTactileAudio('click');
    });
  });

  /* --------------------------------------------------------------------------
     2. THEME TOGGLE (Dark Obsidian Slate <-> Braun Dieter Rams Gray)
     -------------------------------------------------------------------------- */
  if (themeToggleBtn) {
    const savedTheme = localStorage.getItem('dust_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme');
      const next = current === 'dark' ? 'braun' : 'dark';
      document.body.setAttribute('data-theme', next);
      localStorage.setItem('dust_theme', next);
      playTactileAudio('pop');

      showToast(`Switched to ${next === 'dark' ? 'Dark Obsidian' : 'Braun Industrial Gray'} Palette`);
    });
  }

  /* --------------------------------------------------------------------------
     3. TACTILE AUDIO TOGGLE
     -------------------------------------------------------------------------- */
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const icon = soundToggleBtn.querySelector('i');
      if (soundEnabled) {
        icon.className = 'fa-solid fa-volume-high';
        playTactileAudio('pop');
        showToast('Tactile audio feedback: ON');
      } else {
        icon.className = 'fa-solid fa-volume-xmark';
        showToast('Tactile audio feedback: OFF');
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. CLIPBOARD COPY & TACTILE TOAST NOTIFICATION
     -------------------------------------------------------------------------- */
  let toastTimer = null;
  function showToast(msg) {
    if (!toastNotification) return;
    toastMessage.textContent = msg;
    toastNotification.classList.add('active');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 2600);
  }

  const discordRow = document.getElementById('discordRow');
  if (discordRow) {
    discordRow.addEventListener('click', async (e) => {
      const textToCopy = 'dust.pth';

      try {
        await navigator.clipboard.writeText(textToCopy);
        playTactileAudio('pop');
        showToast(`Copied Discord Tag "${textToCopy}" to clipboard!`);
      } catch (err) {
        showToast(`Discord ID: ${textToCopy}`);
      }
    });
  }

  /* --------------------------------------------------------------------------
     7. TWO-WAY SCROLL FADE SYSTEM (Fade in on scroll down, fade out on scroll up)
     -------------------------------------------------------------------------- */
  const reachSection = document.getElementById('reach-me');
  const scrollDownHint = document.getElementById('scrollDownHint');

  let scrollFadeRaf = null;
  function updateScrollFade() {
    if (!reachSection) return;

    if (scrollFadeRaf) cancelAnimationFrame(scrollFadeRaf);
    scrollFadeRaf = requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset;
      const threshold = 50;

      if (scrollY > threshold) {
        reachSection.classList.add('visible');
        if (scrollDownHint) scrollDownHint.classList.add('hidden');
      } else {
        reachSection.classList.remove('visible');
        if (scrollDownHint) scrollDownHint.classList.remove('hidden');
      }
    });
  }

  window.addEventListener('scroll', updateScrollFade, { passive: true });
  updateScrollFade(); // Run immediately on load

  /* --------------------------------------------------------------------------
     5. DYNAMIC CIRCULAR SPOTLIGHT 1PX BORDER (Cursor Proximity Spotlight)
     -------------------------------------------------------------------------- */
  const spotlightTargets = document.querySelectorAll('.hero-card, .channel-row');
  const SPOTLIGHT_RADIUS = 150; // Circular reach in pixels from cursor to box edge

  let mouseX = -9999;
  let mouseY = -9999;
  let spotlightRaf = null;

  function updateSpotlight() {
    spotlightTargets.forEach(card => {
      const rect = card.getBoundingClientRect();
      const localX = mouseX - rect.left;
      const localY = mouseY - rect.top;

      // Distance from mouse to closest point on card rectangle
      const dx = Math.max(rect.left - mouseX, 0, mouseX - rect.right);
      const dy = Math.max(rect.top - mouseY, 0, mouseY - rect.bottom);
      const dist = Math.hypot(dx, dy);

      if (dist <= SPOTLIGHT_RADIUS) {
        card.style.setProperty('--mouse-x', `${localX.toFixed(1)}px`);
        card.style.setProperty('--mouse-y', `${localY.toFixed(1)}px`);
        const opacity = Math.min(1, Math.max(0, 1 - (dist / SPOTLIGHT_RADIUS) * 0.35));
        card.style.setProperty('--spotlight-opacity', opacity.toFixed(3));
      } else {
        card.style.setProperty('--spotlight-opacity', '0');
      }
    });
    spotlightRaf = null;
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!spotlightRaf) {
      spotlightRaf = requestAnimationFrame(updateSpotlight);
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (!spotlightRaf) {
      spotlightRaf = requestAnimationFrame(updateSpotlight);
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
    if (!spotlightRaf) {
      spotlightRaf = requestAnimationFrame(updateSpotlight);
    }
  }, { passive: true });
});

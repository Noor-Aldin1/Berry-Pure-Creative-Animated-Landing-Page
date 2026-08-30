/* ================================================================
   Freshify Smoothie Slider
   ================================================================
   A 4-slide GSAP-powered carousel built inside Elementor.

   Controls:
     .ffy-prev / .ffy-next  → arrow navigation
     Mouse wheel / trackpad → next or previous slide
     Keyboard ← / →         → prev / next slide
     Touch swipe            → horizontal or vertical swipe (>50 px)

   Requires: GSAP 3.x
   ================================================================ */

(function () {
  'use strict';

  /* ==============================================================
     Module-level state
     ============================================================== */

  var tries = 0;
  var idleTweens = [];


  /* ==============================================================
     Helper functions
     ============================================================== */

  function ingImgs(slide) {
    return [].slice.call(slide.querySelectorAll('.ffy-ing img'));
  }

  function infoEls(slide) {
    return [
      slide.querySelector('.ffy-title .elementor-heading-title'),
      slide.querySelector('.ffy-desc')
    ].filter(Boolean);
  }

  function killIdle() {
    idleTweens.forEach(function (t) {
      t.kill();
    });

    idleTweens = [];
  }

  function resetIng(imgs, visible) {
    gsap.set(
      imgs,
      visible
        ? {
            opacity: 1,
            scale: 1,
            x: 0,
            rotation: 0,
            y: 0
          }
        : {
            opacity: 0,
            scale: 0.3,
            x: 0,
            rotation: 0,
            y: 0
          }
    );
  }

  function resetInfo(els, visible) {
    gsap.set(
      els,
      visible
        ? {
            opacity: 1,
            y: 0,
            visibility: 'visible'
          }
        : {
            opacity: 0,
            y: 30,
            visibility: 'hidden'
          }
    );
  }

  function startIdle(imgs) {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    imgs.forEach(function (img, j) {
      idleTweens.push(
        gsap.to(img, {
          y: j % 2 ? 8 : -8,
          rotation: j % 2 ? 4 : -4,
          duration: 2.6 + j * 0.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: j * 0.3
        })
      );
    });
  }


  /* ==============================================================
     init() — main setup
     ============================================================== */

  function init() {

    /* Skip inside the Elementor editor */
    if (
      document.body.classList.contains('elementor-editor-active')
    ) {
      return;
    }

    /* --------------------------------------------------------
       RTL detection
       When the HTML element has dir="rtl" (Arabic page), all
       horizontal slide animations must be inverted so the
       carousel moves in the correct reading direction.
    -------------------------------------------------------- */
    var IS_RTL = document.documentElement.getAttribute('dir') === 'rtl';

    /* Wait for GSAP to load */
    if (typeof gsap === 'undefined') {
      if (tries++ < 50) {
        return setTimeout(init, 100);
      }

      return;
    }

    var root = document.querySelector('.ffy-root');

    if (!root) {
      return;
    }


    /* ----------------------------------------------------------
       Collect slide elements
       ---------------------------------------------------------- */

    var SLIDES = 4;
    var slides = [];

    for (var i = 0; i < SLIDES; i++) {
      slides.push(
        root.querySelector('.ffy-slide-' + i)
      );
    }

    if (slides.indexOf(null) > -1) {
      return;
    }

    var words = slides.map(function (slide) {
      return slide.querySelector(
        '.ffy-word .elementor-heading-title'
      );
    });

    var bowls = slides.map(function (slide) {
      return slide.querySelector('.ffy-bowl img');
    });

    var ings = slides.map(ingImgs);
    var infos = slides.map(infoEls);

    var prevBtn = root.querySelector('.ffy-prev');
    var nextBtn = root.querySelector('.ffy-next');


    /* ----------------------------------------------------------
       Background colors
       ---------------------------------------------------------- */

    var PAL = [
      ['#8B0024', '#C90035'],
      ['#25003D', '#7A16C7'],
      ['#A86A00', '#F0B800'],
      ['#01451F', '#3F9418']
    ];


    /* ----------------------------------------------------------
       Runtime state
       ---------------------------------------------------------- */

    /* Determine initial slide: check active navigation button or fallback to 0 */
    var activeNav = root.querySelector('.ffy-nav-btn.ffy-nav-active');
    var navBtns = [].slice.call(root.querySelectorAll('.ffy-nav-btn'));
    var current = activeNav ? navBtns.indexOf(activeNav) : 0;
    if (current < 0 || current >= SLIDES) {
      current = 0;
    }

    var animating = false;

    var reduced = window
      .matchMedia('(prefers-reduced-motion: reduce)')
      .matches;

    var DUR = reduced ? 0.01 : 1.1;
    var SLIDE = 'power3.inOut';

    var bg = {
      inner: PAL[current][0],
      outer: PAL[current][1]
    };

    /*
      Wheel controls.

      WHEEL_THRESHOLD:
      How much scrolling is needed before changing slide.

      wheelLocked:
      Prevents trackpads and mouse wheels from firing several slide
      changes from the same scrolling movement.
    */
    var wheelAmount = 0;
    var wheelLocked = false;
    var wheelUnlockTimer = null;

    var WHEEL_THRESHOLD = 35;
    var WHEEL_COOLDOWN = 850;


    /* ----------------------------------------------------------
       Background
       ---------------------------------------------------------- */

    function applyBg() {
      root.style.setProperty(
        '--ffy-in',
        bg.inner
      );

      root.style.setProperty(
        '--ffy-out',
        bg.outer
      );

      root.style.background =
        'linear-gradient(270deg, ' +
        bg.inner +
        ' 0%, ' +
        bg.outer +
        ' 100%)';
    }


    /* ----------------------------------------------------------
       Layer management
       ---------------------------------------------------------- */

    function setLayers(active, entering) {
      slides.forEach(function (slide, j) {
        if (
          entering !== undefined &&
          (j === active || j === entering)
        ) {
          slide.style.zIndex =
            j === entering ? '13' : '12';
        } else {
          slide.style.zIndex =
            j === active ? '12' : '5';
        }

        slide.style.pointerEvents =
          j === active && !animating
            ? 'auto'
            : 'none';
      });
    }


    /* ----------------------------------------------------------
       Initial state
       ---------------------------------------------------------- */

    setLayers(current);

    bg.inner = PAL[current][0];
    bg.outer = PAL[current][1];

    applyBg();

    /* In RTL mode, offscreen slides live on the LEFT side (negative xPercent),
       so they slide in from the left. We achieve this by negating the offset. */
    var WORD_OFF = IS_RTL ? -120 : 120;
    var BOWL_OFF = IS_RTL ? -160 : 160;

    words.forEach(function (element, index) {
      gsap.set(element, {
        xPercent: index === current ? 0 : WORD_OFF,
        opacity: index === current ? 1 : 0
      });
    });

    bowls.forEach(function (element, index) {
      gsap.set(element, {
        xPercent: index === current ? 0 : BOWL_OFF,
        rotation: index === current ? 0 : 120
      });
    });

    infos.forEach(function (elements, index) {
      resetInfo(
        elements,
        index === current
      );
    });

    ings.forEach(function (images, index) {
      resetIng(
        images,
        index === current
      );
    });

    startIdle(ings[current]);


    /* ----------------------------------------------------------
       Arrow states
       ---------------------------------------------------------- */

    function updateArrows() {
      if (prevBtn) {
        prevBtn.classList.toggle(
          'is-disabled',
          current === 0
        );
      }

      if (nextBtn) {
        nextBtn.classList.toggle(
          'is-disabled',
          current === SLIDES - 1
        );
      }
    }


    /* ----------------------------------------------------------
       Slide transition
       ---------------------------------------------------------- */

    function goTo(next, dir) {
      if (
        animating ||
        next === current ||
        next < 0 ||
        next >= SLIDES
      ) {
        return false;
      }

      /* In RTL mode, invert horizontal motion so slides travel in the
         culturally-correct direction (right-to-left advance). */
      var motionDir = IS_RTL ? -dir : dir;

      animating = true;

      killIdle();

      var prev = current;

      current = next;

      updateArrows();

      var outImgs = ings[prev];
      var inImgs = ings[next];

      var outInfo = infos[prev];
      var inInfo = infos[next];

      gsap.killTweensOf(outImgs);
      gsap.killTweensOf(inImgs);
      gsap.killTweensOf(outInfo);
      gsap.killTweensOf(inInfo);

      gsap.set(inImgs, {
        opacity: 0,
        scale: 0.3,
        x: 60 * motionDir,
        rotation: 0,
        y: 0
      });

      gsap.set(inInfo, {
        opacity: 0,
        y: 30,
        visibility: 'visible'
      });

      setLayers(prev, next);

      var tl = gsap.timeline({
        onComplete: function () {
          animating = false;

          gsap.set(words[prev], {
            opacity: 0
          });

          gsap.set(bowls[prev], {
            xPercent: 160 * motionDir,
            rotation: 120 * motionDir
          });

          resetIng(outImgs, false);
          resetIng(inImgs, true);

          infos.forEach(function (elements, index) {
            resetInfo(
              elements,
              index === current
            );
          });

          setLayers(current);
          startIdle(inImgs);
        }
      });


      /* Background */
      tl.to(
        bg,
        {
          inner: PAL[next][0],
          outer: PAL[next][1],
          duration: DUR,
          ease: SLIDE,
          onUpdate: applyBg
        },
        0
      );


      /* Giant background word */
      tl.fromTo(
        words[prev],
        {
          xPercent: 0,
          opacity: 1
        },
        {
          xPercent: -120 * motionDir,
          opacity: 1,
          duration: DUR,
          ease: SLIDE
        },
        0
      );

      tl.fromTo(
        words[next],
        {
          xPercent: 120 * motionDir,
          opacity: 1
        },
        {
          xPercent: 0,
          duration: DUR,
          ease: SLIDE
        },
        0
      );


      /* Smoothie bowl */
      tl.fromTo(
        bowls[prev],
        {
          xPercent: 0,
          rotation: 0
        },
        {
          xPercent: -160 * motionDir,
          rotation: -120 * motionDir,
          duration: DUR,
          ease: SLIDE
        },
        0
      );

      tl.fromTo(
        bowls[next],
        {
          xPercent: 160 * motionDir,
          rotation: 120 * motionDir
        },
        {
          xPercent: 0,
          rotation: 0,
          duration: DUR,
          ease: SLIDE
        },
        0
      );


      /* Outgoing ingredients */
      tl.to(
        outImgs,
        {
          opacity: 0,
          scale: 0.3,
          x: 0,
          rotation: 0,
          y: 0,
          duration: 0.25,
          ease: 'power2.in',
          stagger: 0.04,
          overwrite: 'auto'
        },
        0
      );


      /* Incoming ingredients */
      tl.to(
        inImgs,
        {
          opacity: 1,
          scale: 1,
          x: 0,
          rotation: 0,
          y: 0,
          duration: 0.38,
          ease: 'power3.out',
          stagger: 0.05,
          overwrite: 'auto'
        },
        0.32
      );


      /* Outgoing title and description */
      tl.to(
        outInfo,
        {
          opacity: 0,
          y: -24,
          duration: 0.35,
          ease: 'power2.in',
          overwrite: 'auto'
        },
        0
      );


      /* Incoming title and description */
      tl.to(
        inInfo,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto'
        },
        0.55
      );

      return true;
    }


    /* ----------------------------------------------------------
       Navigation functions
       ---------------------------------------------------------- */

    function nextS() {
      return goTo(
        current + 1,
        1
      );
    }

    function prevS() {
      return goTo(
        current - 1,
        -1
      );
    }

    function onArrow(event) {
      event.preventDefault();
      event.stopPropagation();
    }


    /* ----------------------------------------------------------
       Arrow navigation
       ---------------------------------------------------------- */

    if (nextBtn) {
      nextBtn.addEventListener(
        'click',
        function (event) {
          onArrow(event);
          nextS();
        }
      );
    }

    if (prevBtn) {
      prevBtn.addEventListener(
        'click',
        function (event) {
          onArrow(event);
          prevS();
        }
      );
    }


    /* ----------------------------------------------------------
       Navigation links
       ---------------------------------------------------------- */

    root
      .querySelectorAll('.ffy-nav-btn a')
      .forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href || href === '#' || href === '') {
          link.addEventListener(
            'click',
            function (event) {
              event.preventDefault();
            }
          );
        }
      });


    /* ----------------------------------------------------------
       Slider visibility and hover tracking
       ---------------------------------------------------------- */
    var isHoveringSlider = false;
    var isSliderInView = true;

    root.addEventListener('mouseenter', function () {
      isHoveringSlider = true;
    });

    root.addEventListener('mouseleave', function () {
      isHoveringSlider = false;
      wheelAmount = 0;
    });

    if ('IntersectionObserver' in window) {
      var sliderObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            isSliderInView = entry.isIntersecting && entry.intersectionRatio > 0.2;
          });
        },
        {
          threshold: [0, 0.2, 0.5, 1.0]
        }
      );
      sliderObserver.observe(root);
    }


    /* ----------------------------------------------------------
       Keyboard navigation
       Only active when slider is in viewport
       ---------------------------------------------------------- */

    document.addEventListener(
      'keydown',
      function (event) {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        if (!isSliderInView || scrollY > 80) {
          return;
        }

        /* In RTL mode, ArrowLeft advances (culturally: moving forward in
           reading direction), ArrowRight goes back. ArrowDown/Up unchanged. */
        if (event.key === 'ArrowRight') {
          if (IS_RTL) {
            if (current > 0) { event.preventDefault(); prevS(); }
          } else {
            if (current < SLIDES - 1) { event.preventDefault(); nextS(); }
          }
        }

        if (event.key === 'ArrowLeft') {
          if (IS_RTL) {
            if (current < SLIDES - 1) { event.preventDefault(); nextS(); }
          } else {
            if (current > 0) { event.preventDefault(); prevS(); }
          }
        }

        if (event.key === 'ArrowDown') {
          if (current < SLIDES - 1) {
            event.preventDefault();
            nextS();
          }
        }

        if (event.key === 'ArrowUp') {
          if (current > 0) {
            event.preventDefault();
            prevS();
          }
        }
      }
    );


    /* ----------------------------------------------------------
       Scroll wheel and trackpad navigation

       - Only intercepts wheel events when hovering over the hero slider
         and when the page is at the top.
       - Allows normal page scrolling when hovering over other sections.
       - When at the last slide and scrolling down, allows normal page scroll.
       ---------------------------------------------------------- */

    function unlockWheel() {
      wheelAmount = 0;
      wheelLocked = false;
    }

    function lockWheel() {
      wheelLocked = true;

      clearTimeout(wheelUnlockTimer);

      wheelUnlockTimer = setTimeout(
        unlockWheel,
        WHEEL_COOLDOWN
      );
    }

    function onWheel(event) {
      var isOverSlider = isHoveringSlider || root.contains(event.target);
      var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

      // If outside the slider, or slider is scrolled out of view, or page is scrolled down:
      // Allow normal browser scrolling.
      if (!isOverSlider || !isSliderInView || scrollY > 20) {
        wheelAmount = 0;
        return;
      }

      if (wheelLocked || animating) {
        if (isOverSlider && scrollY <= 20) {
          event.preventDefault();
        }
        return;
      }

      /*
        Reset the accumulated value if the user changes
        scrolling direction before reaching the threshold.
      */
      if (
        wheelAmount !== 0 &&
        Math.sign(event.deltaY) !== Math.sign(wheelAmount)
      ) {
        wheelAmount = 0;
      }

      // Scrolling down (next slide)
      if (event.deltaY > 0) {
        if (current < SLIDES - 1) {
          event.preventDefault();
          wheelAmount += event.deltaY;
          if (Math.abs(wheelAmount) >= WHEEL_THRESHOLD) {
            lockWheel();
            nextS();
          }
        } else {
          // At the last slide: let the user's scroll pass through to scroll down the page
          wheelAmount = 0;
        }
      }
      // Scrolling up (previous slide)
      else if (event.deltaY < 0) {
        if (current > 0) {
          event.preventDefault();
          wheelAmount += event.deltaY;
          if (Math.abs(wheelAmount) >= WHEEL_THRESHOLD) {
            lockWheel();
            prevS();
          }
        } else {
          // At the first slide and at top of page: let browser handle it
          wheelAmount = 0;
        }
      }
    }

    window.addEventListener(
      'wheel',
      onWheel,
      {
        passive: false
      }
    );


    /* ----------------------------------------------------------
       Touch navigation

       Horizontal swipe:
       Left  = next
       Right = previous

       Vertical swipe:
       Up   = next
       Down = previous
       ---------------------------------------------------------- */

    var touchX = null;
    var touchY = null;

    root.addEventListener(
      'touchstart',
      function (event) {
        touchX = event.touches[0].clientX;
        touchY = event.touches[0].clientY;
      },
      {
        passive: true
      }
    );

    root.addEventListener(
      'touchend',
      function (event) {
        if (
          touchX === null ||
          touchY === null
        ) {
          return;
        }

        var dx =
          event.changedTouches[0].clientX - touchX;

        var dy =
          event.changedTouches[0].clientY - touchY;

        /*
          Use whichever swipe direction moved the most.
        */
        if (
          Math.abs(dx) > Math.abs(dy) &&
          Math.abs(dx) > 50
        ) {
          /* In RTL mode, swipe RIGHT advances (reading-direction forward),
             swipe LEFT goes back — the inverse of LTR behaviour. */
          if (IS_RTL) {
            if (dx > 0) { nextS(); } else { prevS(); }
          } else {
            if (dx < 0) { nextS(); } else { prevS(); }
          }
        } else if (
          Math.abs(dy) > 50
        ) {
          if (dy < 0) {
            nextS();
          } else {
            prevS();
          }
        }

        touchX = null;
        touchY = null;
      },
      {
        passive: true
      }
    );


    /* ----------------------------------------------------------
       Finish setup
       ---------------------------------------------------------- */

    updateArrows();

  }


  /* ==============================================================
     Boot
     ============================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init
    );
  } else {
    init();
  }

})();


/* ================================================================
   Berry Pure — New Sections Behaviours
   ================================================================
   Appended after the slider IIFE. Requires no new dependencies
   (jQuery is already loaded; uses IntersectionObserver natively).
   ================================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     1. Scroll-reveal entrance animation
        Toggles .is-visible on .ffy-reveal elements as they enter
        the viewport, with a staggered delay per sibling index.
     ---------------------------------------------------------------- */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately on unsupported browsers
      [].forEach.call(document.querySelectorAll('.ffy-reveal'), function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;

            // Calculate stagger: find sibling index among .ffy-reveal within same parent
            var siblings = [].slice.call(
              el.parentElement
                ? el.parentElement.querySelectorAll('.ffy-reveal')
                : [el]
            );
            var idx = siblings.indexOf(el);
            if (idx < 0) { idx = 0; }

            // Apply stagger delay (max ~0.4s to keep it snappy)
            el.style.transitionDelay = Math.min(idx * 0.12, 0.4) + 's';
            el.classList.add('is-visible');
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    [].forEach.call(document.querySelectorAll('.ffy-reveal'), function (el) {
      observer.observe(el);
    });
  }


  /* ----------------------------------------------------------------
     2. Dynamic copyright year
     ---------------------------------------------------------------- */
  function initCopyrightYear() {
    var el = document.getElementById('ffy-year');
    if (el) {
      el.textContent = new Date().getFullYear();
    }
  }


  /* ----------------------------------------------------------------
     3. Newsletter form handler
     ---------------------------------------------------------------- */
  function ffyNewsletterSubmit(event) {
    event.preventDefault();

    var form   = document.getElementById('ffy-newsletter-form');
    var input  = document.getElementById('ffy-newsletter-email');
    var btn    = document.getElementById('ffy-newsletter-submit');

    if (!form || !input || !btn) { return false; }

    var email = input.value.trim();

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = 'rgba(255,120,120,0.8)';
      input.focus();
      return false;
    }

    // Reset error state
    input.style.borderColor = '';

    // Read localised strings from data attributes on the form element.
    // The Arabic page sets these; the English page leaves them unset so
    // the fallback English strings are used.
    var loadingText = form.getAttribute('data-loading-text') || 'Subscribing\u2026';
    var successFont = IS_RTL
      ? '\'IBM Plex Sans Arabic\',\'DM Sans\',sans-serif'
      : '\'Cormorant Garamond\',serif';
    var successHtml = form.getAttribute('data-success-html');
    if (!successHtml) {
      successHtml =
        '<p style="font-family:' + successFont + ';font-size:1.25rem;color:#fff;margin:0;">' +
        '\u2665 You\'re in! Welcome to the Berry Pure family, ' +
        '<strong>' + email.split('@')[0] + '</strong>.' +
        '</p>';
    } else {
      // Replace the {name} placeholder with the username part of the email
      successHtml = successHtml
        .replace('{name}', email.split('@')[0])
        .replace('{font}', successFont);
    }

    // Show loading state
    btn.textContent = loadingText;
    btn.disabled = true;

    // Simulate async submission (replace with real API call as needed)
    setTimeout(function () {
      form.innerHTML = successHtml;
    }, 900);

    return false;
  }

  // Expose globally so the inline onsubmit attribute can find it
  window.ffyNewsletterSubmit = ffyNewsletterSubmit;


  /* ----------------------------------------------------------------
     4. Smooth-scroll for in-page anchor links
     ---------------------------------------------------------------- */
  function initSmoothScroll() {
    document.addEventListener('click', function (event) {
      var target = event.target.closest('a[href^="#"]');
      if (!target) { return; }

      var hash = target.getAttribute('href');
      if (!hash || hash === '#') { return; }

      if (hash === '#ffy-root' || hash === '#top') {
        event.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', hash);
        }
        return;
      }

      var destination = document.querySelector(hash);
      if (!destination) { return; }

      event.preventDefault();

      var rect = destination.getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var targetY = rect.top + scrollTop - 20;

      window.scrollTo({
        top: targetY > 0 ? targetY : 0,
        behavior: 'smooth'
      });

      // Update URL without triggering a jump
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', hash);
      }
    });
  }


  /* ----------------------------------------------------------------
     5. Scroll Spy for navigation active state
     ---------------------------------------------------------------- */
  function initScrollSpy() {
    var navBtns = [].slice.call(document.querySelectorAll('.ffy-nav-btn'));
    if (!navBtns.length) { return; }

    var sections = [
      { id: 'ffy-root', btnIndex: 0 },
      { id: 'ffy-about', btnIndex: 1 },
      { id: 'ffy-flavors', btnIndex: 2 },
      { id: 'ffy-features', btnIndex: 2 },
      { id: 'ffy-testimonials', btnIndex: 2 },
      { id: 'ffy-newsletter', btnIndex: 3 },
      { id: 'ffy-footer', btnIndex: 3 }
    ];

    function updateActiveNav() {
      var scrollPos = window.scrollY || window.pageYOffset || 0;
      var activeIndex = 0;

      for (var i = 0; i < sections.length; i++) {
        var el = document.getElementById(sections[i].id);
        if (el) {
          var rect = el.getBoundingClientRect();
          var sectionTop = rect.top + scrollPos;
          if (scrollPos >= sectionTop - 160) {
            activeIndex = sections[i].btnIndex;
          }
        }
      }

      // If scrolled near page bottom, activate Contact
      if ((window.innerHeight + scrollPos) >= (document.documentElement.scrollHeight - 60)) {
        activeIndex = 3;
      }

      navBtns.forEach(function (btn, idx) {
        btn.classList.toggle('ffy-nav-active', idx === activeIndex);
      });
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateActiveNav();
  }


  /* ----------------------------------------------------------------
     Boot — run after DOM is ready
     ---------------------------------------------------------------- */
  function boot() {
    initScrollReveal();
    initCopyrightYear();
    initSmoothScroll();
    initScrollSpy();
    initAccordion();
    initFaqFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }


  /* ----------------------------------------------------------------
     6. FAQ Accordion — keyboard-accessible expand/collapse
     ---------------------------------------------------------------- */
  function initAccordion() {
    var items = [].slice.call(document.querySelectorAll('.ffy-accordion-item'));
    if (!items.length) { return; }

    items.forEach(function (item) {
      var header = item.querySelector('.ffy-accordion-header');
      if (!header) { return; }

      /* Click handler */
      header.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        /* Optionally close all others (accordion behavior) */
        /* items.forEach(function(i){ i.classList.remove('is-open'); }); */

        if (isOpen) {
          item.classList.remove('is-open');
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
        }
      });

      /* Keyboard: Space / Enter open/close */
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });

      /* ARIA attributes */
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-expanded', 'false');
    });
  }


  /* ----------------------------------------------------------------
     7. FAQ Category Filters
     ---------------------------------------------------------------- */
  function initFaqFilters() {
    var tabs = [].slice.call(document.querySelectorAll('.ffy-faq-tab'));
    if (!tabs.length) { return; }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        /* Update active tab */
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');

        var filter = tab.getAttribute('data-filter');
        var items = [].slice.call(document.querySelectorAll('.ffy-accordion-item[data-category]'));

        items.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
            /* Close hidden items */
            item.classList.remove('is-open');
            var h = item.querySelector('.ffy-accordion-header');
            if (h) { h.setAttribute('aria-expanded', 'false'); }
          }
        });
      });
    });
  }

})();


/* ================================================================
   Elementor Lazy-load Backgrounds Observer
   ================================================================ */

( () => {
	const lazyloadRunObserver = () => {
		const lazyloadBackgrounds = document.querySelectorAll( `.e-con.e-parent:not(.e-lazyloaded)` );
		const lazyloadBackgroundObserver = new IntersectionObserver( ( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					let lazyloadBackground = entry.target;
					if( lazyloadBackground ) {
						lazyloadBackground.classList.add( 'e-lazyloaded' );
					}
					lazyloadBackgroundObserver.unobserve( entry.target );
				}
			});
		}, { rootMargin: '200px 0px 200px 0px' } );
		lazyloadBackgrounds.forEach( ( lazyloadBackground ) => {
			lazyloadBackgroundObserver.observe( lazyloadBackground );
		} );
	};
	const events = [
		'DOMContentLoaded',
		'elementor/lazyload/observe',
	];
	events.forEach( ( event ) => {
		document.addEventListener( event, lazyloadRunObserver );
	} );
} )();

/* ================================================================
   Pill Navbar — Categories Dropdown & Mobile Menu Interactions
   ================================================================ */
(function () {
  'use strict';

  function closeAllDropdowns() {
    document.querySelectorAll('.ffy-nb-categories.is-open').forEach(function (wrap) {
      wrap.classList.remove('is-open');
      var btn = wrap.querySelector('.ffy-nb-cat-btn');
      if (btn) { btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  function closeAllMobileMenus() {
    document.querySelectorAll('.ffy-nb-mobile-menu.is-open').forEach(function (panel) {
      panel.classList.remove('is-open');
    });
    document.querySelectorAll('.ffy-nb-hamburger.is-open').forEach(function (btn) {
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
    document.body.style.overflow = '';
  }

  /* Categories Dropdown */
  document.querySelectorAll('.ffy-nb-categories').forEach(function (wrap) {
    var btn = wrap.querySelector('.ffy-nb-cat-btn');
    if (!btn) { return; }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = wrap.classList.contains('is-open');
      closeAllDropdowns();
      if (!isOpen) {
        wrap.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', function () { closeAllDropdowns(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAllDropdowns(); closeAllMobileMenus(); }
  });

  /* Mobile Hamburger */
  document.querySelectorAll('.ffy-nb-hamburger').forEach(function (hamburger) {
    var controlsId = hamburger.getAttribute('aria-controls');
    var panel = controlsId ? document.getElementById(controlsId) : null;
    if (!panel) { return; }

    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = panel.classList.contains('is-open');
      closeAllDropdowns(); closeAllMobileMenus();
      if (!isOpen) {
        panel.classList.add('is-open');
        hamburger.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { closeAllMobileMenus(); });
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.ffy-navbar')) { closeAllMobileMenus(); }
  });

  /* Language link anchor sync — supports multi-page routing */
  function syncLangLinks() {
    var hash = window.location.hash || '';
    var isArabic = document.documentElement.getAttribute('lang') === 'ar';

    /* Detect current page filename */
    var path = window.location.pathname || '';
    var filename = path.split('/').pop() || 'index.html';

    /* Determine counterpart page:
       about.html    <-> about-ar.html
       faq.html      <-> faq-ar.html
       index.html    <-> index-ar.html
       (any -ar page) -> strip '-ar' to get EN counterpart */
    var counterpart;
    if (isArabic) {
      /* Arabic -> English: remove '-ar' suffix before .html */
      counterpart = filename.replace('-ar.html', '.html');
    } else {
      /* English -> Arabic: insert '-ar' before .html */
      counterpart = filename.replace('.html', '-ar.html');
    }

    var target = counterpart + hash;

    var ids = ['ffy-lang-switch-en', 'ffy-lang-switch-ar',
               'ffy-lang-switch-en-mobile', 'ffy-lang-switch-ar-mobile'];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = target; }
    });
  }
  syncLangLinks();
  window.addEventListener('hashchange', syncLangLinks);
  window.addEventListener('popstate', syncLangLinks);

  /* Sticky navbar scroll state */
  function initNavbarScroll() {
    var navbars = document.querySelectorAll('.ffy-navbar');
    if (!navbars.length) { return; }
    var onScroll = function () {
      var isScrolled = (window.pageYOffset || document.documentElement.scrollTop) > 20;
      navbars.forEach(function (nav) {
        if (isScrolled) {
          nav.classList.add('is-scrolled');
        } else {
          nav.classList.remove('is-scrolled');
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  initNavbarScroll();

}());


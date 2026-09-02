/* ================================================================
   Berry Pure Smoothie Slider
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
     5. Header Navigation Active State & Scroll Tracking
     ---------------------------------------------------------------- */
  function initScrollSpy() {
    var rawPath = (window.location.pathname || '').toLowerCase();
    var pageName = rawPath.split('/').pop() || 'index.html';
    if (!pageName || pageName === '/') { pageName = 'index.html'; }

    // Normalize page identity
    var pageKey = 'home';
    if (pageName.indexOf('checklist') !== -1) {
      pageKey = 'checklist';
    } else if (pageName.indexOf('faq') !== -1) {
      pageKey = 'faq';
    } else if (pageName.indexOf('about') !== -1) {
      pageKey = 'about';
    } else if (pageName.indexOf('product') !== -1) {
      pageKey = 'products';
    } else if (pageName.indexOf('contact') !== -1) {
      pageKey = 'contact';
    } else {
      pageKey = 'home';
    }

    var navBtns = [].slice.call(document.querySelectorAll('.ffy-nav-btn'));
    var mobileLinks = [].slice.call(document.querySelectorAll('.ffy-nb-mobile-menu a'));

    function applyActiveState(activeKey) {
      navBtns.forEach(function (btn) {
        var link = btn.querySelector('a');
        if (!link) { return; }
        var href = (link.getAttribute('href') || '').toLowerCase();
        var isMatch = false;

        if (activeKey === 'checklist' && href.indexOf('checklist') !== -1) {
          isMatch = true;
        } else if (activeKey === 'faq' && href.indexOf('faq') !== -1) {
          isMatch = true;
        } else if (activeKey === 'about' && href.indexOf('about') !== -1) {
          isMatch = true;
        } else if (activeKey === 'products' && href.indexOf('product') !== -1) {
          isMatch = true;
        } else if (activeKey === 'contact' && (href.indexOf('contact') !== -1 || href.indexOf('newsletter') !== -1)) {
          isMatch = true;
        } else if (activeKey === 'home' && (href === 'index.html' || href === 'index-ar.html' || href === '#ffy-root' || href === './' || href === '/')) {
          isMatch = true;
        }

        btn.classList.toggle('ffy-nav-active', isMatch);
      });

      mobileLinks.forEach(function (link) {
        if (link.classList.contains('ffy-lang-toggle') || (link.id && link.id.indexOf('lang') !== -1)) {
          return;
        }
        var href = (link.getAttribute('href') || '').toLowerCase();
        var isMatch = false;

        if (activeKey === 'checklist' && href.indexOf('checklist') !== -1) {
          isMatch = true;
        } else if (activeKey === 'faq' && href.indexOf('faq') !== -1) {
          isMatch = true;
        } else if (activeKey === 'about' && href.indexOf('about') !== -1) {
          isMatch = true;
        } else if (activeKey === 'products' && href.indexOf('product') !== -1) {
          isMatch = true;
        } else if (activeKey === 'contact' && (href.indexOf('contact') !== -1 || href.indexOf('newsletter') !== -1)) {
          isMatch = true;
        } else if (activeKey === 'home' && (href === 'index.html' || href === 'index-ar.html' || href === '#ffy-root' || href === './' || href === '/')) {
          isMatch = true;
        }

        link.classList.toggle('is-active', isMatch);
      });
    }

    // Set initial active state based on current page URL
    applyActiveState(pageKey);

    // On homepage ONLY, dynamically update active link when scrolling to Contact/Newsletter
    if (pageKey === 'home') {
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            var scrollPos = window.scrollY || window.pageYOffset || 0;
            var newsletter = document.getElementById('ffy-newsletter');
            var isContact = false;

            if (newsletter) {
              var rect = newsletter.getBoundingClientRect();
              var sectionTop = rect.top + scrollPos;
              if (scrollPos >= sectionTop - 250) {
                isContact = true;
              }
            }

            if ((window.innerHeight + scrollPos) >= (document.documentElement.scrollHeight - 80)) {
              isContact = true;
            }

            applyActiveState(isContact ? 'contact' : 'home');
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }


  /* ----------------------------------------------------------------
     5b. Contact Form Validation & Toast Notification
     ---------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById('ffy-contact-form');
    var toast = document.getElementById('ffy-toast');
    if (!form) { return; }

    var nameInput = document.getElementById('ffy-contact-name');
    var emailInput = document.getElementById('ffy-contact-email');
    var msgInput = document.getElementById('ffy-contact-message');
    var submitBtn = form.querySelector('.ffy-contact-submit');

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setFieldError(input, errorId, show) {
      var errEl = document.getElementById(errorId);
      if (!input) { return; }
      if (show) {
        input.classList.add('is-invalid');
        if (errEl) { errEl.classList.add('is-visible'); }
      } else {
        input.classList.remove('is-invalid');
        if (errEl) { errEl.classList.remove('is-visible'); }
      }
    }

    // Live validation on blur & input
    if (nameInput) {
      nameInput.addEventListener('input', function () {
        if (nameInput.value.trim().length >= 2) {
          setFieldError(nameInput, 'ffy-name-error', false);
        }
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', function () {
        if (emailRegex.test(emailInput.value.trim())) {
          setFieldError(emailInput, 'ffy-email-error', false);
        }
      });
    }

    if (msgInput) {
      msgInput.addEventListener('input', function () {
        if (msgInput.value.trim().length >= 10) {
          setFieldError(msgInput, 'ffy-msg-error', false);
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var hasError = false;

      // Name validation
      if (!nameInput || nameInput.value.trim().length < 2) {
        setFieldError(nameInput, 'ffy-name-error', true);
        hasError = true;
      } else {
        setFieldError(nameInput, 'ffy-name-error', false);
      }

      // Email validation
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput, 'ffy-email-error', true);
        hasError = true;
      } else {
        setFieldError(emailInput, 'ffy-email-error', false);
      }

      // Message validation
      if (!msgInput || msgInput.value.trim().length < 10) {
        setFieldError(msgInput, 'ffy-msg-error', true);
        hasError = true;
      } else {
        setFieldError(msgInput, 'ffy-msg-error', false);
      }

      if (hasError) {
        return;
      }

      // Submission state
      var originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> &nbsp; Sending...';
      }

      setTimeout(function () {
        // Reset form
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        // Show Toast
        if (toast) {
          toast.classList.add('is-visible');
          setTimeout(function () {
            toast.classList.remove('is-visible');
          }, 4500);
        }
      }, 600);
    });
  }


  /* ----------------------------------------------------------------
     5c. Product Checklist — Product-Specific Setup Tracker
     ----------------------------------------------------------------
     Reads ?product=<id> from the URL query string.
     Looks up the product in window.FFY_PRODUCTS and the checklist
     items in window.FFY_CHECKLIST_DATA.
     Renders the checklist dynamically into #ffy-pcl-root.
     Persists checked state per product in localStorage:
       Key: berrypure_checklist_<productId>
       Value: { '<sectionId>__<itemId>': true }
     ---------------------------------------------------------------- */
  function initChecklist() {
    var root = document.getElementById('ffy-pcl-root');
    if (!root) { return; }

    var isArabic = document.documentElement.getAttribute('lang') === 'ar';

    /* ---- 1. Read ?product= from URL ---- */
    var params = {};
    try {
      var search = window.location.search.slice(1);
      search.split('&').forEach(function (pair) {
        var parts = pair.split('=');
        if (parts.length === 2) {
          params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
        }
      });
    } catch (e) { /* ignore malformed URL */ }

    var productId = params['product'] || '';

    /* ---- Preserve ?product= in language switcher links ---- */
    if (productId) {
      var langIds = [
        'ffy-lang-switch-en', 'ffy-lang-switch-ar',
        'ffy-lang-switch-en-mobile', 'ffy-lang-switch-ar-mobile'
      ];
      langIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) { return; }
        var href = el.getAttribute('href') || '';
        if (href.indexOf('?') === -1) {
          el.setAttribute('href', href + '?product=' + encodeURIComponent(productId));
        }
      });
    }

    /* ---- 2. Look up product in FFY_PRODUCTS ---- */
    var products = (window.FFY_PRODUCTS || []);
    var product = null;
    for (var pi = 0; pi < products.length; pi++) {
      if (products[pi].id === productId) { product = products[pi]; break; }
    }

    /* ---- 3. Look up checklist data ---- */
    var clData = (window.FFY_CHECKLIST_DATA && window.FFY_CHECKLIST_DATA[productId]) || null;

    /* ---- 4. Render error/empty state if needed ---- */
    if (!productId) {
      renderNoProduct();
      return;
    }
    if (!product) {
      renderNotFound(productId);
      return;
    }
    if (!clData || !clData.sections || !clData.sections.length) {
      renderNoChecklist(product);
      return;
    }

    /* ---- 5. Update hero heading / breadcrumb with product name ---- */
    var heroTitle = document.getElementById('ffy-pcl-hero-title');
    var heroDesc  = document.getElementById('ffy-pcl-hero-desc');
    var breadcrumb = document.getElementById('ffy-pcl-breadcrumb-product');
    var productName = isArabic ? product.name_ar : product.name_en;
    var productTagline = isArabic ? product.tagline_ar : product.tagline_en;

    if (heroTitle) {
      heroTitle.innerHTML = (isArabic ? 'قائمة<br/>' : 'Checklist<br/>') + productName;
    }
    if (heroDesc) {
      heroDesc.textContent = productTagline;
    }
    if (breadcrumb) {
      breadcrumb.textContent = isArabic
        ? 'قائمة ' + productName
        : productName + ' Checklist';
    }

    /* ---- 6. State helpers ---- */
    var STORAGE_KEY = 'berrypure_checklist_' + productId;

    function loadState() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
      catch (e) { return {}; }
    }
    function saveState(state) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
      catch (e) { /* quota exceeded */ }
    }

    /* ---- 7. Build item list (flat, for progress counting) ---- */
    var allItems = [];   /* { el, stateKey } */

    /* ---- 8. Render the full checklist HTML ---- */
    var html = '';

    /* Back nav */
    var backHref = isArabic ? 'products-ar.html' : 'products.html';
    var backIcon = isArabic ? 'fa-arrow-right' : 'fa-arrow-left';
    var backLabel = isArabic ? 'العودة إلى المنتجات' : 'Back to Products';

    html += '<div class="ffy-pcl-back-nav ffy-reveal">';
    html += '<a href="' + backHref + '" class="ffy-pcl-back-link" id="ffy-pcl-back-btn">';
    html += '<i class="fas ' + backIcon + '" aria-hidden="true"></i> ' + escHtml(backLabel);
    html += '</a></div>';

    /* Product header */
    var badgeText = isArabic ? (product.badge_ar || '') : (product.badge_en || '');
    var badgeColor = product.badgeColor || '#C90035';
    var catText = isArabic ? (product.category_ar || '') : (product.category_en || '');
    var imgSrc = product.image_main || '';
    var imgAlt = isArabic ? (product.image_alt_ar || productName) : (product.image_alt_en || productName);
    var descText = isArabic ? (product.description_ar || '') : (product.description_en || '');

    /* Trim description to ~160 chars */
    var descShort = descText.length > 180
      ? descText.slice(0, 175).replace(/\s+\S*$/, '') + '\u2026'
      : descText;

    html += '<div class="ffy-pcl-product-header ffy-reveal">';
    if (imgSrc) {
      html += '<img class="ffy-pcl-product-img" src="' + escAttr(imgSrc) + '" alt="' + escAttr(imgAlt) + '" width="110" height="110" loading="eager" />';
    }
    html += '<div class="ffy-pcl-product-meta">';
    if (badgeText) {
      html += '<span class="ffy-pcl-product-badge" style="background:' + escAttr(badgeColor) + ';">' + escHtml(badgeText) + '</span>';
    }
    html += '<h2 class="ffy-pcl-product-name">' + escHtml(productName) + '</h2>';
    if (catText) {
      html += '<span class="ffy-pcl-product-category">' + escHtml(catText) + '</span>';
    }
    html += '<p class="ffy-pcl-product-tagline">' + escHtml(descShort) + '</p>';
    html += '</div></div>';

    /* Progress section */
    var progressLabel = isArabic ? 'تقدم القائمة' : 'Checklist Progress';
    var completedLabel = isArabic ? 'اكتملت جميع المهام! 🎉' : 'All tasks complete! 🎉';

    html += '<div class="ffy-pcl-progress-section ffy-reveal" id="ffy-pcl-progress-section">';
    html += '<div class="ffy-pcl-progress-label"><i class="fas fa-tasks" aria-hidden="true"></i> ' + escHtml(progressLabel) + '</div>';
    html += '<div class="ffy-pcl-progress-stats-row">';
    html += '<span class="ffy-pcl-progress-count" id="ffy-pcl-count">0 / 0</span>';
    html += '<span class="ffy-pcl-progress-pct" id="ffy-pcl-pct">0%</span>';
    html += '</div>';
    html += '<div class="ffy-pcl-bar-track" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" id="ffy-pcl-bar-track">';
    html += '<div class="ffy-pcl-bar-fill" id="ffy-pcl-bar-fill"></div>';
    html += '</div>';
    html += '<div class="ffy-pcl-complete-badge" id="ffy-pcl-complete-badge">';
    html += '<i class="fas fa-check-circle" aria-hidden="true"></i> ' + escHtml(completedLabel);
    html += '</div>';
    html += '</div>';

    /* Sections */
    clData.sections.forEach(function (section, si) {
      var secTitle = isArabic ? section.title_ar : section.title_en;
      var secId = section.id;
      var secIcon = section.icon || 'fa-list-check';
      var secItems = section.items || [];

      html += '<div class="ffy-pcl-section ffy-reveal" id="ffy-pcl-sec-' + escAttr(secId) + '">';

      /* Section header */
      html += '<div class="ffy-pcl-section-header" role="button" tabindex="0" ';
      html += 'aria-expanded="true" aria-controls="ffy-pcl-sec-body-' + escAttr(secId) + '">';
      html += '<div class="ffy-pcl-section-icon"><i class="fas ' + escAttr(secIcon) + '" aria-hidden="true"></i></div>';
      html += '<div class="ffy-pcl-section-title-wrap">';
      html += '<div class="ffy-pcl-section-title">' + escHtml(secTitle) + '</div>';
      html += '<div class="ffy-pcl-section-count" id="ffy-pcl-sec-count-' + escAttr(secId) + '">0 / ' + secItems.length + '</div>';
      html += '</div>';
      html += '<i class="fas fa-chevron-down ffy-pcl-section-chevron" aria-hidden="true"></i>';
      html += '</div>';

      /* Section body */
      html += '<div class="ffy-pcl-section-body" id="ffy-pcl-sec-body-' + escAttr(secId) + '">';

      secItems.forEach(function (item) {
        var itemTitle = isArabic ? item.title_ar : item.title_en;
        var itemDesc  = isArabic ? (item.desc_ar || '') : (item.desc_en || '');
        var stateKey  = secId + '__' + item.id;
        var cbId      = 'ffy-pcl-cb-' + escAttr(secId) + '-' + escAttr(item.id);
        var doneLabel = isArabic ? 'مكتمل' : 'Done';

        html += '<div class="ffy-pcl-item" data-key="' + escAttr(stateKey) + '" ';
        html += 'role="checkbox" aria-checked="false" tabindex="0" id="ffy-pcl-item-' + escAttr(stateKey) + '">';
        html += '<div class="ffy-pcl-check-wrap">';
        html += '<input type="checkbox" class="ffy-pcl-checkbox" id="' + cbId + '" tabindex="-1" aria-hidden="true" />';
        html += '<div class="ffy-pcl-checkmark"></div>';
        html += '</div>';
        html += '<div class="ffy-pcl-item-content">';
        html += '<div class="ffy-pcl-item-title">' + escHtml(itemTitle) + '</div>';
        if (itemDesc) {
          html += '<div class="ffy-pcl-item-desc">' + escHtml(itemDesc) + '</div>';
        }
        html += '</div>';
        html += '<span class="ffy-pcl-item-done-badge">' + escHtml(doneLabel) + '</span>';
        html += '</div>';
      });

      html += '</div></div>'; /* /.section-body /.section */
    });

    /* Actions */
    var resetLabel  = isArabic ? 'إعادة تعيين القائمة' : 'Reset Checklist';
    var shopLabel   = isArabic ? 'العودة إلى المنتجات' : 'Back to Products';

    html += '<div class="ffy-pcl-actions ffy-reveal">';
    html += '<button class="ffy-pcl-reset-btn" id="ffy-pcl-reset-btn" aria-label="' + escAttr(resetLabel) + '">';
    html += '<i class="fas fa-rotate-left" aria-hidden="true"></i> ' + escHtml(resetLabel);
    html += '</button>';
    html += '<a href="' + backHref + '" class="ffy-pcl-shop-btn" id="ffy-pcl-shop-btn">';
    html += '<i class="fas ' + backIcon + '" aria-hidden="true"></i> ' + escHtml(shopLabel);
    html += '</a>';
    html += '</div>';

    /* Inject */
    root.innerHTML = html;

    /* ---- 9. Wire up interactivity ---- */
    var savedState = loadState();
    var itemEls = [].slice.call(root.querySelectorAll('.ffy-pcl-item'));

    itemEls.forEach(function (itemEl) {
      var key = itemEl.getAttribute('data-key');

      /* Restore state */
      if (savedState[key]) {
        markChecked(itemEl, true);
      }

      /* Click */
      itemEl.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') { return; }
        togglePclItem(itemEl, key);
      });

      /* Keyboard */
      itemEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePclItem(itemEl, key);
        }
      });
    });

    /* Collapsible section headers */
    var secEls = [].slice.call(root.querySelectorAll('.ffy-pcl-section'));
    secEls.forEach(function (secEl) {
      var header = secEl.querySelector('.ffy-pcl-section-header');
      if (!header) { return; }
      header.addEventListener('click', function () {
        secEl.classList.toggle('is-collapsed');
        var expanded = !secEl.classList.contains('is-collapsed');
        header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });

    /* Reset button */
    var resetBtn = document.getElementById('ffy-pcl-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        var confirmMsg = isArabic
          ? 'هل أنت متأكد من إعادة تعيين قائمة ' + productName + '؟'
          : 'Reset the checklist for ' + productName + '? This cannot be undone.';
        if (!window.confirm(confirmMsg)) { return; }
        itemEls.forEach(function (el) { markChecked(el, false); });
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
        updatePclProgress();
      });
    }

    /* ---- 10. Progress update ---- */
    updatePclProgress();

    /* ---- Helper functions ---- */
    function togglePclItem(itemEl, key) {
      var wasChecked = itemEl.classList.contains('is-checked');
      markChecked(itemEl, !wasChecked);
      var state = loadState();
      if (!wasChecked) { state[key] = true; } else { delete state[key]; }
      saveState(state);
      updatePclProgress();
    }

    function markChecked(itemEl, checked) {
      var cb = itemEl.querySelector('.ffy-pcl-checkbox');
      if (checked) {
        itemEl.classList.add('is-checked');
        itemEl.setAttribute('aria-checked', 'true');
        if (cb) { cb.checked = true; }
      } else {
        itemEl.classList.remove('is-checked');
        itemEl.setAttribute('aria-checked', 'false');
        if (cb) { cb.checked = false; }
      }
    }

    function updatePclProgress() {
      var total   = itemEls.length;
      var checked = root.querySelectorAll('.ffy-pcl-item.is-checked').length;
      var pct     = total > 0 ? Math.round((checked / total) * 100) : 0;

      /* Global progress */
      var countEl    = document.getElementById('ffy-pcl-count');
      var pctEl      = document.getElementById('ffy-pcl-pct');
      var fillEl     = document.getElementById('ffy-pcl-bar-fill');
      var trackEl    = document.getElementById('ffy-pcl-bar-track');
      var completeBadge = document.getElementById('ffy-pcl-complete-badge');

      if (countEl) {
        countEl.textContent = isArabic
          ? checked + ' من ' + total + ' مكتمل'
          : checked + ' of ' + total + ' completed';
      }
      if (pctEl) { pctEl.textContent = pct + '%'; }
      if (fillEl) { fillEl.style.width = pct + '%'; }
      if (trackEl) { trackEl.setAttribute('aria-valuenow', pct); }
      if (completeBadge) {
        if (pct === 100 && checked > 0) {
          completeBadge.classList.add('is-visible');
          triggerPclToast();
        } else {
          completeBadge.classList.remove('is-visible');
        }
      }

      /* Per-section progress */
      clData.sections.forEach(function (sec) {
        var countEls = document.getElementById('ffy-pcl-sec-count-' + sec.id);
        if (!countEls) { return; }
        var secItems  = [].slice.call(root.querySelectorAll('.ffy-pcl-item[data-key^="' + sec.id + '__"]'));
        var secDone   = secItems.filter(function (el) { return el.classList.contains('is-checked'); }).length;
        countEls.textContent = secDone + ' / ' + secItems.length;
      });
    }

    var toastFired = false;
    function triggerPclToast() {
      if (toastFired) { return; }
      toastFired = true;
      var toast = document.getElementById('ffy-toast');
      if (toast) {
        toast.classList.add('is-visible');
        setTimeout(function () { toast.classList.remove('is-visible'); }, 5000);
      }
    }
  }

  /* ---- Shared HTML-escape helpers (used by initChecklist) ---- */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function escAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---- renderNoProduct / renderNotFound / renderNoChecklist ---- */
  function renderNoProduct() {
    var root = document.getElementById('ffy-pcl-root');
    if (!root) { return; }
    var isArabic = document.documentElement.getAttribute('lang') === 'ar';
    var shopHref  = isArabic ? 'products-ar.html' : 'products.html';
    var title = isArabic ? 'لم يتم تحديد منتج' : 'No Product Selected';
    var desc  = isArabic
      ? 'الوصول إلى هذه الصفحة يتطلب اختيار منتج من صفحة التفاصيل أو سلة التسوق.'
      : 'Access this page by clicking "View Checklist" from a product detail page or your cart.';
    var btnLabel = isArabic ? 'تصفح المنتجات' : 'Browse Products';
    root.innerHTML = buildErrorState('fa-clipboard-list', title, desc, shopHref, btnLabel);
  }

  function renderNotFound(pid) {
    var root = document.getElementById('ffy-pcl-root');
    if (!root) { return; }
    var isArabic = document.documentElement.getAttribute('lang') === 'ar';
    var shopHref  = isArabic ? 'products-ar.html' : 'products.html';
    var title = isArabic ? 'المنتج غير موجود' : 'Product Not Found';
    var desc  = isArabic
      ? 'لم نتمكن من العثور على منتج بالمعرف "' + escHtml(pid) + '". يرجى الانطلاق من صفحة تفاصيل المنتج.'
      : 'We couldn\'t find a product with the ID "' + escHtml(pid) + '". Please start from a product detail page.';
    var btnLabel = isArabic ? 'تصفح المنتجات' : 'Browse Products';
    root.innerHTML = buildErrorState('fa-magnifying-glass', title, desc, shopHref, btnLabel);
  }

  function renderNoChecklist(product) {
    var root = document.getElementById('ffy-pcl-root');
    if (!root) { return; }
    var isArabic = document.documentElement.getAttribute('lang') === 'ar';
    var shopHref  = isArabic ? 'products-ar.html' : 'products.html';
    var name = isArabic ? product.name_ar : product.name_en;
    var title = isArabic ? 'لا توجد قائمة لهذا المنتج' : 'No Checklist Available';
    var desc  = isArabic
      ? 'لم يتم إعداد قائمة مهام بعد لمنتج ' + escHtml(name) + '.'
      : 'A checklist has not been set up yet for ' + escHtml(name) + '.';
    var btnLabel = isArabic ? 'تصفح المنتجات' : 'Browse Products';
    root.innerHTML = buildErrorState('fa-list-check', title, desc, shopHref, btnLabel);
  }

  function buildErrorState(icon, title, desc, href, btnLabel) {
    return '<div class="ffy-pcl-error-state">'
      + '<div class="ffy-pcl-error-icon"><i class="fas ' + escAttr(icon) + '" aria-hidden="true"></i></div>'
      + '<div class="ffy-pcl-error-title">' + escHtml(title) + '</div>'
      + '<p class="ffy-pcl-error-desc">' + escHtml(desc) + '</p>'
      + '<a href="' + escAttr(href) + '" class="ffy-pcl-shop-btn">'
      + '<i class="fas fa-store" aria-hidden="true"></i> ' + escHtml(btnLabel)
      + '</a></div>';
  }


  /* ----------------------------------------------------------------
     Boot — run after DOM is ready
     ---------------------------------------------------------------- */
  function boot() {
    initScrollReveal();
    initCopyrightYear();
    initSmoothScroll();
    initScrollSpy();
    initContactForm();
    initChecklist();
    initAccordion();
    initFaqFilters();
    initCatalogSearch();
    initCatalogTabs();
    initCatalogSort();
    initProductGallery();
    initQtyStepper();
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


  /* ----------------------------------------------------------------
     8. Catalog Search — live filter product cards
     ---------------------------------------------------------------- */
  function initCatalogSearch() {
    var input = document.getElementById('ffy-catalog-search');
    if (!input) { return; }

    var empty = document.getElementById('ffy-catalog-empty');

    function runFilter() {
      var query = input.value.trim().toLowerCase();
      var cards = [].slice.call(document.querySelectorAll('.ffy-product-card[data-name]'));
      var visible = 0;

      cards.forEach(function (card) {
        var name = (card.getAttribute('data-name') || '').toLowerCase();
        var cat  = (card.getAttribute('data-category') || '').toLowerCase();
        var matches = !query || name.indexOf(query) !== -1 || cat.indexOf(query) !== -1;
        if (matches) {
          card.classList.remove('is-hidden');
          visible++;
        } else {
          card.classList.add('is-hidden');
        }
      });

      /* Update results count */
      var countEl = document.getElementById('ffy-catalog-count');
      if (countEl) {
        countEl.innerHTML = '<strong>' + visible + '</strong> of <strong>' + cards.length + '</strong> products';
      }

      /* Show/hide empty state */
      if (empty) {
        if (visible === 0) {
          empty.classList.add('is-visible');
        } else {
          empty.classList.remove('is-visible');
        }
      }
    }

    input.addEventListener('input', runFilter);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        input.value = '';
        runFilter();
      }
    });
  }


  /* ----------------------------------------------------------------
     9. Catalog Category Tabs — filter by data-category
     ---------------------------------------------------------------- */
  function initCatalogTabs() {
    var tabs = [].slice.call(document.querySelectorAll('.ffy-catalog-tab'));
    if (!tabs.length) { return; }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');

        /* Also clear search if active */
        var searchInput = document.getElementById('ffy-catalog-search');
        if (searchInput) { searchInput.value = ''; }

        var filter = tab.getAttribute('data-filter');
        var cards  = [].slice.call(document.querySelectorAll('.ffy-product-card[data-category]'));
        var visible = 0;

        cards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('is-hidden');
            visible++;
          } else {
            card.classList.add('is-hidden');
          }
        });

        /* Update count */
        var countEl = document.getElementById('ffy-catalog-count');
        if (countEl) {
          countEl.innerHTML = '<strong>' + visible + '</strong> of <strong>' + cards.length + '</strong> products';
        }

        /* Empty state */
        var empty = document.getElementById('ffy-catalog-empty');
        if (empty) {
          if (visible === 0) { empty.classList.add('is-visible'); }
          else { empty.classList.remove('is-visible'); }
        }
      });
    });
  }


  /* ----------------------------------------------------------------
     10. Catalog Sort — re-order cards by price or featured
     ---------------------------------------------------------------- */
  function initCatalogSort() {
    var sel = document.getElementById('ffy-catalog-sort');
    if (!sel) { return; }

    sel.addEventListener('change', function () {
      var grid = document.querySelector('.ffy-catalog-grid');
      if (!grid) { return; }

      var cards = [].slice.call(grid.querySelectorAll('.ffy-product-card'));
      var val = sel.value;

      cards.sort(function (a, b) {
        if (val === 'price-asc') {
          return parseFloat(a.getAttribute('data-price') || 0) - parseFloat(b.getAttribute('data-price') || 0);
        } else if (val === 'price-desc') {
          return parseFloat(b.getAttribute('data-price') || 0) - parseFloat(a.getAttribute('data-price') || 0);
        } else if (val === 'featured') {
          var fa = a.getAttribute('data-featured') === 'true' ? 0 : 1;
          var fb = b.getAttribute('data-featured') === 'true' ? 0 : 1;
          return fa - fb;
        }
        return 0;
      });

      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    });
  }


  /* ----------------------------------------------------------------
     11. Product Gallery — thumbnail click & image zoom
     ---------------------------------------------------------------- */
  function initProductGallery() {
    var mainWrap = document.querySelector('.ffy-pd-main-img-wrap');
    if (!mainWrap) { return; }

    var mainImg    = mainWrap.querySelector('img');
    var thumbs     = [].slice.call(document.querySelectorAll('.ffy-pd-thumb'));
    var zoomOverlay = document.getElementById('ffy-pd-zoom');

    /* Thumbnail click — swap main image */
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var src = thumb.getAttribute('data-src');
        var alt = thumb.getAttribute('data-alt') || '';
        if (!src || !mainImg) { return; }

        /* Animate out */
        mainImg.classList.add('is-changing');

        setTimeout(function () {
          mainImg.src = src;
          mainImg.alt = alt;
          mainImg.classList.remove('is-changing');
        }, 180);

        thumbs.forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
      });
    });

    /* Click main image to zoom */
    if (zoomOverlay) {
      var zoomImg = zoomOverlay.querySelector('img');

      mainWrap.addEventListener('click', function () {
        if (zoomImg && mainImg) { zoomImg.src = mainImg.src; }
        zoomOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });

      zoomOverlay.addEventListener('click', function () {
        zoomOverlay.classList.remove('is-open');
        document.body.style.overflow = '';
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          zoomOverlay.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    }
  }


  /* ----------------------------------------------------------------
     12. Quantity Stepper
     ---------------------------------------------------------------- */
  function initQtyStepper() {
    var dec = document.getElementById('ffy-qty-dec');
    var inc = document.getElementById('ffy-qty-inc');
    var val = document.getElementById('ffy-qty-val');
    if (!dec || !inc || !val) { return; }

    var min = 1;
    var max = 10;
    var current = parseInt(val.textContent, 10) || 1;

    function update(n) {
      current = Math.min(max, Math.max(min, n));
      val.textContent = current;
      dec.disabled = current <= min;
      inc.disabled = current >= max;
    }

    update(current);

    dec.addEventListener('click', function () { update(current - 1); });
    inc.addEventListener('click', function () { update(current + 1); });
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


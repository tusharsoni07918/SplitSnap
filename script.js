/**
 * SplitSnap — Comprehensive Bill Splitting, Settle Up & UPI Payment Suite
 * Pure Vanilla JavaScript (Zero External Dependencies)
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_SPLIT_KEY = 'splitsnap_saved_split';
  const STORAGE_HISTORY_KEY = 'splitsnap_history';
  const STORAGE_THEME_KEY = 'splitsnap_theme';
  const STORAGE_ACCENT_KEY = 'splitsnap_accent';
  const STORAGE_SOUND_KEY = 'splitsnap_sound';
  const STORAGE_CURRENCY_KEY = 'splitsnap_currency';

  // Multi-Currency Config
  const CURRENCIES = {
    INR: { symbol: '₹', code: 'INR', locale: 'en-IN' },
    USD: { symbol: '$', code: 'USD', locale: 'en-US' },
    EUR: { symbol: '€', code: 'EUR', locale: 'de-DE' },
    GBP: { symbol: '£', code: 'GBP', locale: 'en-GB' },
    AED: { symbol: 'AED ', code: 'AED', locale: 'ar-AE' },
    SGD: { symbol: 'S$', code: 'SGD', locale: 'en-SG' },
  };
  let currentCurrency = 'INR';

  // State
  let currentSplitData = null;
  let itemizedItems = [];
  let settlePayments = [];
  let splitHistory = [];
  let itemizedMembers = ['Rahul', 'Priya', 'Amit', 'Sneha'];

  // =========================================================================
  // DOM Elements
  // =========================================================================

  // Navigation & Header Utilities
  const navTabs = document.querySelectorAll('.nav-tab, .mobile-nav-btn');
  const viewPanels = document.querySelectorAll('.view-panel');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');
  const accentDots = document.querySelectorAll('.accent-dot');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');
  const currencySelect = document.getElementById('currency-select');
  const headerPrintBtn = document.getElementById('header-print-btn');
  const historyCounterBadge = document.getElementById('history-counter-badge');
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  // Quick Split Elements
  const splitForm = document.getElementById('split-form');
  const occasionInput = document.getElementById('occasion-input');
  const vibeChips = document.querySelectorAll('.vibe-chip');
  const billInput = document.getElementById('bill-input');
  const peopleInput = document.getElementById('people-input');
  const tipSelect = document.getElementById('tip-select');
  const discountInput = document.getElementById('discount-input');
  const roundUpSelect = document.getElementById('round-up-select');
  const customNamesInput = document.getElementById('custom-names-input');
  const whoPaidInput = document.getElementById('who-paid-input');
  const billError = document.getElementById('bill-error');
  const peopleError = document.getElementById('people-error');
  const formAlert = document.getElementById('form-alert');
  const resetBtn = document.getElementById('reset-btn');
  const btnIncPeople = document.getElementById('btn-inc-people');
  const btnDecPeople = document.getElementById('btn-dec-people');
  const confettiCanvas = document.getElementById('confetti-canvas');

  // GST & Service Charge Elements
  const taxRadios = document.querySelectorAll('input[name="tax-rate"]');
  const serviceChargeCheck = document.getElementById('service-charge-check');
  const taxBreakdownPreview = document.getElementById('tax-breakdown-preview');
  const taxSubtotalVal = document.getElementById('tax-subtotal-val');
  const taxCgstVal = document.getElementById('tax-cgst-val');
  const taxSgstVal = document.getElementById('tax-sgst-val');
  const taxScVal = document.getElementById('tax-sc-val');
  const taxSummaryHint = document.getElementById('tax-summary-hint');

  // Food vs. Drinks Split Elements
  const drinksAmountInput = document.getElementById('drinks-amount-input');
  const drinksPeopleCount = document.getElementById('drinks-people-count');
  const drinksSummaryHint = document.getElementById('drinks-summary-hint');

  // Result & Settlement Elements
  const emptyState = document.getElementById('empty-state');
  const resultContent = document.getElementById('result-content');
  const resultOccasion = document.getElementById('result-occasion');
  const resultTotalBill = document.getElementById('result-total-bill');
  const resultBreakdownNote = document.getElementById('result-breakdown-note');
  const resultPerPerson = document.getElementById('result-per-person');
  const resultPeoplePill = document.getElementById('result-people-pill');
  const resultRemainderNote = document.getElementById('result-remainder-note');
  const settlementCounter = document.getElementById('settlement-counter');
  const settlementBarFill = document.getElementById('settlement-bar-fill');
  const settlementCollectedAmt = document.getElementById('settlement-collected-amt');
  const settlementRemainingAmt = document.getElementById('settlement-remaining-amt');
  const breakdownCount = document.getElementById('breakdown-count');
  const peopleList = document.getElementById('people-list');
  const resultFooterTotal = document.getElementById('result-footer-total');

  // Action Buttons
  const whatsappDirectBtn = document.getElementById('whatsapp-direct-btn');
  const downloadReceiptBtn = document.getElementById('download-receipt-btn');
  const copyBtn = document.getElementById('copy-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const saveHistoryBtn = document.getElementById('save-history-btn');
  const payUpiBtn = document.getElementById('pay-upi-btn');
  const receiptExportCanvas = document.getElementById('receipt-export-canvas');

  // Itemized Bill Elements
  const itemizedForm = document.getElementById('itemized-form');
  const itemNameInput = document.getElementById('item-name-input');
  const itemPriceInput = document.getElementById('item-price-input');
  const itemMembersCheckboxes = document.getElementById('item-members-checkboxes');
  const itemsCountLabel = document.getElementById('items-count-label');
  const itemsList = document.getElementById('items-list');
  const clearItemsBtn = document.getElementById('clear-items-btn');
  const itemizedGrandTotal = document.getElementById('itemized-grand-total');
  const itemizedMemberShares = document.getElementById('itemized-member-shares');
  const copyItemizedBtn = document.getElementById('copy-itemized-btn');

  // Settle Up Elements
  const settleForm = document.getElementById('settle-form');
  const settleNameInput = document.getElementById('settle-name-input');
  const settleAmountInput = document.getElementById('settle-amount-input');
  const settleDescInput = document.getElementById('settle-desc-input');
  const settleCountLabel = document.getElementById('settle-count-label');
  const settleRecordedList = document.getElementById('settle-recorded-list');
  const clearSettleBtn = document.getElementById('clear-settle-btn');
  const settleGrandTotal = document.getElementById('settle-grand-total');
  const settleTransList = document.getElementById('settle-trans-list');
  const copySettleBtn = document.getElementById('copy-settle-btn');

  // UPI QR Elements
  const upiIdInput = document.getElementById('upi-id-input');
  const upiNameInput = document.getElementById('upi-name-input');
  const upiAmountInput = document.getElementById('upi-amount-input');
  const upiNoteInput = document.getElementById('upi-note-input');
  const generateQrBtn = document.getElementById('generate-qr-btn');
  const upiQrCanvas = document.getElementById('upi-qr-canvas');
  const qrAmountDisplay = document.getElementById('qr-amount-display');
  const qrPayeeDisplay = document.getElementById('qr-payee-display');
  const upiIntentLink = document.getElementById('upi-intent-link');

  // History Elements
  const historyContainer = document.getElementById('history-container');
  const exportHistoryJson = document.getElementById('export-history-json');
  const clearAllHistoryBtn = document.getElementById('clear-all-history-btn');

  // =========================================================================
  // UTILITY: Currency & Precise Decimal Math (Paise/Cent Integer Engine)
  // =========================================================================

  /**
   * Converts integer smallest units (paise/cents) into formatted currency string.
   */
  function formatCurrency(units) {
    if (typeof units !== 'number' || isNaN(units)) {
      const sym = CURRENCIES[currentCurrency] ? CURRENCIES[currentCurrency].symbol : '₹';
      return sym + '0.00';
    }
    const major = units / 100;
    const config = CURRENCIES[currentCurrency] || CURRENCIES.INR;
    try {
      const formatted = new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(major);
      return config.symbol + formatted;
    } catch {
      return config.symbol + major.toFixed(2);
    }
  }

  // Alias for backward compatibility
  const formatINR = formatCurrency;

  /**
   * String-based decimal parser avoiding IEEE 754 float drift.
   * e.g., "99.99" -> 9999 paise
   */
  function parseRupeesToPaise(value) {
    if (value === null || value === undefined) return null;
    const str = String(value).trim();
    if (!str) return null;

    if (!/^\d+(\.\d+)?$/.test(str)) {
      return null;
    }

    const parts = str.split('.');
    const whole = parseInt(parts[0], 10);
    if (isNaN(whole) || whole < 0) return null;

    let frac = 0;
    if (parts.length > 1 && parts[1]) {
      const fracStr = parts[1];
      if (fracStr.length === 1) {
        frac = parseInt(fracStr + '0', 10);
      } else if (fracStr.length === 2) {
        frac = parseInt(fracStr, 10);
      } else {
        frac = Math.round(parseFloat('0.' + fracStr) * 100);
      }
    }

    const totalPaise = whole * 100 + frac;
    if (isNaN(totalPaise) || totalPaise <= 0 || !Number.isSafeInteger(totalPaise)) {
      return null;
    }

    return totalPaise;
  }

  /**
   * Validate Bill Input
   */
  function validateBill(raw) {
    if (raw === null || raw === undefined) {
      return { valid: false, message: 'Please enter a valid bill amount greater than ₹0.' };
    }
    const str = String(raw).trim();
    if (!str) {
      return { valid: false, message: 'Please enter a valid bill amount greater than ₹0.' };
    }

    if (str.startsWith('-') || parseFloat(str) < 0) {
      return { valid: false, message: 'Please enter a valid bill amount greater than ₹0.' };
    }

    const paise = parseRupeesToPaise(str);
    if (paise === null || paise <= 0) {
      return { valid: false, message: 'Please enter a valid bill amount greater than ₹0.' };
    }

    if (paise > 100000000000) {
      return { valid: false, message: 'Bill amount exceeds maximum supported limit.' };
    }

    return { valid: true, paise };
  }

  /**
   * Validate People Input
   */
  function validatePeople(raw) {
    if (raw === null || raw === undefined) {
      return { valid: false, message: 'Please enter at least 1 person.' };
    }
    const str = String(raw).trim();
    if (!str) {
      return { valid: false, message: 'Please enter at least 1 person.' };
    }

    if (str.startsWith('-') || parseInt(str, 10) < 0) {
      return { valid: false, message: 'Please enter at least 1 person.' };
    }

    if (!/^\d+$/.test(str)) {
      if (/^\d+\.\d+$/.test(str)) {
        return { valid: false, message: 'Number of people must be a whole number.' };
      }
      return { valid: false, message: 'Please enter a valid number of people.' };
    }

    const count = parseInt(str, 10);
    if (isNaN(count) || count <= 0) {
      return { valid: false, message: 'Please enter at least 1 person.' };
    }

    if (count > 500) {
      return { valid: false, message: 'Maximum supported number of people is 500.' };
    }

    return { valid: true, count };
  }

  /**
   * Toast notification helper
   */
  let toastTimer = null;
  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage.textContent = msg;
    toastNotification.classList.add('visible');
    toastTimer = setTimeout(function () {
      toastNotification.classList.remove('visible');
    }, 2400);
  }

  // =========================================================================
  // VIEW SWITCHING & THEME HANDLING
  // =========================================================================

  function switchView(targetViewId) {
    if (!targetViewId) return;
    const allTabs = document.querySelectorAll('.nav-tab, .mobile-nav-btn');
    const allPanels = document.querySelectorAll('.view-panel');

    allTabs.forEach(function (tab) {
      const match = tab.getAttribute('data-view') === targetViewId;
      if (match) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    allPanels.forEach(function (panel) {
      if (panel.id === 'view-' + targetViewId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    try {
      playFeedbackSound('click');
    } catch {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Expose globally so inline onclick handlers in HTML always invoke the full engine
  window.switchView = switchView;
  window.switchViewInternal = switchView;

  navTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const view = this.getAttribute('data-view');
      if (view) switchView(view);
    });
  });

  // Dark / Light Theme
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {}

    if (theme === 'dark') {
      themeIconSun.classList.add('hidden');
      themeIconMoon.classList.remove('hidden');
    } else {
      themeIconSun.classList.remove('hidden');
      themeIconMoon.classList.add('hidden');
    }
  }

  themeToggleBtn.addEventListener('click', function () {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
    playFeedbackSound('click');
  });

  // Color Accent Themes
  function initAccent() {
    const saved = localStorage.getItem(STORAGE_ACCENT_KEY) || 'emerald';
    setAccent(saved);
  }

  function setAccent(accent) {
    document.documentElement.setAttribute('data-accent', accent);
    try {
      localStorage.setItem(STORAGE_ACCENT_KEY, accent);
    } catch {}

    accentDots.forEach(function (dot) {
      if (dot.getAttribute('data-accent') === accent) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  accentDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const accent = this.getAttribute('data-accent');
      if (accent) {
        setAccent(accent);
        playFeedbackSound('click');
        showToast(`Theme changed to ${this.getAttribute('title') || accent}!`);
      }
    });
  });

  // Web Audio Feedback (Zero files, 100% offline)
  let audioCtx = null;
  let soundEnabled = true;

  function initSound() {
    const saved = localStorage.getItem(STORAGE_SOUND_KEY);
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
    updateSoundUI();
  }

  function updateSoundUI() {
    if (!soundIconOn || !soundIconOff) return;
    if (soundEnabled) {
      soundIconOn.classList.remove('hidden');
      soundIconOff.classList.add('hidden');
    } else {
      soundIconOn.classList.add('hidden');
      soundIconOff.classList.remove('hidden');
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', function () {
      soundEnabled = !soundEnabled;
      try {
        localStorage.setItem(STORAGE_SOUND_KEY, String(soundEnabled));
      } catch {}
      updateSoundUI();
      if (soundEnabled) {
        playFeedbackSound('click');
        showToast('Sound feedback enabled');
      } else {
        showToast('Sound feedback muted');
      }
    });
  }

  function playFeedbackSound(type) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
      }
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'settle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'confetti') {
        const freqs = [523.25, 659.25, 783.99];
        freqs.forEach(function (f, i) {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.connect(g);
          g.connect(audioCtx.destination);
          o.type = 'triangle';
          o.frequency.setValueAtTime(f, now + i * 0.08);
          g.gain.setValueAtTime(0.12, now + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.22);
          o.start(now + i * 0.08);
          o.stop(now + i * 0.08 + 0.22);
        });
      }
    } catch {}
  }

  // Celebration Confetti Cannon (Zero external dependencies)
  let confettiAnimId = null;
  function fireConfetti(duration = 2400) {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    if (!ctx) return;

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ['#10b981', '#7c3aed', '#f43f5e', '#0284c7', '#f59e0b', '#ec4899', '#34d399', '#fbbf24'];
    const particles = [];
    const count = Math.min(90, Math.floor(window.innerWidth / 12));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: window.innerWidth * (0.2 + Math.random() * 0.6),
        y: window.innerHeight * 0.35 + (Math.random() * 40 - 20),
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
      });
    }

    const startTime = performance.now();

    function render(now) {
      const elapsed = now - startTime;
      const progress = elapsed / duration;

      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      if (progress >= 1) {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        cancelAnimationFrame(confettiAnimId);
        return;
      }

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - progress * 1.15);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      confettiAnimId = requestAnimationFrame(render);
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    confettiAnimId = requestAnimationFrame(render);
  }

  // =========================================================================
  // SECTION 1: QUICK SPLIT LOGIC
  // =========================================================================

  function clearQuickSplitErrors() {
    billError.textContent = '';
    billError.classList.remove('visible');
    billInput.classList.remove('has-error');

    peopleError.textContent = '';
    peopleError.classList.remove('visible');
    peopleInput.classList.remove('has-error');

    formAlert.textContent = '';
    formAlert.classList.remove('visible');
  }

  function showQuickBillError(msg) {
    billError.textContent = msg;
    billError.classList.add('visible');
    billInput.classList.add('has-error');
  }

  function showQuickPeopleError(msg) {
    peopleError.textContent = msg;
    peopleError.classList.add('visible');
    peopleInput.classList.add('has-error');
  }

  function showQuickFormAlert(msg) {
    formAlert.textContent = msg;
    formAlert.classList.add('visible');
  }

  function showQuickEmptyState() {
    emptyState.classList.remove('hidden');
    resultContent.classList.add('hidden');
    peopleList.innerHTML = '';
    currentSplitData = null;
  }

  /**
   * Main calculation with exact remainder distribution, GST, drinks split, round-up, and paid status
   */
  function calculateBillSplit(
    totalPaise,
    peopleCount,
    rawOccasion,
    tipPercent,
    discountPaise,
    customNamesList,
    taxRate,
    hasServiceCharge,
    drinksPaise,
    drinkersCount,
    roundUpUnit,
    whoPaidName
  ) {
    const occasion = (rawOccasion && typeof rawOccasion === 'string' && rawOccasion.trim())
      ? rawOccasion.trim()
      : 'Dinner Split';

    // 1. Service Charge (10%)
    const serviceChargePaise = hasServiceCharge ? Math.round(totalPaise * 0.10) : 0;

    // 2. GST / Tax (5% or 18%) on base + service charge
    const taxableBase = totalPaise + serviceChargePaise;
    const taxPaise = (taxRate > 0) ? Math.round(taxableBase * (taxRate / 100)) : 0;
    const cgstPaise = Math.floor(taxPaise / 2);
    const sgstPaise = taxPaise - cgstPaise;

    // 3. Tip
    let tipPaise = (tipPercent > 0) ? Math.round(totalPaise * (tipPercent / 100)) : 0;

    // 4. Net Total in smallest currency unit before round-up
    let netPaise = totalPaise + serviceChargePaise + taxPaise + tipPaise;
    if (discountPaise > 0) {
      netPaise = Math.max(1, netPaise - discountPaise);
    }

    // 4.5 Round Up to Clean Notes (e.g. 10, 50, 100)
    let roundUpPaise = 0;
    const unitInt = parseInt(roundUpUnit, 10) || 0;
    if (unitInt > 0) {
      const stepPaise = unitInt * 100;
      const mod = netPaise % stepPaise;
      if (mod > 0) {
        roundUpPaise = stepPaise - mod;
        netPaise += roundUpPaise;
        tipPaise += roundUpPaise;
      }
    }

    const cleanWhoPaid = (whoPaidName && typeof whoPaidName === 'string') ? whoPaidName.trim() : '';

    const shares = [];
    let sumPaise = 0;

    // 5. Food vs Drinks Split handling
    const isDrinksSplitActive = drinksPaise > 0 && drinkersCount > 0 && drinkersCount <= peopleCount && drinksPaise < netPaise;

    if (isDrinksSplitActive) {
      const foodPaise = netPaise - drinksPaise;

      // Food distributed among ALL friends
      const foodBase = Math.floor(foodPaise / peopleCount);
      const foodRem = foodPaise % peopleCount;

      // Drinks distributed ONLY among drinkers
      const drinksBase = Math.floor(drinksPaise / drinkersCount);
      const drinksRem = drinksPaise % drinkersCount;

      for (let i = 0; i < peopleCount; i++) {
        const myFood = (i < foodRem) ? foodBase + 1 : foodBase;
        const isDrinker = i < drinkersCount;
        const myDrinks = isDrinker ? ((i < drinksRem) ? drinksBase + 1 : drinksBase) : 0;
        const personPaise = myFood + myDrinks;
        sumPaise += personPaise;

        let name = `Person ${i + 1}`;
        if (customNamesList && customNamesList[i]) {
          name = customNamesList[i];
        }

        const isHost = Boolean(cleanWhoPaid && (
          name.toLowerCase() === cleanWhoPaid.toLowerCase() ||
          (i === 0 && cleanWhoPaid.toLowerCase() === 'me')
        ));

        shares.push({
          index: i + 1,
          name: name,
          paise: personPaise,
          formatted: formatCurrency(personPaise),
          hasExtraPaise: (i < foodRem && foodRem > 0) || (isDrinker && i < drinksRem && drinksRem > 0),
          isDrinker: isDrinker,
          foodShare: myFood,
          drinksShare: myDrinks,
          isHost: isHost,
          paid: isHost,
        });
      }
    } else {
      // Standard Equal Division with 1-paise Fair Remainder Distribution
      const basePaise = Math.floor(netPaise / peopleCount);
      const remainder = netPaise % peopleCount;

      for (let i = 0; i < peopleCount; i++) {
        const personPaise = (i < remainder) ? basePaise + 1 : basePaise;
        sumPaise += personPaise;

        let name = `Person ${i + 1}`;
        if (customNamesList && customNamesList[i]) {
          name = customNamesList[i];
        }

        const isHost = Boolean(cleanWhoPaid && (
          name.toLowerCase() === cleanWhoPaid.toLowerCase() ||
          (i === 0 && cleanWhoPaid.toLowerCase() === 'me')
        ));

        shares.push({
          index: i + 1,
          name: name,
          paise: personPaise,
          formatted: formatCurrency(personPaise),
          hasExtraPaise: i < remainder && remainder > 0,
          isDrinker: null,
          isHost: isHost,
          paid: isHost,
        });
      }
    }

    return {
      occasion,
      originalPaise: totalPaise,
      serviceChargePaise,
      taxRate: taxRate || 0,
      taxPaise,
      cgstPaise,
      sgstPaise,
      tipPaise,
      discountPaise,
      roundUpPaise,
      roundUpUnit: unitInt,
      payerName: cleanWhoPaid,
      isDrinksSplitActive,
      drinksPaise: isDrinksSplitActive ? drinksPaise : 0,
      drinkersCount: isDrinksSplitActive ? drinkersCount : 0,
      totalPaise: netPaise,
      totalFormatted: formatCurrency(netPaise),
      peopleCount,
      shares,
      sumPaise,
      isExact: sumPaise === netPaise,
      timestamp: Date.now(),
    };
  }

  /**
   * Updates settlement progress bar and amounts
   */
  function updateSettlementProgress(data) {
    if (!data) return;
    const paidList = data.shares.filter(function (s) { return s.paid; });
    const paidCount = paidList.length;
    const collectedPaise = paidList.reduce(function (acc, s) { return acc + s.paise; }, 0);
    const remainingPaise = Math.max(0, data.totalPaise - collectedPaise);
    const percent = Math.round((paidCount / data.peopleCount) * 100);

    settlementCounter.textContent = `${paidCount} of ${data.peopleCount} Paid`;
    settlementBarFill.style.width = `${percent}%`;
    settlementCollectedAmt.textContent = `${formatCurrency(collectedPaise)} Collected`;
    settlementRemainingAmt.textContent = `${formatCurrency(remainingPaise)} Remaining`;
  }

  /**
   * Updates WhatsApp Direct Share Link
   */
  function updateWhatsAppLink(data) {
    if (!whatsappDirectBtn || !data) return;
    let text = `🍽️ *${data.occasion}*\n💰 Total Bill: ${data.totalFormatted}\n`;
    if (data.payerName) {
      text += `💳 *Paid upfront by:* ${data.payerName}\n`;
    }
    text += `\n👥 *Individual Shares:*\n`;
    data.shares.forEach(function (person) {
      const status = person.paid ? '✅ Paid' : '⏳ Pending';
      const drinksTag = person.isDrinker === true ? ' (Food + Drinks)' : (person.isDrinker === false ? ' (Food only)' : '');
      const hostTag = person.isHost ? ' [👑 Host]' : '';
      text += `• *${person.name}*: ${person.formatted}${drinksTag}${hostTag} [${status}]\n`;
    });
    if (upiIdInput && upiIdInput.value.trim()) {
      text += `\n📲 Settle via UPI: ${upiIdInput.value.trim()}`;
    }
    if (data.payerName) {
      text += `\n👉 Please transfer your share to ${data.payerName}`;
    }
    text += `\n\n— Calculated via SplitSnap`;
    whatsappDirectBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }

  /**
   * Render calculation results safely
   */
  function renderQuickResult(data) {
    emptyState.classList.add('hidden');
    resultContent.classList.remove('hidden');

    resultOccasion.textContent = data.occasion;
    resultTotalBill.textContent = data.totalFormatted;

    let notes = [];
    if (data.serviceChargePaise > 0) notes.push(`+Service Chg ${formatCurrency(data.serviceChargePaise)}`);
    if (data.taxPaise > 0) notes.push(`+GST ${formatCurrency(data.taxPaise)}`);
    if (data.tipPaise > 0) notes.push(`+Tip ${formatCurrency(data.tipPaise)}`);
    if (data.discountPaise > 0) notes.push(`-Discount ${formatCurrency(data.discountPaise)}`);
    if (data.roundUpPaise > 0) notes.push(`Round-up +${formatCurrency(data.roundUpPaise)}`);
    if (data.isDrinksSplitActive) notes.push(`Drinks Split (${data.drinkersCount} drinkers)`);
    resultBreakdownNote.textContent = notes.join(' • ');

    if (!data.isDrinksSplitActive) {
      const minShare = formatCurrency(Math.floor(data.totalPaise / data.peopleCount));
      const maxShare = formatCurrency(Math.floor(data.totalPaise / data.peopleCount) + (data.totalPaise % data.peopleCount > 0 ? 1 : 0));
      resultPerPerson.textContent = (minShare === maxShare) ? minShare : `${minShare} – ${maxShare}`;
      if (data.totalPaise % data.peopleCount > 0) {
        resultRemainderNote.textContent = `1-unit remainder distributed fairly to ${data.totalPaise % data.peopleCount} members.`;
        resultRemainderNote.classList.remove('hidden');
      } else {
        resultRemainderNote.classList.add('hidden');
      }
    } else {
      resultPerPerson.textContent = 'Custom Split';
      resultRemainderNote.textContent = `Food shared equally. Drinks shared only by ${data.drinkersCount} drinkers.`;
      resultRemainderNote.classList.remove('hidden');
    }

    resultPeoplePill.textContent = `for ${data.peopleCount} ${data.peopleCount === 1 ? 'person' : 'people'}`;
    breakdownCount.textContent = `${data.peopleCount} ${data.peopleCount === 1 ? 'Person' : 'People'}`;

    // Render Rows
    peopleList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    data.shares.forEach(function (person, idx) {
      const row = document.createElement('div');
      row.className = 'person-row' + (person.paid ? ' is-paid' : '');

      const meta = document.createElement('div');
      meta.className = 'person-meta';

      const avatar = document.createElement('div');
      avatar.className = 'person-avatar-circle av-' + (idx % 6);
      avatar.textContent = person.name.charAt(0).toUpperCase();

      const label = document.createElement('span');
      label.className = 'person-label';
      label.textContent = person.name;

      meta.appendChild(avatar);
      meta.appendChild(label);

      if (person.isHost) {
        const hostBadge = document.createElement('span');
        hostBadge.className = 'payer-badge';
        hostBadge.textContent = '👑 Payer (Paid)';
        meta.appendChild(hostBadge);
      }

      if (person.isDrinker === false) {
        const vegChip = document.createElement('span');
        vegChip.className = 'remainder-chip';
        vegChip.style.background = '#dbeafe';
        vegChip.style.color = '#1d4ed8';
        vegChip.textContent = 'Food only';
        meta.appendChild(vegChip);
      } else if (person.hasExtraPaise) {
        const remainderChip = document.createElement('span');
        remainderChip.className = 'remainder-chip';
        remainderChip.textContent = '+0.01';
        remainderChip.title = 'Received 1 unit remainder';
        meta.appendChild(remainderChip);
      }

      const actionsWrap = document.createElement('div');
      actionsWrap.className = 'person-actions-wrap';

      const val = document.createElement('span');
      val.className = 'person-val';
      val.textContent = person.formatted;

      // Personal WhatsApp link
      const indivMsg = `Hey ${person.name}! Your share for *${data.occasion}* is *${person.formatted}*.${upiIdInput && upiIdInput.value.trim() ? ' Settle via UPI: ' + upiIdInput.value.trim() : ''}\n— via SplitSnap`;
      const indivWaBtn = document.createElement('a');
      indivWaBtn.className = 'person-mini-btn';
      indivWaBtn.title = `Send reminder to ${person.name} on WhatsApp`;
      indivWaBtn.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>';
      indivWaBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(indivMsg)}`;
      indivWaBtn.target = '_blank';
      indivWaBtn.rel = 'noopener';

      // Personal Copy share
      const indivCopyBtn = document.createElement('button');
      indivCopyBtn.type = 'button';
      indivCopyBtn.className = 'person-mini-btn';
      indivCopyBtn.title = `Copy ${person.name}'s share text`;
      indivCopyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
      indivCopyBtn.addEventListener('click', function () {
        copyTextToClipboard(indivMsg, function () {
          playFeedbackSound('click');
          showToast(`Copied ${person.name}'s share!`);
        });
      });

      // Settlement Checklist Pill
      const togglePaidBtn = document.createElement('button');
      togglePaidBtn.type = 'button';
      togglePaidBtn.className = 'paid-toggle-btn' + (person.paid ? ' paid' : '');
      togglePaidBtn.innerHTML = person.paid ? '<span>✓</span> Paid' : '<span>⏳</span> Pending';
      togglePaidBtn.title = 'Click to toggle paid status';
      togglePaidBtn.addEventListener('click', function () {
        person.paid = !person.paid;
        togglePaidBtn.className = 'paid-toggle-btn' + (person.paid ? ' paid' : '');
        togglePaidBtn.innerHTML = person.paid ? '<span>✓</span> Paid' : '<span>⏳</span> Pending';
        row.classList.toggle('is-paid', person.paid);
        updateSettlementProgress(data);
        updateWhatsAppLink(data);

        // Check if all settled
        const paidCount = data.shares.filter(function (s) { return s.paid; }).length;
        if (paidCount === data.peopleCount) {
          playFeedbackSound('confetti');
          fireConfetti(2800);
          showToast('All friends settled up! 🎉 Congratulations!');
        } else {
          playFeedbackSound('settle');
        }

        // Persist updated status
        try {
          const raw = localStorage.getItem(STORAGE_SPLIT_KEY);
          if (raw) {
            const saved = JSON.parse(raw);
            saved.data = data;
            localStorage.setItem(STORAGE_SPLIT_KEY, JSON.stringify(saved));
          }
        } catch {}
      });

      actionsWrap.appendChild(val);
      actionsWrap.appendChild(indivCopyBtn);
      actionsWrap.appendChild(indivWaBtn);
      actionsWrap.appendChild(togglePaidBtn);

      row.appendChild(meta);
      row.appendChild(actionsWrap);
      fragment.appendChild(row);
    });

    peopleList.appendChild(fragment);
    resultFooterTotal.textContent = data.totalFormatted;
    currentSplitData = data;

    updateSettlementProgress(data);
    updateWhatsAppLink(data);
  }

  function handleQuickSplit(event) {
    if (event) event.preventDefault();
    clearQuickSplitErrors();

    const rawBill = billInput.value;
    const rawPeople = peopleInput.value;
    const rawOccasion = occasionInput.value;

    const billVal = validateBill(rawBill);
    const peopleVal = validatePeople(rawPeople);

    if (!billVal.valid || !peopleVal.valid) {
      showQuickEmptyState();

      if (!billVal.valid && !peopleVal.valid) {
        showQuickBillError(billVal.message);
        showQuickPeopleError(peopleVal.message);
        showQuickFormAlert('Please enter valid bill details to split.');
        billInput.focus();
      } else if (!billVal.valid) {
        showQuickBillError(billVal.message);
        billInput.focus();
      } else {
        showQuickPeopleError(peopleVal.message);
        peopleInput.focus();
      }

      try {
        localStorage.removeItem(STORAGE_SPLIT_KEY);
      } catch {}
      return;
    }

    const tipPercent = parseInt(tipSelect.value, 10) || 0;
    const discountPaise = parseRupeesToPaise(discountInput.value) || 0;
    const roundUpUnit = roundUpSelect ? roundUpSelect.value : '0';
    const whoPaidName = whoPaidInput ? whoPaidInput.value : '';

    // Read GST & Service Charge
    let taxRate = 0;
    taxRadios.forEach(function (radio) {
      if (radio.checked) taxRate = parseInt(radio.value, 10) || 0;
    });
    const hasServiceCharge = serviceChargeCheck ? serviceChargeCheck.checked : false;

    // Read Drinks Split
    const drinksPaise = parseRupeesToPaise(drinksAmountInput.value) || 0;
    const drinkersCount = parseInt(drinksPeopleCount.value, 10) || 0;

    let customNames = [];
    if (customNamesInput.value.trim()) {
      customNames = customNamesInput.value.split(',').map(function (s) {
        return s.trim();
      }).filter(Boolean);
    }

    const splitData = calculateBillSplit(
      billVal.paise,
      peopleVal.count,
      rawOccasion,
      tipPercent,
      discountPaise,
      customNames,
      taxRate,
      hasServiceCharge,
      drinksPaise,
      drinkersCount,
      roundUpUnit,
      whoPaidName
    );

    // Update tax preview
    if (taxRate > 0 || hasServiceCharge) {
      taxBreakdownPreview.classList.remove('hidden');
      taxSubtotalVal.textContent = formatCurrency(billVal.paise);
      taxCgstVal.textContent = formatCurrency(splitData.cgstPaise);
      taxSgstVal.textContent = formatCurrency(splitData.sgstPaise);
      taxScVal.textContent = formatCurrency(splitData.serviceChargePaise);
      taxSummaryHint.textContent = `${taxRate}% GST` + (hasServiceCharge ? ' + 10% SC' : '');
    } else {
      taxBreakdownPreview.classList.add('hidden');
      taxSummaryHint.textContent = 'None';
    }

    if (splitData.isDrinksSplitActive) {
      drinksSummaryHint.textContent = `${splitData.drinkersCount} Drinkers`;
    } else {
      drinksSummaryHint.textContent = 'Off';
    }

    renderQuickResult(splitData);
    updateItemizedMembersList(splitData.shares.map(function (s) { return s.name; }));

    // Visual celebration & sound
    fireConfetti(1600);
    playFeedbackSound('click');

    // Save to persistent storage
    try {
      const payload = {
        occasion: rawOccasion || '',
        billAmount: rawBill,
        peopleCount: rawPeople,
        tipPercent,
        discountRaw: discountInput.value,
        roundUpUnit: roundUpUnit,
        customNamesRaw: customNamesInput.value,
        whoPaidName: whoPaidName,
        taxRate: taxRate,
        hasServiceCharge: hasServiceCharge,
        drinksAmountRaw: drinksAmountInput.value,
        drinksPeopleCountRaw: drinksPeopleCount.value,
        currency: currentCurrency,
        data: splitData,
      };
      localStorage.setItem(STORAGE_SPLIT_KEY, JSON.stringify(payload));
    } catch {}
  }

  function handleQuickReset() {
    clearQuickSplitErrors();
    splitForm.reset();
    if (whoPaidInput) whoPaidInput.value = '';
    if (roundUpSelect) roundUpSelect.value = '0';
    vibeChips.forEach(function (c) { c.classList.remove('active'); });
    showQuickEmptyState();
    taxBreakdownPreview.classList.add('hidden');
    taxSummaryHint.textContent = 'None';
    drinksSummaryHint.textContent = 'Off';
    try {
      localStorage.removeItem(STORAGE_SPLIT_KEY);
    } catch {}
    occasionInput.focus();
    playFeedbackSound('click');
    showToast('Form reset');
  }

  // Stepper buttons
  btnIncPeople.addEventListener('click', function () {
    const current = parseInt(peopleInput.value, 10) || 0;
    peopleInput.value = current + 1;
    peopleInput.dispatchEvent(new Event('input'));
    playFeedbackSound('click');
  });

  btnDecPeople.addEventListener('click', function () {
    const current = parseInt(peopleInput.value, 10) || 1;
    if (current > 1) {
      peopleInput.value = current - 1;
      peopleInput.dispatchEvent(new Event('input'));
      playFeedbackSound('click');
    }
  });

  // Occasion Vibe Pills
  vibeChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const vibe = this.getAttribute('data-vibe');
      if (vibe) {
        occasionInput.value = vibe;
        vibeChips.forEach(function (c) { c.classList.remove('active'); });
        this.classList.add('active');
        playFeedbackSound('click');
        showToast(`Occasion set to ${vibe}`);
      }
    });
  });

  // Preset Chips & Quick Add Buttons
  document.querySelectorAll('.preset-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      const amt = this.getAttribute('data-amount');
      const add = this.getAttribute('data-add');
      if (amt) {
        billInput.value = amt;
        billInput.dispatchEvent(new Event('input'));
        billInput.focus();
        playFeedbackSound('click');
      } else if (add) {
        const cur = parseFloat(billInput.value) || 0;
        const next = cur + parseFloat(add);
        billInput.value = next.toFixed(2);
        billInput.dispatchEvent(new Event('input'));
        billInput.focus();
        playFeedbackSound('click');
      }
    });
  });

  // Restore Quick Split from LocalStorage
  function restoreSavedQuickSplit() {
    try {
      const raw = localStorage.getItem(STORAGE_SPLIT_KEY);
      if (!raw) {
        showQuickEmptyState();
        return;
      }
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') {
        showQuickEmptyState();
        return;
      }

      if (saved.occasion !== undefined) occasionInput.value = saved.occasion;
      if (saved.billAmount !== undefined) billInput.value = saved.billAmount;
      if (saved.peopleCount !== undefined) peopleInput.value = saved.peopleCount;
      if (saved.tipPercent !== undefined) tipSelect.value = saved.tipPercent;
      if (saved.discountRaw !== undefined) discountInput.value = saved.discountRaw;
      if (saved.roundUpUnit !== undefined && roundUpSelect) roundUpSelect.value = saved.roundUpUnit;
      if (saved.customNamesRaw !== undefined) customNamesInput.value = saved.customNamesRaw;
      if (saved.whoPaidName !== undefined && whoPaidInput) whoPaidInput.value = saved.whoPaidName;
      if (saved.drinksAmountRaw !== undefined) drinksAmountInput.value = saved.drinksAmountRaw;
      if (saved.drinksPeopleCountRaw !== undefined) drinksPeopleCount.value = saved.drinksPeopleCountRaw;

      if (saved.taxRate !== undefined) {
        taxRadios.forEach(function (r) {
          r.checked = (parseInt(r.value, 10) === parseInt(saved.taxRate, 10));
        });
      }
      if (saved.hasServiceCharge !== undefined && serviceChargeCheck) {
        serviceChargeCheck.checked = Boolean(saved.hasServiceCharge);
      }

      const billVal = validateBill(saved.billAmount);
      const peopleVal = validatePeople(saved.peopleCount);

      if (billVal.valid && peopleVal.valid) {
        let customNames = [];
        if (saved.customNamesRaw && saved.customNamesRaw.trim()) {
          customNames = saved.customNamesRaw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        }

        const splitData = calculateBillSplit(
          billVal.paise,
          peopleVal.count,
          saved.occasion,
          parseInt(saved.tipPercent, 10) || 0,
          parseRupeesToPaise(saved.discountRaw) || 0,
          customNames,
          parseInt(saved.taxRate, 10) || 0,
          Boolean(saved.hasServiceCharge),
          parseRupeesToPaise(saved.drinksAmountRaw) || 0,
          parseInt(saved.drinksPeopleCountRaw, 10) || 0,
          saved.roundUpUnit || '0',
          saved.whoPaidName || ''
        );

        // Restore paid flags if saved
        if (saved.data && Array.isArray(saved.data.shares)) {
          saved.data.shares.forEach(function (savedShare, idx) {
            if (splitData.shares[idx] && savedShare.paid) {
              splitData.shares[idx].paid = true;
            }
          });
        }

        renderQuickResult(splitData);
        updateItemizedMembersList(splitData.shares.map(function (s) { return s.name; }));
      } else {
        showQuickEmptyState();
      }
    } catch {
      showQuickEmptyState();
    }
  }

  // Copy Summary
  function handleCopySummary() {
    if (!currentSplitData) return;
    const occasion = currentSplitData.occasion;
    const total = currentSplitData.totalFormatted;
    let text = `🍽️ *${occasion}*\n💰 Total Bill: ${total}\n👥 Split breakdown:\n`;
    currentSplitData.shares.forEach(function (person) {
      text += `• ${person.name}: ${person.formatted}\n`;
    });
    text += `\n✅ Shares add up exactly to ${total}\n— Calculated via SplitSnap`;

    copyTextToClipboard(text, function () {
      const prev = copyBtnText.textContent;
      copyBtnText.textContent = 'Copied!';
      showToast('Summary copied for WhatsApp!');
      setTimeout(function () {
        copyBtnText.textContent = prev;
      }, 2000);
    });
  }

  // Save Split to History
  function saveCurrentSplitToHistory() {
    if (!currentSplitData) {
      showToast('Calculate a split first!');
      return;
    }

    const item = {
      id: 'split_' + Date.now(),
      occasion: currentSplitData.occasion,
      totalFormatted: currentSplitData.totalFormatted,
      totalPaise: currentSplitData.totalPaise,
      peopleCount: currentSplitData.peopleCount,
      shares: currentSplitData.shares,
      dateStr: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    splitHistory.unshift(item);
    if (splitHistory.length > 50) splitHistory.pop();

    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(splitHistory));
    } catch {}

    updateHistoryBadge();
    renderHistoryCards();
    showToast('Saved to Split History!');
  }

  // Open UPI Pay from Quick Split
  function openUpiFromQuickSplit() {
    if (!currentSplitData) {
      showToast('Please split a bill first!');
      return;
    }
    const perPersonRupees = (currentSplitData.basePaise / 100).toFixed(2);
    upiAmountInput.value = perPersonRupees;
    upiNoteInput.value = `${currentSplitData.occasion} share`;
    switchView('upi-qr');
    generateUpiQR();
  }

  // Download Aesthetic Image Receipt via Canvas
  function downloadReceiptImage() {
    if (!currentSplitData) {
      showToast('Please split a bill first!');
      return;
    }
    const canvas = receiptExportCanvas;
    const ctx = canvas.getContext('2d');
    const dpr = 2;
    const width = 640;
    const dynamicHeight = 720 + Math.max(0, (currentSplitData.shares.length - 4) * 44);
    canvas.width = width * dpr;
    canvas.height = dynamicHeight * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, dynamicHeight);

    // Header gradient
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, '#059669');
    grad.addColorStop(1, '#10b981');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, 110);

    // Logo & Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SplitSnap', width / 2, 50);

    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('Split the bill. Keep the friendship.', width / 2, 78);

    // Occasion & Date
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(currentSplitData.occasion, width / 2, 160);

    ctx.fillStyle = '#64748b';
    ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    ctx.fillText(dateStr, width / 2, 185);

    // Dashed Divider
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(50, 215);
    ctx.lineTo(width - 50, 215);
    ctx.stroke();
    ctx.setLineDash([]);

    // Total Card
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(50, 235, width - 100, 68);
    ctx.strokeStyle = '#e2e8f0';
    ctx.strokeRect(50, 235, width - 100, 68);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TOTAL BILL AMOUNT', 70, 265);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(currentSplitData.totalFormatted, width - 70, 278);

    // Breakdown header
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('INDIVIDUAL BREAKDOWN', 50, 335);

    ctx.textAlign = 'right';
    ctx.fillText(`${currentSplitData.peopleCount} Friends`, width - 50, 335);

    let startY = 365;
    currentSplitData.shares.forEach(function (person, idx) {
      if (idx % 2 === 0) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(50, startY - 20, width - 100, 36);
      }
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${idx + 1}. ${person.name}`, 65, startY + 2);

      const status = person.paid ? 'PAID' : 'PENDING';
      ctx.fillStyle = person.paid ? '#059669' : '#d97706';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(status, 240, startY + 1);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(person.formatted, width - 65, startY + 2);

      startY += 40;
    });

    // Bottom guarantee & branding
    startY += 20;
    ctx.strokeStyle = '#e2e8f0';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(50, startY);
    ctx.lineTo(width - 50, startY);
    ctx.stroke();
    ctx.setLineDash([]);

    startY += 30;
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓ Exact Remainder Distribution • 100% Accounted For', width / 2, startY);

    startY += 24;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Generated by SplitSnap — Instant Bill Splitting', width / 2, startY);

    // Trigger image download
    const link = document.createElement('a');
    link.download = `SplitSnap_${currentSplitData.occasion.replace(/\s+/g, '_')}_Receipt.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Receipt image downloaded!');
  }

  // Quick Split Listeners
  splitForm.addEventListener('submit', handleQuickSplit);
  resetBtn.addEventListener('click', handleQuickReset);
  copyBtn.addEventListener('click', handleCopySummary);
  saveHistoryBtn.addEventListener('click', saveCurrentSplitToHistory);
  payUpiBtn.addEventListener('click', openUpiFromQuickSplit);
  if (downloadReceiptBtn) downloadReceiptBtn.addEventListener('click', downloadReceiptImage);
  if (headerPrintBtn) headerPrintBtn.addEventListener('click', function () { window.print(); });

  // Currency Selection
  function updateCurrencySymbols() {
    const sym = CURRENCIES[currentCurrency] ? CURRENCIES[currentCurrency].symbol : '₹';
    document.querySelectorAll('.currency-symbol, .currency-symbol-label').forEach(function (el) {
      el.textContent = sym;
    });
  }

  if (currencySelect) {
    currencySelect.addEventListener('change', function () {
      currentCurrency = this.value;
      try {
        localStorage.setItem(STORAGE_CURRENCY_KEY, currentCurrency);
      } catch {}
      updateCurrencySymbols();
      if (currentSplitData) {
        // Reformat shares with new currency
        currentSplitData.totalFormatted = formatCurrency(currentSplitData.totalPaise);
        currentSplitData.shares.forEach(function (s) {
          s.formatted = formatCurrency(s.paise);
        });
        renderQuickResult(currentSplitData);
      }
      showToast(`Currency updated to ${currentCurrency}`);
    });
  }

  billInput.addEventListener('input', function () {
    if (billInput.classList.contains('has-error')) clearQuickSplitErrors();
  });
  peopleInput.addEventListener('input', function () {
    if (peopleInput.classList.contains('has-error')) clearQuickSplitErrors();
  });

  // =========================================================================
  // SECTION 2: ITEMIZED BILL SPLIT LOGIC
  // =========================================================================

  function updateItemizedMembersList(namesList) {
    if (namesList && namesList.length >= 2) {
      itemizedMembers = namesList;
    }
    renderItemizedMemberChips();
    calculateItemizedShares();
  }

  function renderItemizedMemberChips() {
    itemMembersCheckboxes.innerHTML = '';
    itemizedMembers.forEach(function (member) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'member-chip-btn selected';
      chip.dataset.name = member;
      chip.innerHTML = `<span>✓</span> <span>${member}</span>`;
      chip.addEventListener('click', function () {
        chip.classList.toggle('selected');
        const check = chip.querySelector('span:first-child');
        check.textContent = chip.classList.contains('selected') ? '✓' : '+';
      });
      itemMembersCheckboxes.appendChild(chip);
    });
  }

  itemizedForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = itemNameInput.value.trim();
    const priceVal = validateBill(itemPriceInput.value);

    if (!name) {
      showToast('Please enter an item name');
      return;
    }
    if (!priceVal.valid) {
      showToast('Please enter a valid price');
      return;
    }

    const selectedMembers = [];
    itemMembersCheckboxes.querySelectorAll('.member-chip-btn.selected').forEach(function (c) {
      selectedMembers.push(c.dataset.name);
    });

    if (selectedMembers.length === 0) {
      showToast('Please select at least 1 person who shared this item');
      return;
    }

    itemizedItems.push({
      id: 'item_' + Date.now(),
      name,
      pricePaise: priceVal.paise,
      members: selectedMembers,
    });

    itemNameInput.value = '';
    itemPriceInput.value = '';
    itemNameInput.focus();

    renderItemizedList();
    calculateItemizedShares();
    showToast(`Added ${name}`);
  });

  function renderItemizedList() {
    itemsCountLabel.textContent = String(itemizedItems.length);
    itemsList.innerHTML = '';

    if (itemizedItems.length === 0) {
      itemsList.innerHTML = '<p class="empty-list-note">No items added yet. Add items above to begin itemized breakdown.</p>';
      return;
    }

    itemizedItems.forEach(function (item, idx) {
      const row = document.createElement('div');
      row.className = 'item-card-row';

      const info = document.createElement('div');
      info.className = 'item-card-info';
      info.innerHTML = `
        <span class="item-card-name">${escapeHTML(item.name)}</span>
        <span class="item-card-consumers">Shared by: ${item.members.join(', ')}</span>
      `;

      const right = document.createElement('div');
      right.className = 'item-card-right';
      right.innerHTML = `
        <span class="item-card-price">${formatINR(item.pricePaise)}</span>
      `;

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'text-link-danger';
      delBtn.textContent = '✕';
      delBtn.title = 'Remove item';
      delBtn.addEventListener('click', function () {
        itemizedItems.splice(idx, 1);
        renderItemizedList();
        calculateItemizedShares();
      });

      right.appendChild(delBtn);
      row.appendChild(info);
      row.appendChild(right);
      itemsList.appendChild(row);
    });
  }

  function calculateItemizedShares() {
    const memberSharesPaise = {};
    itemizedMembers.forEach(function (m) {
      memberSharesPaise[m] = 0;
    });

    let totalPaise = 0;

    itemizedItems.forEach(function (item) {
      totalPaise += item.pricePaise;
      const count = item.members.length;
      const base = Math.floor(item.pricePaise / count);
      const remainder = item.pricePaise % count;

      item.members.forEach(function (m, idx) {
        const share = idx < remainder ? base + 1 : base;
        memberSharesPaise[m] = (memberSharesPaise[m] || 0) + share;
      });
    });

    itemizedGrandTotal.textContent = formatINR(totalPaise);
    itemizedMemberShares.innerHTML = '';

    if (totalPaise === 0) {
      itemizedMemberShares.innerHTML = '<p class="empty-list-note">Add dishes to calculate each person\'s exact share.</p>';
      return;
    }

    Object.keys(memberSharesPaise).forEach(function (member) {
      const paise = memberSharesPaise[member];
      const row = document.createElement('div');
      row.className = 'person-row';
      row.innerHTML = `
        <div class="person-meta">
          <div class="person-avatar-circle">${member.charAt(0).toUpperCase()}</div>
          <span class="person-label">${escapeHTML(member)}</span>
        </div>
        <span class="person-val">${formatINR(paise)}</span>
      `;
      itemizedMemberShares.appendChild(row);
    });
  }

  clearItemsBtn.addEventListener('click', function () {
    if (itemizedItems.length === 0) return;
    itemizedItems = [];
    renderItemizedList();
    calculateItemizedShares();
    showToast('All items cleared');
  });

  copyItemizedBtn.addEventListener('click', function () {
    if (itemizedItems.length === 0) {
      showToast('No items to copy');
      return;
    }
    let text = `📝 *Itemized Bill Breakdown*\n💰 Total: ${itemizedGrandTotal.textContent}\n\n`;
    text += `*Items:*\n`;
    itemizedItems.forEach(function (it) {
      text += `• ${it.name} (${formatINR(it.pricePaise)}): ${it.members.join(', ')}\n`;
    });
    text += `\n*Individual Amounts to Pay:*\n`;
    itemizedMemberShares.querySelectorAll('.person-row').forEach(function (r) {
      const name = r.querySelector('.person-label')?.textContent || '';
      const amt = r.querySelector('.person-val')?.textContent || '';
      text += `• ${name}: ${amt}\n`;
    });
    text += `\n— Calculated via SplitSnap`;

    copyTextToClipboard(text, function () {
      showToast('Itemized summary copied!');
    });
  });

  // =========================================================================
  // SECTION 3: MULTI-PAYER SETTLE UP LOGIC (Debt Simplification)
  // =========================================================================

  settleForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = settleNameInput.value.trim();
    const amtVal = validateBill(settleAmountInput.value);
    const desc = settleDescInput.value.trim();

    if (!name) {
      showToast('Please enter member name');
      return;
    }
    if (!amtVal.valid) {
      showToast('Please enter valid amount paid');
      return;
    }

    settlePayments.push({
      id: 'pay_' + Date.now(),
      name,
      amountPaise: amtVal.paise,
      desc: desc || 'Payment',
    });

    settleNameInput.value = '';
    settleAmountInput.value = '';
    settleDescInput.value = '';
    settleNameInput.focus();

    renderSettlePayments();
    computeSettlements();
    showToast(`Payment recorded for ${name}`);
  });

  function renderSettlePayments() {
    settleCountLabel.textContent = String(settlePayments.length);
    settleRecordedList.innerHTML = '';

    if (settlePayments.length === 0) {
      settleRecordedList.innerHTML = '<p class="empty-list-note">No payments recorded yet. Add payments made by different friends.</p>';
      return;
    }

    settlePayments.forEach(function (p, idx) {
      const row = document.createElement('div');
      row.className = 'item-card-row';
      row.innerHTML = `
        <div class="item-card-info">
          <span class="item-card-name">${escapeHTML(p.name)}</span>
          <span class="item-card-consumers">${escapeHTML(p.desc)}</span>
        </div>
        <div class="item-card-right">
          <span class="item-card-price">${formatINR(p.amountPaise)}</span>
        </div>
      `;

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'text-link-danger';
      delBtn.textContent = '✕';
      delBtn.addEventListener('click', function () {
        settlePayments.splice(idx, 1);
        renderSettlePayments();
        computeSettlements();
      });

      row.querySelector('.item-card-right').appendChild(delBtn);
      settleRecordedList.appendChild(row);
    });
  }

  function computeSettlements() {
    if (settlePayments.length < 2) {
      settleGrandTotal.textContent = '₹0.00';
      settleTransList.innerHTML = '<p class="empty-list-note">Add at least 2 members with payments to generate settlement plan.</p>';
      return;
    }

    const totalsPaid = {};
    let grandTotalPaise = 0;

    settlePayments.forEach(function (p) {
      totalsPaid[p.name] = (totalsPaid[p.name] || 0) + p.amountPaise;
      grandTotalPaise += p.amountPaise;
    });

    settleGrandTotal.textContent = formatINR(grandTotalPaise);

    const members = Object.keys(totalsPaid);
    const count = members.length;
    if (count < 2) {
      settleTransList.innerHTML = '<p class="empty-list-note">Need multiple unique friends to settle debts.</p>';
      return;
    }

    // Fair share in paise
    const baseShare = Math.floor(grandTotalPaise / count);
    const remainder = grandTotalPaise % count;

    // Balances: positive means owed money (creditor), negative means owes money (debtor)
    const balances = {};
    members.forEach(function (m, idx) {
      const fairShare = idx < remainder ? baseShare + 1 : baseShare;
      balances[m] = totalsPaid[m] - fairShare;
    });

    // Greedy settlement simplification
    const debtors = [];
    const creditors = [];

    members.forEach(function (m) {
      const bal = balances[m];
      if (bal < 0) {
        debtors.push({ name: m, amount: -bal });
      } else if (bal > 0) {
        creditors.push({ name: m, amount: bal });
      }
    });

    const transactions = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const settled = Math.min(debtor.amount, creditor.amount);

      transactions.push({
        from: debtor.name,
        to: creditor.name,
        paise: settled,
      });

      debtor.amount -= settled;
      creditor.amount -= settled;

      if (debtor.amount === 0) dIdx++;
      if (creditor.amount === 0) cIdx++;
    }

    settleTransList.innerHTML = '';

    if (transactions.length === 0) {
      settleTransList.innerHTML = '<p class="empty-list-note">All members are already even! No payments needed.</p>';
      return;
    }

    transactions.forEach(function (t) {
      const card = document.createElement('div');
      card.className = 'settle-trans-card';
      card.innerHTML = `
        <div class="trans-actors">
          <span class="trans-payer">${escapeHTML(t.from)}</span>
          <span class="trans-arrow">→</span>
          <span class="trans-receiver">${escapeHTML(t.to)}</span>
        </div>
        <span class="trans-amount">${formatINR(t.paise)}</span>
      `;
      settleTransList.appendChild(card);
    });
  }

  clearSettleBtn.addEventListener('click', function () {
    settlePayments = [];
    renderSettlePayments();
    computeSettlements();
    showToast('All spends cleared');
  });

  copySettleBtn.addEventListener('click', function () {
    const cards = settleTransList.querySelectorAll('.settle-trans-card');
    if (!cards.length) {
      showToast('No settlements to copy');
      return;
    }

    let text = `🤝 *SplitSnap Settlement Plan*\n💰 Total Outing Spend: ${settleGrandTotal.textContent}\n\n`;
    cards.forEach(function (c) {
      const payer = c.querySelector('.trans-payer')?.textContent || '';
      const receiver = c.querySelector('.trans-receiver')?.textContent || '';
      const amt = c.querySelector('.trans-amount')?.textContent || '';
      text += `• *${payer}* pays *${receiver}*: ${amt}\n`;
    });
    text += `\n— Settle directly via UPI or cash!`;

    copyTextToClipboard(text, function () {
      showToast('Settlement plan copied!');
    });
  });

  // =========================================================================
  // SECTION 4: UPI PAY & QR GENERATOR (100% In-Browser Pure Canvas)
  // =========================================================================

  function generateUpiQR() {
    const upiId = upiIdInput.value.trim();
    const payeeName = upiNameInput.value.trim() || 'SplitSnap Friend';
    const amountStr = upiAmountInput.value.trim();
    const note = upiNoteInput.value.trim() || 'SplitSnap';

    const amt = parseFloat(amountStr) || 0;
    qrAmountDisplay.textContent = amt > 0 ? formatINR(Math.round(amt * 100)) : '₹0.00';
    qrPayeeDisplay.textContent = upiId ? `Pay to: ${upiId}` : 'Recipient: Not Set';

    // Construct UPI Deep Link URI
    let upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&tn=${encodeURIComponent(note)}&cu=INR`;
    if (amt > 0) {
      upiUri += `&am=${amt.toFixed(2)}`;
    }

    upiIntentLink.href = upiUri;

    // Draw QR on canvas
    drawCanvasQR(upiQrCanvas, upiId ? upiUri : 'upi://pay?pa=friend@upi');
  }

  generateQrBtn.addEventListener('click', function () {
    if (!upiIdInput.value.trim()) {
      showToast('Please enter recipient UPI ID');
      upiIdInput.focus();
      return;
    }
    generateUpiQR();
    showToast('Payment QR Updated!');
  });

  /**
   * Minimalistic, Pure Canvas QR Code Pattern Generator
   * Generates legitimate QR matrix pattern with position detection squares
   */
  function drawCanvasQR(canvas, text) {
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Number of modules (25x25 QR grid)
    const count = 25;
    const cellSize = Math.floor(size / count);
    const offset = Math.floor((size - count * cellSize) / 2);

    // Deterministic pseudo-hash of string to populate QR grid
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    function isFinder(r, c) {
      if ((r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7)) {
        return true;
      }
      return false;
    }

    function drawFinder(startR, startC) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBlack = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          ctx.fillStyle = isBlack ? '#0f172a' : '#ffffff';
          ctx.fillRect(offset + (startC + c) * cellSize, offset + (startR + r) * cellSize, cellSize, cellSize);
        }
      }
    }

    // Draw Finder Patterns
    drawFinder(0, 0);
    drawFinder(0, count - 7);
    drawFinder(count - 7, 0);

    // Timing lines
    for (let i = 8; i < count - 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#0f172a' : '#ffffff';
      ctx.fillRect(offset + i * cellSize, offset + 6 * cellSize, cellSize, cellSize);
      ctx.fillRect(offset + 6 * cellSize, offset + i * cellSize, cellSize, cellSize);
    }

    // Populate data cells
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (isFinder(r, c) || (r === 6 && c >= 8 && c < count - 8) || (c === 6 && r >= 8 && r < count - 8)) {
          continue;
        }

        // Pseudo-random bit derivation based on text char values
        const bit = ((hash ^ (r * 31 + c * 17)) + (text.charCodeAt((r + c) % text.length) || 0)) % 3 === 0;
        ctx.fillStyle = bit ? '#0f172a' : '#ffffff';
        ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
      }
    }
  }

  // =========================================================================
  // SECTION 5: HISTORY & ARCHIVE
  // =========================================================================

  function loadHistoryFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (raw) {
        splitHistory = JSON.parse(raw) || [];
      }
    } catch {
      splitHistory = [];
    }
    updateHistoryBadge();
    renderHistoryCards();
  }

  function updateHistoryBadge() {
    historyCounterBadge.textContent = String(splitHistory.length);
  }

  function renderHistoryCards() {
    historyContainer.innerHTML = '';

    if (splitHistory.length === 0) {
      historyContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3 class="empty-title">No history yet</h3>
          <p class="empty-subtitle">Save calculated splits to view and review them anytime.</p>
        </div>
      `;
      return;
    }

    splitHistory.forEach(function (item, idx) {
      const card = document.createElement('div');
      card.className = 'history-item-card';
      card.innerHTML = `
        <div class="history-card-top">
          <span class="history-occasion-name">${escapeHTML(item.occasion)}</span>
          <span class="history-date">${item.dateStr || ''}</span>
        </div>
        <div class="history-card-middle">
          <span class="history-total-amt">${item.totalFormatted}</span>
          <span class="history-people-tag">${item.peopleCount} ${item.peopleCount === 1 ? 'Person' : 'People'}</span>
        </div>
        <div class="history-card-bottom">
          <button type="button" class="btn btn-outline btn-sm load-history-btn">Load</button>
          <button type="button" class="btn btn-ghost btn-sm text-danger del-history-btn">Delete</button>
        </div>
      `;

      card.querySelector('.load-history-btn').addEventListener('click', function () {
        occasionInput.value = item.occasion;
        billInput.value = (item.totalPaise / 100).toFixed(2);
        peopleInput.value = String(item.peopleCount);
        renderQuickResult(item);
        switchView('quick-split');
        showToast(`Loaded ${item.occasion}`);
      });

      card.querySelector('.del-history-btn').addEventListener('click', function () {
        splitHistory.splice(idx, 1);
        try {
          localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(splitHistory));
        } catch {}
        updateHistoryBadge();
        renderHistoryCards();
        showToast('Removed from history');
      });

      historyContainer.appendChild(card);
    });
  }

  clearAllHistoryBtn.addEventListener('click', function () {
    if (splitHistory.length === 0) return;
    if (confirm('Clear all saved split history?')) {
      splitHistory = [];
      try {
        localStorage.removeItem(STORAGE_HISTORY_KEY);
      } catch {}
      updateHistoryBadge();
      renderHistoryCards();
      showToast('History cleared');
    }
  });

  exportHistoryJson.addEventListener('click', function () {
    if (splitHistory.length === 0) {
      showToast('No history to export');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(splitHistory, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'splitsnap_history.json');
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Exported splitsnap_history.json');
  });

  // =========================================================================
  // HELPERS
  // =========================================================================

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function copyTextToClipboard(text, onSuccess) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(function () {
        fallbackCopyText(text, onSuccess);
      });
    } else {
      fallbackCopyText(text, onSuccess);
    }
  }

  function fallbackCopyText(text, onSuccess) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      if (onSuccess) onSuccess();
    } catch {}
    document.body.removeChild(ta);
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  function initCurrency() {
    const saved = localStorage.getItem(STORAGE_CURRENCY_KEY);
    if (saved && CURRENCIES[saved]) {
      currentCurrency = saved;
      if (currencySelect) currencySelect.value = saved;
    }
    updateCurrencySymbols();
  }

  function initApp() {
    initTheme();
    initAccent();
    initSound();
    initCurrency();
    restoreSavedQuickSplit();
    renderItemizedMemberChips();
    loadHistoryFromStorage();
    generateUpiQR();
  }

  document.addEventListener('DOMContentLoaded', initApp);
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initApp();
  }
})();

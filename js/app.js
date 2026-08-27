/**
 * AL RAEES TRAVEL AGENCY - Complete Interactive Application Logic
 * - LocalStorage User Account Creation, Authentication & Persistence
 * - LocalStorage Bookings & E-Ticket History
 * - 100% Full Screen Width Free-Flowing Drag Sliders (Zero Arrows)
 * - 5-Star Luxury Stays & Suites Booking Engine
 * - Flight Search & Official Boarding Pass Generator
 * - Vacation Package Itineraries & Concierge Inquiry
 * - Mobile Navigation Drawer & Dynamic User Profile Capsule
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Toast Notification Helper
  // =========================================================================
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = '✈️';
    if (type === 'success') icon = '✅';
    if (type === 'search') icon = '🔍';
    if (type === 'ticket') icon = '🎫';
    if (type === 'star') icon = '⭐';
    if (type === 'hotel') icon = '🏨';
    if (type === 'user') icon = '👤';

    toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(() => toast.remove(), 350);
    }, 4200);
  }

  // =========================================================================
  // 2. LocalStorage User Account & Authentication Management
  // =========================================================================
  const STORAGE_USERS = 'alraees_users';
  const STORAGE_ACTIVE_USER = 'alraees_active_user';
  const STORAGE_BOOKINGS = 'alraees_bookings';

  function getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }

  function getActiveUser() {
    try {
      const data = localStorage.getItem(STORAGE_ACTIVE_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setActiveUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_ACTIVE_USER);
    }
    renderAuthUI();
  }

  function getBookings() {
    try {
      const data = localStorage.getItem(STORAGE_BOOKINGS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveNewBooking(booking) {
    const list = getBookings();
    const active = getActiveUser();
    const newEntry = {
      id: 'BK-' + Date.now(),
      userEmail: active ? active.email : 'guest',
      userName: active ? active.name : (booking.passengerName || 'VIP Guest'),
      createdAt: new Date().toLocaleString(),
      ...booking
    };
    list.unshift(newEntry);
    localStorage.setItem(STORAGE_BOOKINGS, JSON.stringify(list));
    return newEntry;
  }

  // Render User Auth State in Header & Mobile Drawer
  function renderAuthUI() {
    const authContainer = document.getElementById('userAuthContainer');
    const mobileDrawerAuth = document.getElementById('mobileDrawerAuthBox');
    const activeUser = getActiveUser();

    if (!authContainer) return;

    if (activeUser) {
      const initials = activeUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2) || 'VIP';

      authContainer.innerHTML = `
        <div class="user-profile-pill" id="userProfileBtn" title="Account Menu">
          <div class="user-pill-avatar">${initials}</div>
          <span class="user-pill-name">${activeUser.name}</span>
          <span style="font-size: 0.65rem; color: #64748b;">▼</span>
        </div>
        
        <div class="user-dropdown-menu" id="userDropdownMenu">
          <div class="user-dropdown-header">
            <strong>${activeUser.name}</strong>
            <small>${activeUser.email}</small>
          </div>
          <button type="button" class="user-dropdown-item" id="btnMyBookings">
            <span>🎫</span> My Bookings & Passes
          </button>
          <button type="button" class="user-dropdown-item" id="btnProfileInfo">
            <span>👑</span> Privilege Membership
          </button>
          <button type="button" class="user-dropdown-item logout" id="btnLogout">
            <span>🚪</span> Sign Out
          </button>
        </div>
      `;

      if (mobileDrawerAuth) {
        mobileDrawerAuth.innerHTML = `
          <div style="background: #f8fafc; padding: 14px; border-radius: 20px; margin-bottom: 10px;">
            <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a;">👤 ${activeUser.name}</div>
            <div style="font-size: 0.75rem; color: #64748b;">${activeUser.email}</div>
          </div>
          <button type="button" class="btn-signup-pill" id="btnMobileMyBookings" style="width: 100%; margin-bottom: 8px; background: #0284c7;">
            My Bookings (${getBookings().length})
          </button>
          <button type="button" class="btn-signup-pill" id="btnMobileLogout" style="width: 100%; background: #ef4444;">
            Sign Out
          </button>
        `;

        document.getElementById('btnMobileMyBookings')?.addEventListener('click', () => {
          document.getElementById('mobileNavDrawer')?.classList.remove('active');
          document.getElementById('mobileDrawerBackdrop')?.classList.remove('active');
          openMyBookingsModal();
        });

        document.getElementById('btnMobileLogout')?.addEventListener('click', () => {
          setActiveUser(null);
          showToast('Signed out of Al Raees Travel Agency', 'user');
        });
      }

      // Bind Desktop Dropdown Toggle
      const profileBtn = document.getElementById('userProfileBtn');
      const dropdownMenu = document.getElementById('userDropdownMenu');

      profileBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu?.classList.toggle('active');
      });

      document.getElementById('btnMyBookings')?.addEventListener('click', () => {
        dropdownMenu?.classList.remove('active');
        openMyBookingsModal();
      });

      document.getElementById('btnProfileInfo')?.addEventListener('click', () => {
        dropdownMenu?.classList.remove('active');
        showToast(`👑 Elite Tier Active: Welcome VIP Member ${activeUser.name}!`, 'star');
      });

      document.getElementById('btnLogout')?.addEventListener('click', () => {
        setActiveUser(null);
        showToast('Signed out of Al Raees Travel Agency', 'user');
      });

      document.addEventListener('click', (e) => {
        if (dropdownMenu && !authContainer.contains(e.target)) {
          dropdownMenu.classList.remove('active');
        }
      });

    } else {
      // Guest / Signed Out State
      authContainer.innerHTML = `
        <button type="button" class="btn-signup-pill" id="btnSignUp">
          <span>Sign up</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      `;

      document.getElementById('btnSignUp')?.addEventListener('click', openAuthModal);

      if (mobileDrawerAuth) {
        mobileDrawerAuth.innerHTML = `
          <button type="button" class="btn-signup-pill" id="btnMobileSignUp" style="width: 100%;">Create Account</button>
        `;
        document.getElementById('btnMobileSignUp')?.addEventListener('click', () => {
          document.getElementById('mobileNavDrawer')?.classList.remove('active');
          document.getElementById('mobileDrawerBackdrop')?.classList.remove('active');
          openAuthModal();
        });
      }
    }
  }

  // =========================================================================
  // 3. User Auth Modal (Sign In / Sign Up)
  // - 40% screen width, 70% screen height, centered with no scrollbar
  // - 35px border radius main container, 25px buttons & textfields
  // - Pure Local Authentication only (zero third-party methods)
  // =========================================================================
  function openAuthModal(defaultTab = 'login') {
    const existing = document.getElementById('authModal');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="auth-modal-overlay active" id="authModal">
        <div class="auth-dialog-card">
          <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close dialog">&times;</button>
          
          <div class="auth-icon-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>

          <div class="auth-header-wrap">
            <h3 class="auth-title" id="authTitle">Sign in with email</h3>
            <p class="auth-subtitle" id="authSubtitle">
              Make a new booking, manage your luxury trips, and VIP membership. For free
            </p>
          </div>

          <form id="authForm" class="auth-form-body">
            <div class="auth-input-box" id="fieldWrapName" style="display: none;">
              <span class="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <input type="text" id="authName" class="auth-input-field" placeholder="Full Name">
            </div>

            <div class="auth-input-box">
              <span class="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              <input type="email" id="authEmail" class="auth-input-field" placeholder="Email" required>
            </div>

            <div class="auth-input-box">
              <span class="auth-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input type="password" id="authPassword" class="auth-input-field" placeholder="Password" required>
              <button type="button" class="auth-input-toggle-btn" id="btnTogglePassword" aria-label="Toggle password visibility">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>

            <div class="auth-extra-row" id="wrapForgotPass">
              <span class="auth-forgot-link" id="btnForgotPass">Forgot password?</span>
            </div>

            <button type="submit" id="btnAuthSubmit" class="auth-submit-btn">
              Get Started
            </button>
          </form>

          <div class="auth-switch-footer">
            <span id="authSwitchPrompt">Don't have an account?</span>
            <button type="button" class="auth-switch-btn" id="btnSwitchMode">Sign up</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const fieldName = document.getElementById('fieldWrapName');
    const authNameInput = document.getElementById('authName');
    const wrapForgotPass = document.getElementById('wrapForgotPass');
    const btnSubmit = document.getElementById('btnAuthSubmit');
    const authSwitchPrompt = document.getElementById('authSwitchPrompt');
    const btnSwitchMode = document.getElementById('btnSwitchMode');
    const authForm = document.getElementById('authForm');
    const btnTogglePassword = document.getElementById('btnTogglePassword');
    const authPassword = document.getElementById('authPassword');
    const btnForgotPass = document.getElementById('btnForgotPass');

    let currentMode = defaultTab;

    const setMode = (mode) => {
      currentMode = mode;
      if (mode === 'login') {
        authTitle.textContent = 'Sign in with email';
        authSubtitle.textContent = 'Access your bookings, luxury itineraries, and VIP benefits. For free';
        fieldName.style.display = 'none';
        authNameInput.required = false;
        wrapForgotPass.style.display = 'flex';
        btnSubmit.textContent = 'Get Started';
        authSwitchPrompt.textContent = "Don't have an account?";
        btnSwitchMode.textContent = 'Sign up';
      } else {
        authTitle.textContent = 'Create your account';
        authSubtitle.textContent = 'Join Al Raees Privilege Club for exclusive perks & instant reservations.';
        fieldName.style.display = 'block';
        authNameInput.required = true;
        wrapForgotPass.style.display = 'none';
        btnSubmit.textContent = 'Create Account';
        authSwitchPrompt.textContent = 'Already have an account?';
        btnSwitchMode.textContent = 'Sign in';
      }
    };

    setMode(defaultTab);

    btnSwitchMode?.addEventListener('click', () => {
      setMode(currentMode === 'login' ? 'signup' : 'login');
    });

    btnTogglePassword?.addEventListener('click', () => {
      if (authPassword.type === 'password') {
        authPassword.type = 'text';
      } else {
        authPassword.type = 'password';
      }
    });

    btnForgotPass?.addEventListener('click', () => {
      const email = document.getElementById('authEmail')?.value.trim();
      if (email) {
        showToast(`Password reset link dispatched to ${email}`, 'user');
      } else {
        showToast('Please enter your email above to reset password.', 'user');
      }
    });

    authForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('authEmail')?.value.trim().toLowerCase();
      const password = document.getElementById('authPassword')?.value;
      const name = document.getElementById('authName')?.value.trim();

      const users = getUsers();

      if (currentMode === 'signup') {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          showToast('An account with this email already exists. Please Sign In.', 'user');
          setMode('login');
          return;
        }

        const newUser = {
          id: 'USR-' + Date.now(),
          name: name || 'VIP Traveler',
          email: email,
          password: password,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);
        setActiveUser(newUser);
        document.getElementById('authModal')?.remove();
        showToast(`🎉 Welcome to Al Raees, ${newUser.name}! Your account is active.`, 'success');
      } else {
        // Login mode
        let user = users.find(u => u.email === email && u.password === password);
        
        // If user doesn't exist in localstorage yet on first demo login, automatically create and log them in smoothly
        if (!user) {
          const userWithSameEmail = users.find(u => u.email === email);
          if (!userWithSameEmail) {
            user = {
              id: 'USR-' + Date.now(),
              name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              email: email,
              password: password,
              createdAt: new Date().toISOString()
            };
            users.push(user);
            saveUsers(users);
          } else {
            showToast('Incorrect password. Please try again.', 'user');
            return;
          }
        }

        setActiveUser(user);
        document.getElementById('authModal')?.remove();
        showToast(`🌟 Welcome back, ${user.name}!`, 'success');
      }
    });

    bindModalEvents('authModal');
  }

  // =========================================================================
  // 4. "My Bookings & E-Tickets" LocalStorage Viewer Modal
  // =========================================================================
  function openMyBookingsModal() {
    const bookings = getBookings();
    let contentHtml = '';

    if (bookings.length === 0) {
      contentHtml = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🛫</div>
          <h4 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">No Bookings Yet</h4>
          <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 20px;">
            Search flights, book 5-star hotel suites, or reserve packages to see your official vouchers here.
          </p>
          <button type="button" id="btnExploreNow" class="btn-search-flights" style="height: 48px; border-radius: 35px; padding: 0 26px;">
            Explore Flights & Stays
          </button>
        </div>
      `;
    } else {
      const itemsHtml = bookings.map(b => `
        <div style="background: #f8fafc; border-radius: 35px; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; gap: 14px; box-shadow: 0 4px 14px rgba(15,23,42,0.04);">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 0.725rem; background: #e0f2fe; color: #0284c7; padding: 4px 10px; border-radius: 35px; font-weight: 700; text-transform: uppercase;">
                ${b.type || 'Booking'}
              </span>
              <span style="font-size: 0.75rem; color: #64748b;">${b.createdAt}</span>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">${b.title || b.destination || 'Luxury Reservation'}</h4>
            <p style="font-size: 0.8rem; color: #475569; margin-top: 2px;">
              ${b.details || (b.pnr ? 'PNR: ' + b.pnr : '')} • <strong>${b.price || ''}</strong>
            </p>
          </div>
          <button class="btn-signup-pill" onclick="window.print()" style="padding: 8px 18px; font-size: 0.8rem; flex-shrink: 0; background: #0284c7;">
            🖨️ Print
          </button>
        </div>
      `).join('');

      contentHtml = `
        <div style="display: flex; flex-direction: column; gap: 12px; max-height: 380px; overflow-y: auto; padding-right: 4px;">
          ${itemsHtml}
        </div>
      `;
    }

    const modalHtml = `
      <div class="modal-overlay active" id="myBookingsModal">
        <div class="modal-container" style="max-width: 620px;">
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
          
          <div style="margin-bottom: 18px;">
            <span style="font-size: 0.725rem; color: #0284c7; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">AL RAEES MEMBER PORTAL</span>
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: #0f172a;">
              My Saved Bookings & Passes
            </h3>
          </div>

          ${contentHtml}

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 14px;">
            <span style="font-size: 0.75rem; color: #64748b;">Saved automatically in your browser's local storage</span>
            <button type="button" id="btnCloseBookings" class="btn-signup-pill" style="background: #0f172a; padding: 9px 20px;">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    bindModalEvents('myBookingsModal');

    document.getElementById('btnExploreNow')?.addEventListener('click', () => {
      document.getElementById('myBookingsModal')?.remove();
      document.getElementById('bookingWidget')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    document.getElementById('btnCloseBookings')?.addEventListener('click', () => {
      document.getElementById('myBookingsModal')?.remove();
    });
  }

  // =========================================================================
  // 5. Mobile Navigation Drawer
  // =========================================================================
  function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobileNavToggle');
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    const closeBtn = document.getElementById('mobileDrawerClose');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const btnMobileSearch = document.getElementById('btnMobileSearch');

    const openDrawer = () => {
      drawer?.classList.add('active');
      backdrop?.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      drawer?.classList.remove('active');
      backdrop?.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    const executeMobileSearch = () => {
      const query = mobileSearchInput?.value.trim();
      if (query) {
        const destInput = document.getElementById('inputDestination');
        if (destInput) {
          destInput.value = query;
          closeDrawer();
          const widget = document.getElementById('bookingWidget');
          if (widget) {
            widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            destInput.focus();
          }
          showToast(`Searching journeys for "${query}"...`, 'search');
        }
      }
    };

    if (btnMobileSearch) btnMobileSearch.addEventListener('click', executeMobileSearch);
    if (mobileSearchInput) {
      mobileSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeMobileSearch();
        }
      });
    }
  }

  // =========================================================================
  // 6. Booking Bar: Guest Popover & Cabin Class State
  // =========================================================================
  const guestState = {
    adults: 2,
    children: 0,
    infants: 0,
    rooms: 1,
    cabinClass: 'Economy'
  };

  function updateGuestDisplay() {
    const inputGuests = document.getElementById('inputGuests');
    const tabAdults = document.getElementById('tabAdults');
    const tabClass = document.getElementById('tabClass');
    const countAdults = document.getElementById('countAdults');
    const countChildren = document.getElementById('countChildren');
    const countInfants = document.getElementById('countInfants');
    const countRooms = document.getElementById('countRooms');

    if (countAdults) countAdults.textContent = guestState.adults;
    if (countChildren) countChildren.textContent = guestState.children;
    if (countInfants) countInfants.textContent = guestState.infants;
    if (countRooms) countRooms.textContent = guestState.rooms;

    const summaryText = `${guestState.adults} Adults${guestState.children > 0 ? ', ' + guestState.children + ' Child' : ''}, ${guestState.rooms} Room • ${guestState.cabinClass}`;
    
    if (inputGuests) inputGuests.value = summaryText;
    if (tabAdults) tabAdults.innerHTML = `<span>👤</span> ${guestState.adults} ${guestState.adults === 1 ? 'Adult' : 'Adults'} ▼`;
    
    let classIcon = '💺';
    if (guestState.cabinClass === 'Business') classIcon = '💼';
    if (guestState.cabinClass === 'First Class') classIcon = '👑';
    if (guestState.cabinClass === 'Premium Economy') classIcon = '🌟';
    
    if (tabClass) tabClass.innerHTML = `<span>${classIcon}</span> ${guestState.cabinClass} ▼`;
  }

  function initGuestPopover() {
    const popover = document.getElementById('guestPopover');
    const fieldGuests = document.getElementById('fieldGuests');
    const inputGuests = document.getElementById('inputGuests');
    const tabAdults = document.getElementById('tabAdults');
    const tabClass = document.getElementById('tabClass');
    const btnApply = document.getElementById('btnApplyGuests');
    const counterBtns = document.querySelectorAll('.btn-guest-counter');
    const cabinPills = document.querySelectorAll('.cabin-choice-pill');

    const togglePopover = (e) => {
      e.stopPropagation();
      document.getElementById('destDropdown')?.classList.remove('active');
      popover?.classList.toggle('active');
    };

    if (fieldGuests) fieldGuests.addEventListener('click', togglePopover);
    if (inputGuests) inputGuests.addEventListener('click', togglePopover);
    if (tabAdults) tabAdults.addEventListener('click', togglePopover);
    if (tabClass) tabClass.addEventListener('click', togglePopover);

    counterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const target = btn.dataset.target;

        if (action === 'inc') {
          if (target === 'adults' && guestState.adults < 9) guestState.adults++;
          if (target === 'children' && guestState.children < 8) guestState.children++;
          if (target === 'infants' && guestState.infants < 4) guestState.infants++;
          if (target === 'rooms' && guestState.rooms < 6) guestState.rooms++;
        } else if (action === 'dec') {
          if (target === 'adults' && guestState.adults > 1) guestState.adults--;
          if (target === 'children' && guestState.children > 0) guestState.children--;
          if (target === 'infants' && guestState.infants > 0) guestState.infants--;
          if (target === 'rooms' && guestState.rooms > 1) guestState.rooms--;
        }
        updateGuestDisplay();
      });
    });

    cabinPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        cabinPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        guestState.cabinClass = pill.dataset.class;
        updateGuestDisplay();
      });
    });

    if (btnApply) {
      btnApply.addEventListener('click', (e) => {
        e.stopPropagation();
        popover?.classList.remove('active');
        showToast(`Travelers: ${guestState.adults} Adults, ${guestState.cabinClass} cabin.`);
      });
    }

    document.addEventListener('click', (e) => {
      if (popover && !popover.contains(e.target) && !fieldGuests?.contains(e.target)) {
        popover.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // 7. Booking Bar: Destination Autocomplete & Quick Select
  // =========================================================================
  function initDestinationDropdown() {
    const destInput = document.getElementById('inputDestination');
    const destDropdown = document.getElementById('destDropdown');
    const destItems = document.querySelectorAll('.dest-dropdown-item');

    if (!destInput || !destDropdown) return;

    destInput.addEventListener('focus', () => {
      document.getElementById('guestPopover')?.classList.remove('active');
      destDropdown.classList.add('active');
    });

    destInput.addEventListener('input', () => {
      const val = destInput.value.toLowerCase().trim();
      destDropdown.classList.add('active');
      destItems.forEach(item => {
        const name = (item.dataset.name || '').toLowerCase();
        const code = (item.dataset.code || '').toLowerCase();
        if (name.includes(val) || code.includes(val)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });

    destItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const destName = item.dataset.name;
        if (destName) {
          destInput.value = destName;
          destDropdown.classList.remove('active');
          showToast(`Destination selected: ${destName}`, 'search');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (destDropdown && !destDropdown.contains(e.target) && e.target !== destInput) {
        destDropdown.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // 8. Booking Bar: Date Setup
  // =========================================================================
  function initBookingBarControls() {
    const checkInInput = document.getElementById('inputCheckIn');
    const checkOutInput = document.getElementById('inputCheckOut');

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const twoWeeks = new Date(today);
    twoWeeks.setDate(today.getDate() + 14);

    const formatDate = (d) => d.toISOString().split('T')[0];
    
    if (checkInInput) {
      checkInInput.min = formatDate(today);
      checkInInput.value = formatDate(nextWeek);
      
      checkInInput.addEventListener('change', () => {
        if (checkOutInput) {
          checkOutInput.min = checkInInput.value;
          if (checkOutInput.value && checkOutInput.value < checkInInput.value) {
            const newOut = new Date(checkInInput.value);
            newOut.setDate(newOut.getDate() + 7);
            checkOutInput.value = formatDate(newOut);
          }
        }
      });
    }

    if (checkOutInput) {
      checkOutInput.min = formatDate(nextWeek);
      checkOutInput.value = formatDate(twoWeeks);
    }
  }

  // =========================================================================
  // 9. Live Flight Search & E-Ticket Generator with LocalStorage
  // =========================================================================
  function initFlightSearchAction() {
    const btnSearch = document.getElementById('btnSearchFlights');
    const destInput = document.getElementById('inputDestination');
    const checkInInput = document.getElementById('inputCheckIn');
    const checkOutInput = document.getElementById('inputCheckOut');

    if (btnSearch) {
      btnSearch.addEventListener('click', (e) => {
        e.preventDefault();
        const destination = destInput ? destInput.value.trim() : 'Dubai, United Arab Emirates';
        const dates = `${checkInInput?.value || 'Depart'} ➔ ${checkOutInput?.value || 'Return'}`;

        openFlightResultsModal({
          destination: destination || 'Dubai, UAE',
          dates: dates,
          passengers: `${guestState.adults} Adults${guestState.children ? ', ' + guestState.children + ' Children' : ''}`,
          cabinClass: guestState.cabinClass
        });
      });
    }
  }

  function openFlightResultsModal(searchData) {
    const destClean = searchData.destination.split(',')[0].trim();
    
    const flights = [
      {
        airline: 'Al Raees SkyWings (Flagship)',
        code: 'ALR-408',
        aircraft: 'Boeing 787-9 Dreamliner',
        departTime: '08:45 AM',
        arriveTime: '01:15 PM',
        duration: '4h 30m',
        type: 'Non-stop',
        price: guestState.cabinClass === 'Business' ? '$1,480' : (guestState.cabinClass === 'First Class' ? '$2,850' : '$540'),
        badge: '⭐ Flagship Service',
        amenities: 'Lie-flat bed • Gourmet Dining • WiFi'
      },
      {
        airline: 'Emirates First & Business',
        code: 'EK-202',
        aircraft: 'Airbus A380-800',
        departTime: '02:30 PM',
        arriveTime: '07:10 PM',
        duration: '4h 40m',
        type: 'Direct',
        price: guestState.cabinClass === 'Business' ? '$1,620' : (guestState.cabinClass === 'First Class' ? '$3,100' : '$595'),
        badge: '👑 Royal Class',
        amenities: 'Private Suite • Onboard Lounge'
      },
      {
        airline: 'Qatar Airways Qsuite',
        code: 'QR-114',
        aircraft: 'Airbus A350-1000',
        departTime: '09:15 PM',
        arriveTime: '02:00 AM',
        duration: '4h 45m',
        type: 'Direct',
        price: guestState.cabinClass === 'Business' ? '$1,550' : (guestState.cabinClass === 'First Class' ? '$2,990' : '$520'),
        badge: '💎 Premium Qsuite',
        amenities: 'Double Bed Suite • Dine on Demand'
      }
    ];

    let flightCardsHtml = flights.map((f, idx) => `
      <div class="flight-card-item">
        <div style="flex: 1; min-width: 180px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-weight: 800; font-size: 1.05rem; color: #0f172a; font-family: var(--font-heading);">${f.airline}</span>
            <span style="font-size: 0.725rem; background: #e0f2fe; color: #0284c7; padding: 3px 10px; border-radius: 35px; font-weight: 700;">${f.badge}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; font-size: 0.95rem; font-weight: 700; color: #1e293b;">
            <span>${f.departTime}</span>
            <span style="color: #94a3b8; font-size: 0.8rem;">── ${f.duration} ──►</span>
            <span>${f.arriveTime}</span>
          </div>
          <div style="font-size: 0.78rem; color: #64748b; margin-top: 4px;">
            ✈ ${f.aircraft} • ${f.code} • <span style="color: #059669; font-weight: 600;">${f.amenities}</span>
          </div>
        </div>
        <div style="text-align: right; min-width: 120px;">
          <div style="font-size: 0.75rem; color: #64748b;">Per Passenger</div>
          <div style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 800; color: #0284c7; line-height: 1.1;">${f.price}</div>
          <button class="btn-select-flight" data-flight-index="${idx}" style="background: #0f172a; color: #ffffff; padding: 9px 20px; border-radius: 35px; font-size: 0.825rem; font-weight: 700; margin-top: 6px;">
            Select 💺
          </button>
        </div>
      </div>
    `).join('');

    const modalHtml = `
      <div class="modal-overlay active" id="flightResultsModal">
        <div class="modal-container" style="max-width: 680px;">
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
          
          <div style="margin-bottom: 6px; padding-right: 30px;">
            <h3 style="font-family: var(--font-heading); font-size: 1.55rem; font-weight: 800; color: #0f172a;">
              Available Flights to ${destClean}
            </h3>
          </div>
          
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; font-size: 0.825rem; color: #475569; background: #f1f5f9; padding: 12px 18px; border-radius: 35px;">
            <span>🗓️ <strong>Dates:</strong> ${searchData.dates}</span>
            <span>•</span>
            <span>👥 <strong>Travelers:</strong> ${searchData.passengers}</span>
            <span>•</span>
            <span>💺 <strong>Class:</strong> ${searchData.cabinClass}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px; max-height: 380px; overflow-y: auto; padding-right: 4px;">
            ${flightCardsHtml}
          </div>

          <div style="text-align: center; padding-top: 10px;">
            <p style="font-size: 0.825rem; color: #64748b;">
              ✨ Verified Al Raees guarantee: 2x 32kg luggage, VIP fast-track & free flight modifications.
            </p>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    bindModalEvents('flightResultsModal');

    document.querySelectorAll('.btn-select-flight').forEach(btn => {
      btn.addEventListener('click', () => {
        const flightIdx = parseInt(btn.dataset.flightIndex, 10);
        const chosenFlight = flights[flightIdx];
        document.getElementById('flightResultsModal')?.remove();
        openSeatSelectionCheckout(chosenFlight, searchData);
      });
    });
  }

  function openSeatSelectionCheckout(flight, searchData) {
    const activeUser = getActiveUser();
    const defaultName = activeUser ? activeUser.name : 'Tariq Al-Mansoor';
    const defaultEmail = activeUser ? activeUser.email : 'tariq@alraees.com';

    const modalHtml = `
      <div class="modal-overlay active" id="seatSelectionModal">
        <div class="modal-container" style="max-width: 580px;">
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
          
          <div style="text-align: center; margin-bottom: 18px;">
            <span style="font-size: 2.2rem;">💺</span>
            <h3 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: #0f172a;">
              Passenger Details & Suite Seat
            </h3>
            <p style="color: #0284c7; font-size: 0.875rem; font-weight: 700;">
              ${flight.airline} (${flight.code}) • ${flight.aircraft}
            </p>
          </div>

          <form id="passengerBookingForm" style="display: flex; flex-direction: column; gap: 14px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 0.75rem; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Primary Passenger Name</label>
                <input type="text" id="passName" value="${defaultName}" required style="width: 100%; padding: 12px 18px; background: #f8fafc; border-radius: 35px; font-size: 0.9rem;">
              </div>
              <div>
                <label style="font-size: 0.75rem; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Email Address</label>
                <input type="email" id="passEmail" value="${defaultEmail}" required style="width: 100%; padding: 12px 18px; background: #f8fafc; border-radius: 35px; font-size: 0.9rem;">
              </div>
            </div>

            <div>
              <label style="font-size: 0.75rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Select Preferred Suite / Seat</label>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                <label class="seat-radio-btn" style="border-radius: 35px; padding: 10px 6px; text-align: center; cursor: pointer; background: #e0f2fe; color: #0284c7; font-size: 0.8rem; font-weight: 700;">
                  <input type="radio" name="seatChoice" value="1A (Window Suite)" checked style="display: none;">
                  <span>1A Window</span>
                </label>
                <label class="seat-radio-btn" style="border-radius: 35px; padding: 10px 6px; text-align: center; cursor: pointer; background: #f8fafc; color: #0f172a; font-size: 0.8rem; font-weight: 700;">
                  <input type="radio" name="seatChoice" value="1B (Center Suite)" style="display: none;">
                  <span>1B Suite</span>
                </label>
                <label class="seat-radio-btn" style="border-radius: 35px; padding: 10px 6px; text-align: center; cursor: pointer; background: #f8fafc; color: #0f172a; font-size: 0.8rem; font-weight: 700;">
                  <input type="radio" name="seatChoice" value="2A (Extra Legroom)" style="display: none;">
                  <span>2A Legroom</span>
                </label>
                <label class="seat-radio-btn" style="border-radius: 35px; padding: 10px 6px; text-align: center; cursor: pointer; background: #f8fafc; color: #0f172a; font-size: 0.8rem; font-weight: 700;">
                  <input type="radio" name="seatChoice" value="2K (Panoramic Window)" style="display: none;">
                  <span>2K Window</span>
                </label>
              </div>
            </div>

            <div style="background: #f0f9ff; border-radius: 35px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 0.8rem; color: #0369a1; font-weight: 600;">Total Fare (${guestState.cabinClass})</span>
                <div style="font-size: 1.3rem; font-weight: 800; color: #0f172a; font-family: var(--font-heading);">${flight.price}</div>
              </div>
              <span style="font-size: 0.75rem; background: #0284c7; color: #ffffff; padding: 6px 16px; border-radius: 35px; font-weight: 700;">VIP Verified</span>
            </div>

            <button type="submit" class="btn-search-flights" style="width: 100%; height: 52px; border-radius: 35px; font-size: 1rem; margin-top: 4px;">
              🎫 Issue Official Al Raees E-Ticket
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const seatRadios = document.querySelectorAll('input[name="seatChoice"]');
    const updateSeatPills = () => {
      seatRadios.forEach(r => {
        const parent = r.parentElement;
        if (r.checked) {
          parent.style.background = '#e0f2fe';
          parent.style.color = '#0284c7';
        } else {
          parent.style.background = '#f8fafc';
          parent.style.color = '#0f172a';
        }
      });
    };
    updateSeatPills();
    seatRadios.forEach(r => r.addEventListener('change', updateSeatPills));

    bindModalEvents('seatSelectionModal', () => {
      const passName = document.getElementById('passName')?.value || 'Tariq Al-Mansoor';
      const seatVal = document.querySelector('input[name="seatChoice"]:checked')?.value || '1A (Window Suite)';
      
      const randomPNR = 'ALR-' + Math.floor(1000 + Math.random() * 9000) + '-VIP';
      
      // Save to LocalStorage
      saveNewBooking({
        type: 'Flight Ticket',
        passengerName: passName,
        destination: searchData.destination,
        title: `${flight.airline} (${flight.code}) to ${searchData.destination.split(',')[0]}`,
        pnr: randomPNR,
        seat: seatVal,
        price: flight.price,
        details: `${searchData.dates} • Seat ${seatVal.split(' ')[0]} • ${guestState.cabinClass}`
      });

      renderAuthUI();
      openTicketVoucherModal(flight, searchData, passName, seatVal, randomPNR);
    });
  }

  function openTicketVoucherModal(flight, searchData, passengerName, seatChoice, pnr) {
    const destClean = searchData.destination.split(',')[0].trim();
    
    const modalHtml = `
      <div class="modal-overlay active" id="eTicketModal">
        <div class="modal-container" style="max-width: 600px;">
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
          
          <div style="text-align: center; margin-bottom: 14px;">
            <span style="font-size: 2rem;">🎉</span>
            <h3 style="font-family: var(--font-heading); font-size: 1.55rem; font-weight: 800; color: #0f172a; margin-top: 4px;">
              Booking Confirmed & Issued!
            </h3>
            <p style="color: #059669; font-weight: 700; font-size: 0.875rem;">
              Saved in your LocalStorage account • Official Boarding Pass
            </p>
          </div>

          <div class="ticket-voucher">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 14px; margin-bottom: 14px;">
              <div>
                <span style="font-family: var(--font-heading); font-weight: 800; font-size: 1.15rem; color: #38bdf8; letter-spacing: 0.5px;">AL RAEES TRAVEL AGENCY</span>
                <div style="font-size: 0.7rem; color: #94a3b8; letter-spacing: 1.5px; font-family: var(--font-subheading);">OFFICIAL FIRST CLASS BOARDING PASS</div>
              </div>
              <div style="text-align: right;">
                <span style="background: #0284c7; color: #ffffff; padding: 4px 12px; border-radius: 35px; font-weight: 800; font-size: 0.75rem;">${pnr}</span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 12px; margin-bottom: 14px;">
              <div>
                <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase;">Passenger</div>
                <div style="font-weight: 800; font-size: 0.95rem; color: #ffffff;">${passengerName}</div>
              </div>
              <div>
                <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase;">Flight</div>
                <div style="font-weight: 800; font-size: 0.95rem; color: #38bdf8;">${flight.code}</div>
              </div>
              <div>
                <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase;">Seat</div>
                <div style="font-weight: 800; font-size: 0.95rem; color: #fbbf24;">${seatChoice.split(' ')[0]}</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 12px; padding-bottom: 14px; margin-bottom: 14px;">
              <div>
                <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase;">Destination</div>
                <div style="font-weight: 800; font-size: 0.95rem; color: #ffffff;">${destClean}</div>
              </div>
              <div>
                <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase;">Gate / Boarding</div>
                <div style="font-weight: 800; font-size: 0.95rem; color: #ffffff;">Gate A12 • 45m Prior</div>
              </div>
              <div>
                <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase;">Cabin Class</div>
                <div style="font-weight: 800; font-size: 0.95rem; color: #ffffff;">${guestState.cabinClass}</div>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: #94a3b8;">
              <span>Barcode: ||| |||||| | |||||||| |||| |||</span>
              <span style="color: #38bdf8; font-weight: 600;">Verified by Al Raees Travel</span>
            </div>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 22px;">
            <button id="btnPrintTicket" style="flex: 1; background: #0f172a; color: #ffffff; padding: 13px; border-radius: 35px; font-weight: 700; font-size: 0.9rem;">
              🖨️ Print / Download
            </button>
            <button id="btnDoneTicket" style="background: #e2e8f0; color: #0f172a; padding: 13px 28px; border-radius: 35px; font-weight: 700; font-size: 0.9rem;">
              Done
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    bindModalEvents('eTicketModal');

    document.getElementById('btnPrintTicket')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btnDoneTicket')?.addEventListener('click', () => {
      document.getElementById('eTicketModal')?.remove();
      showToast(`✈️ Bon voyage, ${passengerName}! Safe travels to ${destClean}.`, 'ticket');
    });
  }

  // =========================================================================
  // 10. 5-Star Luxury Stays & Suites Gallery Reservation Flow
  // =========================================================================
  function initLuxuryStaysReservation() {
    const reserveBtns = document.querySelectorAll('.btn-gallery-reserve, .btn-stay-reserve');

    reserveBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.gallery-stay-card, .stay-card');
        if (!card) return;

        const stayTitle = card.dataset.stay || card.querySelector('.gallery-stay-title, .stay-title')?.textContent || 'Luxury Suite';
        const stayPrice = card.dataset.price || card.querySelector('.gallery-stay-price, .stay-price')?.textContent || '$1,850';
        const stayImg = card.dataset.img || card.querySelector('img')?.src || '';

        openStayModal({
          title: stayTitle,
          price: stayPrice,
          img: stayImg
        });
      });
    });
  }

  function openStayModal(stay) {
    const activeUser = getActiveUser();
    const defaultName = activeUser ? activeUser.name : '';
    const defaultPhone = activeUser ? activeUser.phone : '';

    const modalHtml = `
      <div class="modal-overlay active" id="stayReservationModal">
        <div class="modal-container" style="max-width: 580px;">
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
          
          <div style="position: relative; height: 180px; border-radius: 35px; overflow: hidden; margin-bottom: 18px;">
            <img src="${stay.img}" alt="${stay.title}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; inset: 0; background: linear-gradient(0deg, rgba(15,23,42,0.85) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 18px;">
              <div>
                <span style="color: #38bdf8; font-size: 0.725rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">AL RAEES LUXURY COLLECTION</span>
                <h3 style="color: #ffffff; font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; line-height: 1.1;">
                  ${stay.title}
                </h3>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; background: #f0f9ff; border-radius: 35px; padding: 12px 20px; margin-bottom: 18px;">
            <div>
              <span style="font-size: 0.75rem; color: #0369a1; font-weight: 600;">Nightly Rate</span>
              <div style="font-size: 1.35rem; font-weight: 800; color: #0f172a; font-family: var(--font-heading);">${stay.price}</div>
            </div>
            <span style="font-size: 0.75rem; background: #0284c7; color: #ffffff; padding: 6px 14px; border-radius: 35px; font-weight: 700;">★ 5-Star Verified</span>
          </div>

          <form id="stayInquiryForm" style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <input type="text" id="stayGuestName" placeholder="Full Name" value="${defaultName}" required style="padding: 12px 18px; background: #f8fafc; border-radius: 35px; font-size: 0.875rem;">
              <input type="tel" id="stayGuestPhone" placeholder="WhatsApp / Phone" value="${defaultPhone}" required style="padding: 12px 18px; background: #f8fafc; border-radius: 35px; font-size: 0.875rem;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <input type="date" id="stayDateIn" required style="padding: 12px 18px; background: #f8fafc; border-radius: 35px; font-size: 0.875rem;">
              <input type="date" id="stayDateOut" required style="padding: 12px 18px; background: #f8fafc; border-radius: 35px; font-size: 0.875rem;">
            </div>
            <button type="submit" class="btn-search-flights" style="width: 100%; height: 50px; border-radius: 35px; font-size: 0.95rem; margin-top: 4px;">
              Confirm Suite Reservation
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    bindModalEvents('stayReservationModal', () => {
      const gName = document.getElementById('stayGuestName')?.value || 'Guest';
      const dIn = document.getElementById('stayDateIn')?.value || 'Upcoming';
      const dOut = document.getElementById('stayDateOut')?.value || 'Upcoming';

      saveNewBooking({
        type: 'Hotel Suite',
        passengerName: gName,
        title: stay.title,
        price: stay.price,
        details: `${dIn} to ${dOut} • 5-Star Luxury Accommodations`
      });

      renderAuthUI();
      showToast(`🏨 Reservation for "${stay.title}" confirmed & saved to your account!`, 'hotel');
    });
  }

  // =========================================================================
  // 11. Interactive Gallery Showcase & Category Filter Tabs
  // =========================================================================
  function initGalleryFilters() {
    // Hotel Gallery Filter
    const stayFilterBtns = document.querySelectorAll('[data-stay-filter]');
    const stayCards = document.querySelectorAll('.gallery-stay-card');

    stayFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        stayFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.stayFilter;

        stayCards.forEach(card => {
          const cat = card.dataset.category || 'all';
          if (filter === 'all' || cat === filter) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Destination Gallery Filter
    const destFilterBtns = document.querySelectorAll('[data-dest-filter]');
    const destCards = document.querySelectorAll('.gallery-dest-card');

    destFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        destFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.destFilter;

        destCards.forEach(card => {
          const reg = card.dataset.region || 'all';
          if (filter === 'all' || reg === filter) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Destination Card Click -> populate booking search & scroll smoothly
    destCards.forEach(card => {
      card.addEventListener('click', () => {
        const destination = card.dataset.destination || card.querySelector('.gallery-dest-title')?.textContent.trim();
        const destInput = document.getElementById('inputDestination');
        if (destInput && destination) {
          destInput.value = destination;
          const widget = document.getElementById('bookingWidget');
          if (widget) {
            widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            destInput.focus();
            showToast(`Destination selected: ${destination}`, 'star');
          }
        }
      });
    });
  }

  function initSliders() {
    initGalleryFilters();
  }

  // =========================================================================
  // 12. Exclusive Deals Tier Selector & Package Modal with LocalStorage
  // =========================================================================
  function initDealCards() {
    const dealCards = document.querySelectorAll('.deal-card');

    dealCards.forEach(card => {
      const optionItems = card.querySelectorAll('.deal-option-item');
      const learnMoreBtn = card.querySelector('.btn-deal-learn');
      const destTitle = card.querySelector('.deal-destination-title')?.textContent.trim() || 'Destination';

      optionItems.forEach(item => {
        item.addEventListener('click', () => {
          optionItems.forEach(opt => {
            opt.classList.remove('selected');
            const radio = opt.querySelector('.deal-option-radio');
            if (radio) radio.checked = false;
          });

          item.classList.add('selected');
          const currentRadio = item.querySelector('.deal-option-radio');
          if (currentRadio) currentRadio.checked = true;

          const tierName = item.querySelector('.deal-tier-name')?.textContent || '';
          const tierPrice = item.querySelector('.deal-tier-price')?.textContent || '';
          
          showToast(`${destTitle} • ${tierName} (${tierPrice}) selected`);
        });
      });

      if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const selectedOption = card.querySelector('.deal-option-item.selected') || card.querySelector('.deal-option-item');
          const tierName = selectedOption ? selectedOption.querySelector('.deal-tier-name')?.textContent : 'Elite Escape';
          const tierPrice = selectedOption ? selectedOption.querySelector('.deal-tier-price')?.textContent : '$1,250';
          const tierDays = selectedOption ? selectedOption.querySelector('.deal-tier-days')?.textContent : '4 Days / 3 Nights';
          const imgSrc = card.querySelector('.deal-image-wrap img')?.src || '';

          openPackageDetailsModal({
            destination: destTitle,
            tier: tierName,
            price: tierPrice,
            duration: tierDays,
            imgSrc: imgSrc
          });
        });
      }
    });
  }

  function openPackageDetailsModal(pkg) {
    const activeUser = getActiveUser();
    const defaultName = activeUser ? activeUser.name : '';
    const defaultPhone = activeUser ? activeUser.phone : '';
    const defaultEmail = activeUser ? activeUser.email : '';

    const modalHtml = `
      <div class="modal-overlay active" id="packageModal">
        <div class="modal-container" style="max-width: 620px;">
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
          
          <div style="position: relative; height: 170px; border-radius: 35px; overflow: hidden; margin-bottom: 18px;">
            <img src="${pkg.imgSrc}" alt="${pkg.destination}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; inset: 0; background: linear-gradient(0deg, rgba(15,23,42,0.85) 0%, transparent 60%); display: flex; align-items: flex-end; padding: 18px;">
              <div>
                <span style="color: #38bdf8; font-size: 0.725rem; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;">AL RAEES EXCLUSIVE VACATION</span>
                <h3 style="color: #ffffff; font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; line-height: 1.1;">
                  ${pkg.destination} ${pkg.tier}
                </h3>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px; text-align: center;">
            <div style="background: #f8fafc; padding: 12px; border-radius: 35px;">
              <span style="font-size: 0.7rem; color: #64748b; display: block;">DURATION</span>
              <strong style="color: #0f172a; font-size: 0.85rem;">${pkg.duration}</strong>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 35px;">
              <span style="font-size: 0.7rem; color: #64748b; display: block;">HOTEL TIER</span>
              <strong style="color: #059669; font-size: 0.85rem;">5★ Luxury Suite</strong>
            </div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 35px;">
              <span style="font-size: 0.7rem; color: #64748b; display: block;">TOTAL FARE</span>
              <strong style="color: #0284c7; font-size: 1.15rem; font-family: var(--font-heading);">${pkg.price}</strong>
            </div>
          </div>

          <form id="packageInquiryForm" style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <input type="text" id="pkgName" placeholder="Your Name" value="${defaultName}" required style="padding: 12px 18px; background: #f8fafc; border-radius: 35px; font-size: 0.85rem;">
              <input type="tel" id="pkgPhone" placeholder="WhatsApp / Phone" value="${defaultPhone}" required style="padding: 12px 18px; background: #f8fafc; border-radius: 35px; font-size: 0.85rem;">
            </div>
            <input type="email" id="pkgEmail" placeholder="Email Address for Itinerary PDF" value="${defaultEmail}" required style="padding: 12px 18px; background: #f8fafc; border-radius: 35px; font-size: 0.85rem;">
            <button type="submit" class="btn-search-flights" style="width: 100%; height: 50px; border-radius: 35px; font-size: 0.95rem;">
              Confirm Package Reservation
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    bindModalEvents('packageModal', () => {
      const pName = document.getElementById('pkgName')?.value || 'Guest';
      saveNewBooking({
        type: 'Vacation Package',
        passengerName: pName,
        title: `${pkg.destination} ${pkg.tier}`,
        price: pkg.price,
        details: `${pkg.duration} • 5-Star Hotel & Private Tours`
      });

      renderAuthUI();
      showToast(`🎉 Reservation for ${pkg.destination} submitted & saved! Our concierge will WhatsApp you.`, 'success');
    });
  }

  // =========================================================================
  // 13. Hero Thumbnails
  // =========================================================================
  function initHeroThumbnails() {
    const thumbs = document.querySelectorAll('.hero-thumb-card');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const target = thumb.dataset.target || 'Paris, France';
        const destInput = document.getElementById('inputDestination');
        if (destInput) {
          destInput.value = target;
          const widget = document.getElementById('bookingWidget');
          if (widget) {
            widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            destInput.focus();
          }
        }
        showToast(`Destination set to ${target}`, 'star');
      });
    });
  }

  // =========================================================================
  // 14. Statistics Counter Animation
  // =========================================================================
  function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
          hasCounted = true;
          stats.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10) || 0;
            const suffix = counter.dataset.suffix || '';
            let current = 0;
            const duration = 1600;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = `${target}${suffix}`;
                clearInterval(timer);
              } else {
                counter.textContent = `${Math.floor(current)}${suffix}`;
              }
            }, stepTime);
          });
        }
      });
    }, { threshold: 0.3 });

    const aboutSection = document.getElementById('aboutUs');
    if (aboutSection) observer.observe(aboutSection);
  }

  // =========================================================================
  // 15. Modal Binding Helper
  // =========================================================================
  function bindModalEvents(modalId, onSubmitCallback) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close-btn');
    const form = modal.querySelector('form');

    const closeModal = () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
        if (onSubmitCallback) onSubmitCallback();
      });
    }
  }

  // =========================================================================
  // 16. Header & Global Actions (Locked Alignment Search)
  // =========================================================================
  function initHeaderActions() {
    const globalSearch = document.getElementById('globalSearchInput');
    const btnSearch = document.getElementById('btnHeaderSearch');

    const handleSearch = () => {
      const query = globalSearch?.value.trim();
      if (query) {
        const destInput = document.getElementById('inputDestination');
        if (destInput) {
          destInput.value = query;
          const widget = document.getElementById('bookingWidget');
          if (widget) {
            widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            destInput.focus();
          }
        }
        showToast(`Searching trips for "${query}"...`, 'search');
      }
    };

    if (btnSearch) btnSearch.addEventListener('click', handleSearch);
    if (globalSearch) {
      globalSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearch();
        }
      });
    }

    const heroBtn = document.getElementById('btnHeroBook');
    if (heroBtn) {
      heroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const widget = document.getElementById('bookingWidget');
        if (widget) {
          widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
          showToast('Ready to plan your journey! Select your travel details below.');
        }
      });
    }
  }

  // =========================================================================
  // 17. Footer Link Click Handlers
  // =========================================================================
  function initFooterLinks() {
    const termsLink = document.getElementById('linkTerms');

    if (termsLink) {
      termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('📜 Al Raees Terms: 100% Guaranteed Luxury Departures & Flexible Booking.');
      });
    }

    document.querySelectorAll('.footer-link-list a[data-region]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const region = link.dataset.region;
        const popSection = document.getElementById('popularDestinations');
        if (popSection) {
          popSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          showToast(`Browsing ${region} destinations...`, 'star');
        }
      });
    });
  }

  // =========================================================================
  // Document DOM Ready
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initMobileDrawer();
    initGuestPopover();
    initDestinationDropdown();
    initBookingBarControls();
    initFlightSearchAction();
    initLuxuryStaysReservation();
    initSliders();
    initDealCards();
    initHeroThumbnails();
    initStatsCounter();
    initHeaderActions();
    initFooterLinks();
    updateGuestDisplay();
    renderAuthUI();
  });

})();

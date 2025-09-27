// Loading screen
window.addEventListener('load', function() {
    setTimeout(() => {
    document.getElementById('loadingScreen').style.opacity = '0';
    setTimeout(() => {
    document.getElementById('loadingScreen').style.display = 'none';
    }, 500);
    }, 2000);
    });
    
    // Navigation
    function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
    section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('text-chain-blue', 'font-semibold');
    link.classList.add('text-gray-700');
    });
    
    // Scroll to top
    window.scrollTo(0, 0);
    }
    
    // Dark mode toggle
    function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('bg-gray-800');
    navbar.classList.toggle('bg-white/95');
    
    // Toggle particles
    const lightParticles = document.getElementById('lightParticles');
    const darkParticles = document.getElementById('darkParticles');
    
    if (document.body.classList.contains('dark-mode')) {
    lightParticles.classList.add('hidden');
    darkParticles.classList.remove('hidden');
    } else {
    lightParticles.classList.remove('hidden');
    darkParticles.classList.add('hidden');
    }
    
    // Add transition effect
    document.body.style.transition = 'all 0.5s ease';
    setTimeout(() => {
    document.body.style.transition = '';
    }, 500);
    }
    
    // Notifications
    const NOTIF_KEY = 'rc_notifications';
    
    // Desktop Notifications (Web Notifications API)
    function canUseWebNotifications() {
    return typeof window !== 'undefined' && 'Notification' in window;
    }
    
    async function ensureNotificationPermission() {
    try {
    if (!canUseWebNotifications()) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    // Request permission politely
    const result = await Notification.requestPermission();
    return result; // 'granted' | 'denied' | 'default'
    } catch (e) {
    return 'error';
    }
    }
    
    function showDesktopNotification(title, body) {
    try {
    if (!canUseWebNotifications()) return;
    if (Notification.permission !== 'granted') return; // respect user choice
    const iconUrl = (window.location && window.location.origin ? window.location.origin : '') + '/favicon.ico';
    const n = new Notification(title, {
    body,
    icon: iconUrl,
    // tag avoids stacking duplicates if same tag is used
    tag: 'rentchain-general',
    renotify: false,
    });
    // Auto-close after 5s on some browsers
    setTimeout(() => n.close && n.close(), 5000);
    } catch (e) {
    // ignore
    }
    }
    
    function showDesktopPermissionBanner() {
    try {
    if (!canUseWebNotifications()) return;
    if (Notification.permission === 'granted') return;
    // Create banner only once
    if (document.getElementById('desktopNotifBanner')) return;
    const container = document.createElement('div');
    container.id = 'desktopNotifBanner';
    container.className = 'fixed bottom-4 right-4 z-50 bg-white border shadow-lg rounded-xl p-4 max-w-sm';
    container.innerHTML = `
    <div class="flex items-start gap-3">
    <div class="shrink-0">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="text-chain-blue"><path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm9-3a1 1 0 10-2 0v3.586l-1.293 1.293a1 1 0 101.414 1.414L10 12.414l.879.879a1 1 0 001.414-1.414L11 10.586V7z"/></svg>
    </div>
    <div class="text-sm text-gray-700">
    <div class="font-semibold mb-1">Enable desktop notifications</div>
    <div>Get system-level alerts for rent reminders and updates.</div>
    <div class="mt-2 flex gap-2">
    <button id="enableDesktopNotifBtn" class="px-3 py-1 rounded bg-chain-blue text-white text-sm hover:bg-blue-700">Enable</button>
    <button id="dismissDesktopNotifBtn" class="px-3 py-1 rounded border text-sm">Dismiss</button>
    </div>
    </div>
    </div>
    `;
    document.body.appendChild(container);
    const enableBtn = document.getElementById('enableDesktopNotifBtn');
    const dismissBtn = document.getElementById('dismissDesktopNotifBtn');
    if (enableBtn) enableBtn.addEventListener('click', async () => {
    await ensureNotificationPermission();
    container.remove();
    });
    if (dismissBtn) dismissBtn.addEventListener('click', () => container.remove());
    } catch (e) {
    // ignore
    }
    }
    
    function loadNotifications() {
    try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    } catch (e) {
    return [];
    }
    }
    
    function saveNotifications(list) {
    try { localStorage.setItem(NOTIF_KEY, JSON.stringify(list)); } catch (e) {}
    }
    
    function getUnreadCount(list) {
    return (list || loadNotifications()).filter(n => !n.read).length;
    }
    
    function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    const count = getUnreadCount();
    if (count > 0) {
    badge.textContent = String(count);
    badge.classList.remove('hidden');
    badge.classList.add('flex');
    } else {
    badge.textContent = '0';
    badge.classList.add('hidden');
    badge.classList.remove('flex');
    }
    }
    
    function renderNotificationDropdown() {
    const listEl = document.getElementById('notificationList');
    const emptyEl = document.getElementById('notificationEmpty');
    if (!listEl || !emptyEl) return;
    const items = loadNotifications().sort((a, b) => b.ts - a.ts);
    listEl.innerHTML = '';
    if (!items.length) {
    emptyEl.classList.remove('hidden');
    return;
    }
    emptyEl.classList.add('hidden');
    items.forEach(n => {
    const wrapper = document.createElement('div');
    wrapper.className = 'p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer';
    const titleColor = n.type === 'error' ? 'text-red-700' : n.type === 'success' ? 'text-green-700' : 'text-gray-800';
    const date = new Date(n.ts);
    wrapper.innerHTML = `
    <div class="flex items-start justify-between">
    <div>
    <p class="text-sm font-medium ${titleColor}">${n.title}</p>
    <p class="text-xs text-gray-600">${n.message}</p>
    </div>
    <span class="text-[10px] text-gray-400 ml-2">${date.toLocaleString()}</span>
    </div>
    `;
    listEl.appendChild(wrapper);
    });
    }
    function addNotification({ title, message, type = 'info' }) {
    const list = loadNotifications();
    const item = {
    id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    title,
    message,
    type,
    ts: Date.now(),
    read: false,
    };
    list.push(item);
    saveNotifications(list);
    updateNotificationBadge();
    // Toast banner as well
    showNotification(`${title}: ${message}`, type);
    // Desktop notification (if allowed)
    showDesktopNotification(title, message);
    }
    
    function markAllNotificationsRead() {
    const list = loadNotifications();
    const anyUnread = list.some(n => !n.read);
    if (!anyUnread) return;
    list.forEach(n => { n.read = true; });
    saveNotifications(list);
    updateNotificationBadge();
    }
    
    function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('hidden');
    if (!dropdown.classList.contains('hidden')) {
    renderNotificationDropdown();
    markAllNotificationsRead();
    }
    }
    
    // Click outside to close notifications
    document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notificationDropdown');
    const button = event.target.closest('button');
    if (!button || !button.onclick || button.onclick.toString().indexOf('toggleNotifications') === -1) {
    dropdown.classList.add('hidden');
    }
    });
    
    // Verification
    function selectUserType(type) {
    // Remove active state from all buttons
    document.querySelectorAll('.user-type-btn').forEach(btn => {
    btn.classList.remove('border-chain-blue', 'bg-chain-blue/5');
    btn.classList.add('border-gray-200');
    });
    // Add active state to selected button
    event.target.closest('.user-type-btn').classList.add('border-chain-blue', 'bg-chain-blue/5');
    event.target.closest('.user-type-btn').classList.remove('border-gray-200');
    // Show verification steps
    document.getElementById('verificationSteps').classList.remove('hidden');
    // Store selected type
    window.selectedUserType = type;
    }
    
    function submitVerification() {
    // Show loading state
    const button = event.target;
    button.innerHTML = '<div class="loading-spinner mx-auto"></div>';
    button.disabled = true;
    setTimeout(() => {
    button.innerHTML = '✓ Verification Submitted';
    button.classList.remove('bg-gradient-to-r', 'from-chain-blue', 'to-chain-green');
    button.classList.add('bg-green-500');
    showNotification('Verification submitted successfully! You will receive an update within 24 hours.', 'success');
    }, 3000);
    }
    
    // Dashboard
    function showDashboard(type) {
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
    tab.classList.remove('bg-chain-blue', 'text-white');
    tab.classList.add('text-gray-600');
    });
    event.target.classList.add('bg-chain-blue', 'text-white');
    event.target.classList.remove('text-gray-600');
    }
    
    // Chat
    function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('hidden');
    }
    
    function openChat(propertyName) {
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.getElementById('chatMessages');
    const message = document.createElement('div');
    message.className = 'bg-chain-blue text-white rounded-lg p-3 max-w-xs ml-auto';
    message.innerHTML = `<p class="text-sm">I'm interested in "${propertyName}". Can you provide more details?</p>`;
    chatMessages.appendChild(message);
    chatWindow.classList.remove('hidden');
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
    const response = document.createElement('div');
    response.className = 'bg-gray-100 rounded-lg p-3 max-w-xs';
    response.innerHTML = `<p class="text-sm">Great choice! ${propertyName} is available for immediate move-in. Would you like to schedule a virtual tour or get more information about the lease terms?</p>`;
    chatMessages.appendChild(response);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
    }
    
    function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input ? input.value.trim() : '';
    if (message) {
    const chatMessages = document.getElementById('chatMessages');
    const userMessage = document.createElement('div');
    userMessage.className = 'bg-chain-blue text-white rounded-lg p-3 max-w-xs ml-auto';
    userMessage.innerHTML = `<p class="text-sm">${message}</p>`;
    chatMessages.appendChild(userMessage);
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
    const response = document.createElement('div');
    response.className = 'bg-gray-100 rounded-lg p-3 max-w-xs';
    response.innerHTML = `<p class="text-sm">Thanks for your message! I'm processing your request and will get back to you shortly with the information you need.</p>`;
    chatMessages.appendChild(response);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
    }
    }
    
    function sendQuickReply(reply) {
    const chatMessages = document.getElementById('chatMessages');
    const userMessage = document.createElement('div');
    userMessage.className = 'bg-chain-blue text-white rounded-lg p-3 max-w-xs ml-auto';
    userMessage.innerHTML = `<p class="text-sm">${reply}</p>`;
    chatMessages.appendChild(userMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
    const response = document.createElement('div');
    response.className = 'bg-gray-100 rounded-lg p-3 max-w-xs';
    let responseText = '';
    switch (reply) {
    case 'Search Property':
    responseText = 'I can help you find the perfect property! What type of property are you looking for and in which area?';
    break;
    case 'Draft Agreement':
    responseText = "I'll help you create a rental agreement. Do you need a standard rental, furnished rental, or commercial lease agreement?";
    break;
    case 'Estimate Rent':
    responseText = 'I can provide rental estimates for your area. Please share the property location and type for an accurate estimate.';
    break;
    default:
    responseText = 'How can I assist you with that?';
    }
    response.innerHTML = `<p class="text-sm">${responseText}</p>`;
    chatMessages.appendChild(response);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
    }
    
    // Allow Enter key to send messages (guard if input exists)
    (function(){
    const chatInputEl = document.getElementById('chatInput');
    if (chatInputEl) {
    chatInputEl.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
    sendMessage();
    }
    });
    }
    })();
    
    // Toast notification banner
    function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification-slide fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
    <div class="flex items-center justify-between">
    <p class="text-sm">${message}</p>
    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
    </svg>
    </button>
    </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
    if (notification.parentElement) {
    notification.remove();
    }
    }, 5000);
    }
    
    // Initialize page on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
    // Show home section by default
    showSection('home');
    // Biometric verification wiring
    const startFaceScanBtn = document.getElementById('startFaceScanBtn');
    const captureFaceBtn = document.getElementById('captureFaceBtn');
    const submitBiometricBtn = document.getElementById('submitBiometricBtn');
    if (startFaceScanBtn) startFaceScanBtn.addEventListener('click', startFaceScan);
    if (captureFaceBtn) captureFaceBtn.addEventListener('click', captureFaceFrame);
    if (submitBiometricBtn) submitBiometricBtn.addEventListener('click', submitBiometric);
    // Loading screen fallback
    setTimeout(() => {
    const ls = document.getElementById('loadingScreen');
    if (ls && ls.style.display !== 'none') {
    ls.style.opacity = '0';
    setTimeout(() => { if (ls) ls.style.display = 'none'; }, 500);
    }
    }, 2500);
    // Initialize notifications badge
    updateNotificationBadge();
    // Restore any scheduled jobs (rent due reminders) after reload
    restoreScheduledJobs();
    
    // Ask for desktop notification permission once
    ensureNotificationPermission();
    // Also show a banner to allow via user gesture if needed (e.g., Safari)
    showDesktopPermissionBanner();
    
    // Auto-fire a test notification 10 seconds after page load (every load)
    setTimeout(() => {
    addNotification({ title: 'Rent Due Soon', message: 'Auto Test: fired 10s after load', type: 'info' });
    }, 10 * 1000);
    });
    
    // Biometric (Face Scan)
    let faceStream = null;
    
    async function startFaceScan() {
    const video = document.getElementById('faceVideo');
    const placeholder = document.getElementById('faceVideoPlaceholder');
    const captureBtn = document.getElementById('captureFaceBtn');
    const submitBtn = document.getElementById('submitBiometricBtn');
    const statusEl = document.getElementById('biometricStatus');
    try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showNotification('Camera not supported in this browser', 'error');
    return;
    }
    stopFaceStream();
    faceStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    if (video) {
    video.srcObject = faceStream;
    video.classList.remove('hidden');
    }
    if (placeholder) placeholder.classList.add('hidden');
    if (captureBtn) captureBtn.disabled = false;
    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Camera started. Center your face in the frame and click Capture.';
    } catch (e) {
    showNotification(e.message || 'Unable to access camera', 'error');
    }
    }
    
    function captureFaceFrame() {
    const video = document.getElementById('faceVideo');
    const canvas = document.getElementById('faceCanvas');
    const submitBtn = document.getElementById('submitBiometricBtn');
    const statusEl = document.getElementById('biometricStatus');
    if (!video || !canvas) return;
    try {
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 360;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    canvas.classList.remove('hidden');
    if (submitBtn) submitBtn.disabled = false;
    if (statusEl) statusEl.textContent = 'Frame captured. Review and submit for verification.';
    } catch (e) {
    showNotification('Failed to capture frame', 'error');
    }
    }
    
    function stopFaceStream() {
    if (faceStream) {
    faceStream.getTracks().forEach(t => t.stop());
    faceStream = null;
    }
    }
    
    async function submitBiometric() {
    const canvas = document.getElementById('faceCanvas');
    const statusEl = document.getElementById('biometricStatus');
    const submitBtn = document.getElementById('submitBiometricBtn');
    try {
    if (!canvas) return;
    submitBtn.disabled = true;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    // Here you would POST dataUrl to your backend or a biometric provider API.
    if (statusEl) statusEl.textContent = 'Submitting and verifying...';
    setTimeout(() => {
    if (statusEl) statusEl.textContent = '✓ Biometric verification successful';
    showNotification('Biometric verification successful', 'success');
    stopFaceStream();
    }, 1500);
    } catch (e) {
    showNotification(e.message || 'Biometric submission failed', 'error');
    submitBtn.disabled = false;
    }
    }
    
    // Public helpers
    window.notifyPropertyAdded = function(propertyName) {
    addNotification({ title: 'Property Added', message: `${propertyName} was added successfully`, type: 'success' });
    };
    
    // Persisted job scheduler for rent reminders
    const JOBS_KEY = 'rc_scheduled_jobs';
    function loadJobs() {
    try { return JSON.parse(localStorage.getItem(JOBS_KEY)) || []; } catch { return []; }
    }
    function saveJobs(jobs) {
    try { localStorage.setItem(JOBS_KEY, JSON.stringify(jobs)); } catch {}
    }
    function scheduleJobTimer(job) {
    const delay = job.triggerAt - Date.now();
    if (delay <= 0) {
    // Fire immediately if past due
    addNotification({ title: 'Rent Due Soon', message: `Your rent for ${job.propertyName} is due soon`, type: 'info' });
    // Remove job
    const jobs = loadJobs().filter(j => j.id !== job.id);
    saveJobs(jobs);
    return;
    }
    setTimeout(() => {
    addNotification({ title: 'Rent Due Soon', message: `Your rent for ${job.propertyName} is due soon`, type: 'info' });
    const jobs = loadJobs().filter(j => j.id !== job.id);
    saveJobs(jobs);
    }, Math.min(delay, 2147000000));
    }
    function restoreScheduledJobs() {
    const jobs = loadJobs();
    jobs.forEach(scheduleJobTimer);
    }
    
    const DEFAULT_RENT_REMINDER_MS = 24 * 60 * 60 * 1000; // default 24h before due
    window.scheduleRentDue = function({ propertyName, dueAt, leadMs = DEFAULT_RENT_REMINDER_MS }) {
    try {
    const dueMs = typeof dueAt === 'number' ? dueAt : new Date(dueAt).getTime();
    const triggerAt = dueMs - leadMs;
    const delay = triggerAt - Date.now();
    if (isNaN(triggerAt)) return;
    const job = {
    id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    type: 'rent_due',
    propertyName,
    triggerAt
    };
    const jobs = loadJobs();
    jobs.push(job);
    saveJobs(jobs);
    scheduleJobTimer(job);
    } catch (e) {
    // ignore
    }
    };
    
    // Testing helper: trigger a rent-due notification in 1 minute
    window.scheduleRentDueIn1Min = function({ propertyName }) {
    const triggerAt = Date.now() + 60 * 1000;
    const job = {
    id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    type: 'rent_due',
    propertyName,
    triggerAt
    };
    const jobs = loadJobs();
    jobs.push(job);
    saveJobs(jobs);
    scheduleJobTimer(job);
    };
    
    // Flexible testing helper: trigger in N seconds
    window.scheduleRentDueInSeconds = function({ propertyName, seconds = 10 }) {
    const triggerAt = Date.now() + Math.max(1, seconds) * 1000;
    const job = {
    id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    type: 'rent_due',
    propertyName,
    triggerAt
    };
    const jobs = loadJobs();
    jobs.push(job);
    saveJobs(jobs);
    scheduleJobTimer(job);
    };
    
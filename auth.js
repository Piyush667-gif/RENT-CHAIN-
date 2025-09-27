// Supabase Auth wiring for RentChain
// Fill these with your project details (Project URL and anon public key)
const SUPABASE_URL = "https://gvzokifqfmpmjexxfyhg.supabase.co"; // e.g. https://abcd1234.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2em9raWZxZm1wbWpleHhmeWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MTIxOTksImV4cCI6MjA3NDM4ODE5OX0.qKz4OhoKX_E3GTPJcw_EAynt7z8GkdUfyP04bIyvbeE"; // Public anon key

// Create Supabase client (supabase-js v2 UMD exposes `window.supabase`)
const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function notify(msg, type = "info") {
if (typeof window.showNotification === "function") {
window.showNotification(msg, type);
} else {
console.log(`[${type}]`, msg);
}
}

function setAuthUi(session) {
const user = session?.user || null;
const signinBtn = document.getElementById("signinNavBtn");
const signoutBtn = document.getElementById("signoutNavBtn");
const userBadge = document.getElementById("userBadge");

if (user) {
const ident = user.email || user.phone || user.id;
if (userBadge) {
userBadge.textContent = `Signed in as ${ident}`;
userBadge.classList.remove("hidden");
}
if (signinBtn) signinBtn.classList.add("hidden");
if (signoutBtn) signoutBtn.classList.remove("hidden");
} else {
if (userBadge) userBadge.classList.add("hidden");
if (signinBtn) signinBtn.classList.remove("hidden");
if (signoutBtn) signoutBtn.classList.add("hidden");
}
}

async function initAuth() {
if (!sb) {
console.warn("Supabase client not initialized. Please set SUPABASE_URL and SUPABASE_ANON_KEY in auth.js");
return;
}

// Initial session load
try {
const { data: { session }, error } = await sb.auth.getSession();
if (error) throw error;
setAuthUi(session);
} catch (e) {
console.error(e);
}

// Listen to auth state changes
sb.auth.onAuthStateChange(async (_event, session) => {
setAuthUi(session);
if (session?.user) {
notify("Signed in successfully", "success");
}
});

// Wire up UI elements
const btnEmail = document.getElementById("btnEmail");
const emailForm = document.getElementById("emailForm");
const emailInput = document.getElementById("emailInput");
const emailSubmit = document.getElementById("emailSubmit");

const btnPhone = document.getElementById("btnPhone");
const phoneForm = document.getElementById("phoneForm");
const phoneInput = document.getElementById("phoneInput");
const phoneSubmit = document.getElementById("phoneSubmit");

// Phone OTP inline UI
const otpForm = document.getElementById("otpForm");
const otpInput = document.getElementById("otpInput");
const otpVerify = document.getElementById("otpVerify");
const otpResend = document.getElementById("otpResend");
const otpTimer = document.getElementById("otpTimer");

// State for phone verification
let currentPhone = null;
let resendCountdownId = null;
const RESEND_AFTER_SECONDS = 30;

const signoutBtn = document.getElementById("signoutNavBtn");

if (btnEmail && emailForm) {
btnEmail.addEventListener("click", () => {
emailForm.classList.toggle("hidden");
});
}

if (emailSubmit && emailInput) {
emailSubmit.addEventListener("click", async () => {
const email = (emailInput.value || "").trim();
if (!email) {
notify("Please enter an email", "error");
return;
}
try {
emailSubmit.disabled = true;
const { error } = await sb.auth.signInWithOtp({
email,
options: {
emailRedirectTo: window.location.origin,
},
});
if (error) throw error;
notify("Magic link sent! Check your email.", "success");
} catch (e) {
notify(e.message || "Failed to send magic link", "error");
} finally {
emailSubmit.disabled = false;
}
});
}

if (btnPhone && phoneForm) {
btnPhone.addEventListener("click", () => {
phoneForm.classList.toggle("hidden");
});
}

if (phoneSubmit && phoneInput) {
phoneSubmit.addEventListener("click", async () => {
const phone = (phoneInput.value || "").trim();
if (!phone) {
notify("Please enter a phone number including country code (e.g. +11234567890)", "error");
return;
}
try {
phoneSubmit.disabled = true;
const { error } = await sb.auth.signInWithOtp({ phone });
if (error) throw error;
notify("OTP sent via SMS. Please check your phone.", "success");
currentPhone = phone;
if (otpForm) otpForm.classList.remove("hidden");
if (otpInput) otpInput.focus();
// start resend countdown
if (otpResend) otpResend.disabled = true;
if (otpTimer) otpTimer.textContent = "You can resend a new code in 30s";
startResendCountdown();
} catch (e) {
notify(e.message || "Failed to send/verify OTP", "error");
} finally {
phoneSubmit.disabled = false;
}
});
}

// Handle OTP verify
if (otpVerify && otpInput) {
otpVerify.addEventListener("click", async () => {
const token = (otpInput.value || "").trim();
if (!currentPhone) {
notify("Please send an OTP first.", "error");
return;
}
if (!token) {
notify("Enter the OTP you received by SMS", "error");
return;
}
try {
otpVerify.disabled = true;
const { error: verifyError } = await sb.auth.verifyOtp({
phone: currentPhone,
token,
type: "sms",
});
if (verifyError) throw verifyError;
notify("Phone number verified. Signed in!", "success");
// Clear OTP UI
if (otpForm) otpForm.classList.add("hidden");
if (otpInput) otpInput.value = "";
} catch (e) {
notify(e.message || "OTP verification failed", "error");
} finally {
otpVerify.disabled = false;
}
});
}

// Handle OTP resend
if (otpResend) {
otpResend.addEventListener("click", async () => {
if (!currentPhone) {
notify("Please enter your phone and press Send OTP first.", "error");
return;
}
try {
otpResend.disabled = true;
const { error } = await sb.auth.signInWithOtp({ phone: currentPhone });
if (error) throw error;
notify("New OTP sent via SMS.", "success");
startResendCountdown();
} catch (e) {
notify(e.message || "Failed to resend OTP", "error");
otpResend.disabled = false;
}
});
}

function startResendCountdown() {
if (!otpTimer || !otpResend) return;
let remaining = RESEND_AFTER_SECONDS;
otpTimer.textContent = `You can resend a new code in ${remaining}s`;
otpResend.disabled = true;
if (resendCountdownId) clearInterval(resendCountdownId);
resendCountdownId = setInterval(() => {
remaining -= 1;
if (remaining <= 0) {
clearInterval(resendCountdownId);
resendCountdownId = null;
otpTimer.textContent = "You can resend a new code now.";
otpResend.disabled = false;
} else {
otpTimer.textContent = `You can resend a new code in ${remaining}s`;
}
}, 1000);
}

if (signoutBtn) {
signoutBtn.addEventListener("click", async () => {
try {
const { error } = await sb.auth.signOut();
if (error) throw error;
notify("Signed out", "success");
} catch (e) {
notify(e.message || "Sign out failed", "error");
}
});
}
}

// Initialize after DOM is ready
if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", initAuth);
} else {
initAuth();
}

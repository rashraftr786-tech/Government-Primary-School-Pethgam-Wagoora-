// ============================================================
// FIREBASE CONFIGURATION
// Replace these values with your actual Firebase project config
// Get them from: Firebase Console > Project Settings > Web App
// ============================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ============================================================
// SUBJECT STRUCTURE BY CLASS
// ============================================================
const CLASS_SUBJECTS = {
  1: ['English', 'Mathematics', 'Urdu', 'Kashmiri'],
  2: ['English', 'Mathematics', 'Urdu', 'Kashmiri'],
  3: ['English', 'Mathematics', 'Urdu', 'Kashmiri', 'EVS'],
  4: ['English', 'Mathematics', 'Urdu', 'Kashmiri', 'EVS'],
  5: ['English', 'Mathematics', 'Urdu', 'Kashmiri', 'EVS'],
  6: ['English', 'Mathematics', 'Urdu', 'Kashmiri', 'Science', 'Social Science'],
  7: ['English', 'Mathematics', 'Urdu', 'Kashmiri', 'Science', 'Social Science'],
  8: ['English', 'Mathematics', 'Urdu', 'Kashmiri', 'Science', 'Social Science']
};

const ALL_SUBJECTS = ['English', 'Mathematics', 'Urdu', 'Kashmiri', 'EVS', 'Science', 'Social Science'];

const COINS_PER_CORRECT = 5;

// ============================================================
// ADMIN CREDENTIALS (Pre-created)
// ============================================================
const ADMIN_EMAIL = "admin@pethgamwagoora.edu";
const ADMIN_PASS  = "Admin@GPS2024";

// ============================================================
// UTILITY: Get current week string (e.g., "2024-W01")
// ============================================================
function getCurrentWeek() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// ============================================================
// UTILITY: Get current month string (e.g., "2024-03")
// ============================================================
function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// ============================================================
// UTILITY: Get ordinal suffix
// ============================================================
function ordinal(n) {
  const s = ["th","st","nd","rd"];
  const v = n % 100;
  return n + (s[(v-20)%10] || s[v] || s[0]);
}

// ============================================================
// UTILITY: Show toast notification
// ============================================================
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
// UTILITY: Show loading spinner
// ============================================================
function showLoader(show = true) {
  const loader = document.getElementById('globalLoader');
  if (loader) loader.style.display = show ? 'flex' : 'none';
}

// ============================================================
// AUTH GUARD
// ============================================================
function requireAuth(expectedRole) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = '../index.html';
      return;
    }
    try {
      const doc = await db.collection('users').doc(user.uid).get();
      if (!doc.exists || doc.data().role !== expectedRole) {
        await auth.signOut();
        window.location.href = '../index.html';
      }
    } catch (e) {
      window.location.href = '../index.html';
    }
  });
}

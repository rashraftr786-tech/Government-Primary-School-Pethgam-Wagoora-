# 🏫 Government Primary School Pethgam Wagoora
## School Home Assignment Portal

A complete, free, web-based school assignment portal built with HTML, CSS, JavaScript, and Firebase.

---

## 📁 Folder Structure

```
school-portal/
├── index.html                 ← Login / Signup page
├── pages/
│   ├── student.html           ← Student Dashboard
│   ├── teacher.html           ← Teacher Dashboard
│   └── admin.html             ← Admin Dashboard
├── css/
│   └── style.css              ← All styles (green & white theme)
├── js/
│   ├── firebase-config.js     ← Firebase config + utilities
│   └── create-admin.js        ← Admin account setup script
├── firestore.rules            ← Firestore security rules
├── firestore.indexes.json     ← Firestore composite indexes
├── storage.rules              ← Firebase Storage rules
└── README.md                  ← This file
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Firebase Auth (Email/Password) |
| 👤 Roles | Admin, Teacher, Student |
| 📸 Profile Photos | Upload & update via Firebase Storage |
| 📝 MCQ Assignments | Teachers upload questions with 4 options |
| ✅ Instant Feedback | Students get immediate correct/wrong response |
| 🪙 Digital Coins | 5 coins per correct answer |
| 🏆 Leaderboards | Class, Weekly, Monthly, Subject leaderboards |
| 📊 Admin Dashboard | Full portal management |
| 📱 Mobile Friendly | Responsive design for all devices |

---

## 🚀 Setup Instructions

### STEP 1: Create Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Click **"Add Project"**
3. Name it: `gps-pethgam-wagoora`
4. Disable Google Analytics (optional)
5. Click **Create Project**

---

### STEP 2: Enable Firebase Authentication

1. In Firebase Console → **Authentication** → **Get Started**
2. Click **"Sign-in method"** tab
3. Enable **Email/Password**
4. Click Save

---

### STEP 3: Create Firestore Database

1. Firebase Console → **Firestore Database** → **Create Database**
2. Choose **"Start in production mode"**
3. Select region: `asia-south1` (Mumbai — closest to Kashmir)
4. Click **Done**

**Deploy Security Rules:**
1. In Firestore → **Rules** tab
2. Copy content from `firestore.rules`
3. Paste and click **Publish**

---

### STEP 4: Create Firebase Storage

1. Firebase Console → **Storage** → **Get Started**
2. Start in **production mode**
3. Choose same region as Firestore

**Deploy Storage Rules:**
1. Storage → **Rules** tab
2. Copy content from `storage.rules`
3. Paste and click **Publish**

---

### STEP 5: Register Your Web App

1. Firebase Console → Project Overview → Click **"</>"** (Web)
2. App nickname: `GPS Portal`
3. Check **"Firebase Hosting"** checkbox (optional)
4. Click **Register App**
5. Copy the **firebaseConfig** object

---

### STEP 6: Configure the Portal

Open `js/firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

### STEP 7: Create Admin Account

1. Open `index.html` in your browser (or deployed URL)
2. Open Browser DevTools → Console (press F12)
3. Include the create-admin script first, then type:
   ```javascript
   createAdminAccount()
   ```
4. Press Enter — admin account will be created
5. **Admin Login:**
   - Email: `admin@pethgamwagoora.edu`
   - Password: `Admin@GPS2024`
6. ⚠️ **Change password after first login!**

---

### STEP 8: Deploy to GitHub Pages

#### 8a. Create GitHub Repository
1. Go to **[GitHub.com](https://github.com)** → Sign in (or create free account)
2. Click **"New Repository"**
3. Name: `gps-pethgam-portal`
4. Set to **Public**
5. Click **Create Repository**

#### 8b. Upload Files
**Option A — GitHub Web Upload:**
1. In your repository, click **"Add file"** → **"Upload files"**
2. Drag and drop all project files
3. Maintain folder structure
4. Click **Commit changes**

**Option B — Git Command Line:**
```bash
cd school-portal
git init
git add .
git commit -m "Initial commit: GPS Pethgam Wagoora Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gps-pethgam-portal.git
git push -u origin main
```

#### 8c. Enable GitHub Pages
1. Repository → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **(root)**
4. Click **Save**
5. Your site will be live at: `https://YOUR_USERNAME.github.io/gps-pethgam-portal`

---

### STEP 9: Create Firestore Indexes

When you first run queries, Firebase may ask to create indexes. Either:

**Option A — Click the link in browser console errors**
(Firebase provides a direct link to create missing indexes)

**Option B — Manually create via Firebase Console:**
1. Firestore → **Indexes** → **Composite** tab
2. Create indexes as defined in `firestore.indexes.json`

**Required Indexes:**
| Collection | Fields |
|---|---|
| `users` | role ASC, class ASC, coins DESC |
| `users` | role ASC, weeklyCoins DESC |
| `users` | role ASC, monthlyCoins DESC |
| `assignments` | class ASC, subject ASC, createdAt DESC |
| `assignments` | teacherId ASC, createdAt DESC |
| `attempts` | studentId ASC, timestamp DESC |
| `attempts` | assignmentId ASC, timestamp DESC |

---

## 👥 User Roles & Credentials

| Role | How to Access | Default |
|---|---|---|
| **Admin** | Pre-created via script | `admin@pethgamwagoora.edu` / `Admin@GPS2024` |
| **Teacher** | Sign up on index.html | Self-registration |
| **Student** | Sign up on index.html | Self-registration |

---

## 📚 Subject Structure

| Class | Subjects |
|---|---|
| Class 1–2 | English, Mathematics, Urdu, Kashmiri |
| Class 3–5 | English, Mathematics, Urdu, Kashmiri, EVS |
| Class 6–8 | English, Mathematics, Urdu, Kashmiri, Science, Social Science |

---

## 🪙 Digital Coins System

- **+5 coins** per correct answer
- Coins are tracked:
  - **Total** (all-time)
  - **Weekly** (reset by admin)
  - **Monthly** (reset by admin)
  - **Per Subject**

---

## 🏆 Leaderboards

| Leaderboard | Scope | Reset |
|---|---|---|
| Class Leaderboard | Per class, all-time coins | Never |
| Weekly Leaderboard | All classes, weekly coins | Admin resets |
| Monthly Leaderboard | All classes, monthly coins | Admin resets |
| Subject Leaderboard | Per subject, monthly coins | Admin resets |

---

## 🔧 Technology Stack

| Component | Technology | Cost |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript | Free |
| Database | Firebase Firestore | Free (Spark Plan) |
| Authentication | Firebase Auth | Free |
| File Storage | Firebase Storage | Free (5GB) |
| Hosting | GitHub Pages | Free |
| Version Control | GitHub | Free |

---

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari (iOS)
- ✅ Edge
- ✅ Android Browser

---

## 🛠️ Firebase Free Tier Limits (Spark Plan)

| Service | Free Limit |
|---|---|
| Firestore Reads | 50,000/day |
| Firestore Writes | 20,000/day |
| Storage | 5 GB |
| Auth Users | Unlimited |
| Hosting | 10 GB/month |

**These limits are sufficient for a primary school with ~200 students.**

---

## 🆘 Troubleshooting

**Problem: "Permission Denied" error**
- Ensure Firestore security rules are published
- Check that the user is properly authenticated

**Problem: Photos not uploading**
- Check Firebase Storage rules are published
- Ensure file size is under 5MB
- Check internet connection

**Problem: Leaderboard not showing**
- Firestore composite indexes may not be created yet
- Check browser console for index creation links

**Problem: Admin can't login**
- Run the `createAdminAccount()` script first
- Check firebase-config.js has correct credentials

---

## 📞 Support

For technical issues, check:
- Firebase Console logs
- Browser Developer Tools (F12) → Console

---

*Built with ❤️ for Government Primary School Pethgam Wagoora*
*Using 100% free technologies: Firebase + GitHub Pages*

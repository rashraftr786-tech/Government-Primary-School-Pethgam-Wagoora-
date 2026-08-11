// ============================================================
// FIREBASE ADMIN SETUP SCRIPT
// Run this ONCE using the Firebase Console > Firestore
// OR use Firebase Admin SDK (Node.js) to create the admin user
//
// Instructions: Run this in your browser console AFTER
// configuring firebase-config.js with your actual credentials
// ============================================================

/*
  STEP 1: Open index.html in your browser
  STEP 2: Open DevTools Console (F12)
  STEP 3: Paste and run the function below
  STEP 4: Call: createAdminAccount()
*/

async function createAdminAccount() {
  try {
    // Create the admin authentication account
    const cred = await firebase.auth().createUserWithEmailAndPassword(
      "admin@pethgamwagoora.edu",
      "Admin@GPS2024"
    );

    const uid = cred.user.uid;

    // Save admin profile to Firestore
    await firebase.firestore().collection('users').doc(uid).set({
      name: "Admin",
      email: "admin@pethgamwagoora.edu",
      role: "admin",
      photoURL: "https://ui-avatars.com/api/?name=Admin&background=1a7a3c&color=fff&size=128",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log("✅ Admin account created successfully!");
    console.log("Email:", "admin@pethgamwagoora.edu");
    console.log("Password:", "Admin@GPS2024");
    console.log("⚠️ IMPORTANT: Change the password after first login!");

    alert("Admin account created! Email: admin@pethgamwagoora.edu | Password: Admin@GPS2024");

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("ℹ️ Admin account already exists.");
      alert("Admin account already exists.");
    } else {
      console.error("❌ Error creating admin:", error);
      alert("Error: " + error.message);
    }
  }
}

// Run:
// createAdminAccount();

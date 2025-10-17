// firebase-config.js
// Shared Firebase initialization

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAV6UygRZ1ItG1ywxfpsWfsGSOpZD3ZFoE",
  authDomain: "nfc-ptyp1.firebaseapp.com",
  projectId: "nfc-ptyp1",
  storageBucket: "nfc-ptyp1.appspot.com",
  messagingSenderId: "1014619306049",
  appId: "1:1014619306049:web:33bae58475464af792eec0"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

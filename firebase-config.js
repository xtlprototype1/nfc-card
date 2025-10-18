<script type="module">
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

  // Initialize Firebase
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // --- DOM ELEMENTS ---
  const loginForm = document.getElementById('login-form');
  const signupEmailForm = document.getElementById('signup-email-form');
  const verifyCodeForm = document.getElementById('verify-code-form');
  const passwordSetupForm = document.getElementById('password-setup-form');
  const formTitle = document.getElementById('form-title');
  const resendBtn = document.getElementById('resend-btn');
  const timerText = document.getElementById('timer-text');
  const loginMsg = document.getElementById('login-message');
  const emailMsg = document.getElementById('email-message');
  const codeMsg = document.getElementById('code-message');
  const passMsg = document.getElementById('password-message');

  let generatedCode = null;
  let timerInterval;
  let timeLeft = 60;
  let verifiedEmail = "";

  // Switch views
  document.getElementById('create-link').onclick = () => {
    loginForm.style.display = 'none';
    signupEmailForm.style.display = 'block';
    formTitle.innerText = 'Create Account';
  };

  document.getElementById('back-login-1').onclick = document.getElementById('back-login-2').onclick = () => {
    signupEmailForm.style.display = 'none';
    verifyCodeForm.style.display = 'none';
    passwordSetupForm.style.display = 'none';
    loginForm.style.display = 'block';
    formTitle.innerText = 'Login';
    clearInterval(timerInterval);
  };

  // LOGIN WITH FIREBASE
  document.getElementById('login-btn').onclick = async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    loginMsg.textContent = "";
    try {
      await signInWithEmailAndPassword(auth, email, password);
      loginMsg.innerHTML = "<span class='success'>Login successful! Redirecting...</span>";
      setTimeout(() => window.location.href = "admin.html", 1500);
    } catch (err) {
      loginMsg.innerHTML = `<span class='error'>${err.message}</span>`;
    }
  };

  // EMAIL VERIFICATION MOCK (Custom)
  document.getElementById('send-code-btn').onclick = () => {
    const email = document.getElementById('signup-email').value.trim();
    if (!validateEmail(email)) {
      emailMsg.innerHTML = "<span class='error'>Please enter a valid email.</span>";
      return;
    }
    emailMsg.textContent = "";
    generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    verifiedEmail = email;
    console.log("Verification code:", generatedCode);
    signupEmailForm.style.display = 'none';
    verifyCodeForm.style.display = 'block';
    formTitle.innerText = 'Verify Email';
    startTimer();
  };

  function startTimer() {
    timeLeft = 60;
    resendBtn.disabled = true;
    resendBtn.style.opacity = '0.5';
    resendBtn.style.cursor = 'not-allowed';
    timerText.innerText = `Code expires in ${timeLeft}s`;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerText.innerText = `Code expires in ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerText.innerText = "Code expired.";
        resendBtn.disabled = false;
        resendBtn.style.opacity = '1';
        resendBtn.style.cursor = 'pointer';
      }
    }, 1000);
  }

  resendBtn.onclick = () => {
    if (!resendBtn.disabled) {
      generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Resent code:", generatedCode);
      startTimer();
    }
  };

  document.getElementById('verify-btn').onclick = () => {
    const code = document.getElementById('verification-code').value.trim();
    if (code === generatedCode) {
      codeMsg.innerHTML = "<span class='success'>Email verified successfully!</span>";
      clearInterval(timerInterval);
      setTimeout(() => {
        verifyCodeForm.style.display = 'none';
        passwordSetupForm.style.display = 'block';
        formTitle.innerText = 'Set Password';
      }, 1000);
    } else {
      codeMsg.innerHTML = "<span class='error'>Invalid code. Try again.</span>";
    }
  };

  // CREATE ACCOUNT WITH FIREBASE
  document.getElementById('create-account-btn').onclick = async () => {
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirm-password').value;
    passMsg.textContent = "";
    if (pass.length < 8) {
      passMsg.innerHTML = "<span class='error'>Password must be at least 8 characters.</span>";
      return;
    }
    if (pass !== confirm) {
      passMsg.innerHTML = "<span class='error'>Passwords do not match.</span>";
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, verifiedEmail, pass);
      const uid = cred.user.uid;
      await setDoc(doc(db, "users", uid), {
        email: verifiedEmail,
        verified: true,
        name: "",
        bio: "",
        socials: {},
        photo: ""
      });
      passMsg.innerHTML = "<span class='success'>Account created successfully!</span>";
      setTimeout(() => {
        window.location.href = "admin.html";
      }, 1500);
    } catch (err) {
      passMsg.innerHTML = `<span class='error'>${err.message}</span>`;
    }
  };

  function validateEmail(email) {
    const regex = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
    return regex.test(email);
  }
</script>

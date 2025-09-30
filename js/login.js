// Login Form JavaScript Functionality

// DOM Elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailValidIcon = document.getElementById("emailValidIcon");
const togglePasswordBtn = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");
const eyeOffIcon = document.getElementById("eyeOffIcon");
const loginBtn = document.getElementById("loginBtn");
const loginText = document.getElementById("loginText");
const loginSpinner = document.getElementById("loginSpinner");
const messageContainer = document.getElementById("messageContainer");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

// State
let isPasswordVisible = false;

// Utility Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to validate input characters (only letters, numbers, spaces, and email symbols)
function isValidCharacter(char, isEmailField = false) {
  // Allow letters (a-z, A-Z), numbers (0-9), and spaces
  const basicPattern = /[a-zA-Z0-9\s]/;

  if (isEmailField) {
    // For email field, also allow @ . - _
    const emailPattern = /[a-zA-Z0-9\s@.\-_]/;
    return emailPattern.test(char);
  }

  return basicPattern.test(char);
}

// Function to filter input in real-time
function filterInput(input, isEmailField = false) {
  let filteredValue = "";
  const value = input.value;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (isValidCharacter(char, isEmailField)) {
      filteredValue += char;
    }
  }

  // Update input value if it was filtered
  if (filteredValue !== value) {
    input.value = filteredValue;
    // Show brief warning
    showInputWarning(input);
  }
}

// Function to show input warning
function showInputWarning(input) {
  // Create or update warning message
  let warningDiv = input.parentElement.querySelector(".input-warning");

  if (!warningDiv) {
    warningDiv = document.createElement("div");
    warningDiv.className =
      "input-warning absolute -bottom-6 left-0 text-xs text-red-500 opacity-0 transition-opacity duration-200";
    warningDiv.textContent = "Hanya huruf, angka, dan spasi yang diperbolehkan";
    input.parentElement.appendChild(warningDiv);
  }

  // Show warning
  warningDiv.classList.remove("opacity-0");
  warningDiv.classList.add("opacity-100");

  // Hide warning after 2 seconds
  setTimeout(() => {
    warningDiv.classList.remove("opacity-100");
    warningDiv.classList.add("opacity-0");
  }, 2000);
}

function showMessage(type, message) {
  messageContainer.classList.remove("hidden");

  if (type === "success") {
    successMessage.classList.remove("hidden");
    errorMessage.classList.add("hidden");
  } else {
    errorMessage.classList.remove("hidden");
    successMessage.classList.add("hidden");
    errorText.textContent = message;
  }

  // Auto hide after 5 seconds
  setTimeout(() => {
    hideMessages();
  }, 5000);
}

function hideMessages() {
  messageContainer.classList.add("hidden");
  successMessage.classList.add("hidden");
  errorMessage.classList.add("hidden");
}

function setLoading(isLoading) {
  if (isLoading) {
    loginBtn.disabled = true;
    loginBtn.classList.add("opacity-80", "cursor-not-allowed");
    loginText.classList.add("hidden");
    loginSpinner.classList.remove("hidden");
    loginSpinner.classList.add("flex", "items-center", "justify-center");
  } else {
    loginBtn.disabled = false;
    loginBtn.classList.remove("opacity-80", "cursor-not-allowed");
    loginText.classList.remove("hidden");
    loginSpinner.classList.add("hidden");
    loginSpinner.classList.remove("flex", "items-center", "justify-center");
  }
}

function validateForm() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  let isValid = true;
  let errors = [];

  // Email validation
  if (!email) {
    errors.push("Email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    errors.push("Please enter a valid email address");
    isValid = false;
  }

  // Password validation
  if (!password) {
    errors.push("Password is required");
    isValid = false;
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
    isValid = false;
  }

  return { isValid, errors };
}

// Event Listeners

// Email validation and input filtering
emailInput.addEventListener("input", (e) => {
  // Filter input characters first
  filterInput(e.target, true); // true for email field

  const email = e.target.value.trim();

  if (email && isValidEmail(email)) {
    emailValidIcon.classList.remove("hidden");
    emailInput.classList.remove("border-red-300", "focus:ring-red-500");
    emailInput.classList.add("border-green-300", "focus:ring-green-500");
  } else {
    emailValidIcon.classList.add("hidden");
    emailInput.classList.remove("border-green-300", "focus:ring-green-500");
    if (email && !isValidEmail(email)) {
      emailInput.classList.add("border-red-300", "focus:ring-red-500");
    } else {
      emailInput.classList.remove("border-red-300", "focus:ring-red-500");
    }
  }
});

// Password input filtering
passwordInput.addEventListener("input", (e) => {
  // Filter input characters (no special characters except basic ones)
  filterInput(e.target, false); // false for password field
});

// Prevent invalid characters on keypress for email
emailInput.addEventListener("keypress", (e) => {
  const char = String.fromCharCode(e.which);
  if (!isValidCharacter(char, true)) {
    e.preventDefault();
    showInputWarning(emailInput);
  }
});

// Prevent invalid characters on keypress for password
passwordInput.addEventListener("keypress", (e) => {
  const char = String.fromCharCode(e.which);
  if (!isValidCharacter(char, false)) {
    e.preventDefault();
    showInputWarning(passwordInput);
  }
});

// Handle paste events for email
emailInput.addEventListener("paste", (e) => {
  e.preventDefault();
  const pastedText = (e.clipboardData || window.clipboardData).getData("text");
  let filteredText = "";

  for (let i = 0; i < pastedText.length; i++) {
    const char = pastedText[i];
    if (isValidCharacter(char, true)) {
      filteredText += char;
    }
  }

  // Insert filtered text
  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;
  const currentValue = e.target.value;
  e.target.value =
    currentValue.substring(0, start) +
    filteredText +
    currentValue.substring(end);

  // Trigger input event for validation
  e.target.dispatchEvent(new Event("input"));

  if (filteredText !== pastedText) {
    showInputWarning(emailInput);
  }
});

// Handle paste events for password
passwordInput.addEventListener("paste", (e) => {
  e.preventDefault();
  const pastedText = (e.clipboardData || window.clipboardData).getData("text");
  let filteredText = "";

  for (let i = 0; i < pastedText.length; i++) {
    const char = pastedText[i];
    if (isValidCharacter(char, false)) {
      filteredText += char;
    }
  }

  // Insert filtered text
  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;
  const currentValue = e.target.value;
  e.target.value =
    currentValue.substring(0, start) +
    filteredText +
    currentValue.substring(end);

  if (filteredText !== pastedText) {
    showInputWarning(passwordInput);
  }
});

// Password visibility toggle
togglePasswordBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Mencegah form submit jika ada

  isPasswordVisible = !isPasswordVisible;

  if (isPasswordVisible) {
    passwordInput.type = "text";
    eyeIcon.classList.add("hidden");
    eyeOffIcon.classList.remove("hidden");

    // Focus tetap pada input password
    passwordInput.focus();

    console.log("Password is now visible");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("hidden");
    eyeOffIcon.classList.add("hidden");

    // Focus tetap pada input password
    passwordInput.focus();

    console.log("Password is now hidden");
  }
});

// Form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  hideMessages();

  const validation = validateForm();

  if (!validation.isValid) {
    showMessage("error", validation.errors[0]);
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const remember = document.getElementById("remember").checked;

  setLoading(true);

  try {
    // Simulate API call
    await simulateLogin(email, password, remember);

    showMessage("success", "Login successful! Redirecting...");

    // Redirect after successful login
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    showMessage("error", error.message);
  } finally {
    setLoading(false);
  }
});

// Simulate login function
async function simulateLogin(email, password, remember) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock authentication
  const validCredentials = [
    { email: "admin@example.com", password: "admin123" },
    { email: "user@example.com", password: "user123" },
    { email: "demo@example.com", password: "demo123" },
  ];

  const isValid = validCredentials.some(
    (cred) => cred.email === email && cred.password === password
  );

  if (!isValid) {
    throw new Error(
      "Invalid email or password. Try admin@example.com / admin123"
    );
  }

  // Store login state
  if (remember) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
  } else {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userEmail", email);
  }

  return { success: true, email };
}

// Social login handlers
document.querySelectorAll('button[type="button"]').forEach((button) => {
  if (
    button.textContent.includes("Google") ||
    button.textContent.includes("Facebook")
  ) {
    button.addEventListener("click", (e) => {
      const provider = button.textContent.trim();
      showMessage("info", `${provider} login is not implemented yet`);
    });
  }
});

// Input field focus effects
const inputs = [emailInput, passwordInput];
inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    input.parentElement.classList.add("ring-2", "ring-blue-500/20");
  });

  input.addEventListener("blur", () => {
    input.parentElement.classList.remove("ring-2", "ring-blue-500/20");
  });
});

// Auto-fill demo credentials button (for testing)
function createDemoButton() {
  const demoBtn = document.createElement("button");
  demoBtn.type = "button";
  demoBtn.className =
    "absolute top-4 right-4 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded-lg transition-colors";
  demoBtn.addEventListener("click", () => {
    emailInput.value = "admin@example.com";
    passwordInput.value = "admin123";
    emailInput.dispatchEvent(new Event("input"));
  });

  document.body.appendChild(demoBtn);
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Enter to submit form
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    loginForm.dispatchEvent(new Event("submit"));
  }

  // Escape to clear form
  if (e.key === "Escape") {
    emailInput.value = "";
    passwordInput.value = "";
    hideMessages();
  }

  // Keyboard shortcut untuk toggle password (Ctrl/Cmd + Shift + P)
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
    e.preventDefault();
    togglePasswordBtn.click();
  }
});

// Check if user is already logged in
function checkLoginStatus() {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") || sessionStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    showMessage("success", "Already logged in! Redirecting...");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
}

// Visual feedback saat hover pada tombol mata
togglePasswordBtn.addEventListener("mouseenter", function () {
  this.classList.add("scale-110");
});

togglePasswordBtn.addEventListener("mouseleave", function () {
  this.classList.remove("scale-110");
});

// Touch support untuk mobile
togglePasswordBtn.addEventListener("touchstart", function (e) {
  e.preventDefault();
  this.click();
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  console.log("Login form initialized");

  // Create demo button for testing
  createDemoButton();

  // Check if already logged in
  checkLoginStatus();

  // Focus on email input
  emailInput.focus();

  // Add subtle animations
  document.querySelector(".animate-slide-up").style.animationDelay = "0.1s";

  console.log("Login form with password toggle initialized successfully");
});

// Form auto-save (draft)
let formData = {};
const saveFormData = () => {
  formData = {
    email: emailInput.value,
    remember: document.getElementById("remember").checked,
  };
  sessionStorage.setItem("loginFormDraft", JSON.stringify(formData));
};

const loadFormData = () => {
  const saved = sessionStorage.getItem("loginFormDraft");
  if (saved) {
    const data = JSON.parse(saved);
    emailInput.value = data.email || "";
    document.getElementById("remember").checked = data.remember || false;

    // Trigger validation
    if (data.email) {
      emailInput.dispatchEvent(new Event("input"));
    }
  }
};

// Save form data on input
emailInput.addEventListener("input", saveFormData);
document.getElementById("remember").addEventListener("change", saveFormData);

// Load saved form data
loadFormData();

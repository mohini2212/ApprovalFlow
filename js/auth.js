document.addEventListener("DOMContentLoaded", function () {
  // ======================================
  // 1. COMMON FUNCTIONS
  // ======================================

  function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  // ======================================
  // 2. SIGNUP - MYSQL DATABASE
  // ======================================

  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const name = document.getElementById("fullName")?.value.trim();
      const email = document
        .getElementById("email")
        ?.value.trim()
        .toLowerCase();
      const password = document.getElementById("password")?.value;
      const confirmPassword = document.getElementById("confirmPassword")?.value;
      const role = document.getElementById("accountType")?.value;
      const terms = document.getElementById("terms")?.checked;

      if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all required fields.");
        return;
      }

      if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (password.length < 8) {
        alert("Password must contain at least 8 characters.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      if (!terms) {
        alert("Please accept the Terms and Conditions.");
        return;
      }

      if (!["agency", "client"].includes(role)) {
        alert("Invalid account type.");
        return;
      }

      const submitButton = signupForm.querySelector('[type="submit"]');

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Creating Account...";
      }

      try {
        const res = await fetch("php/register.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        });

        const text = await res.text();
        console.log("Server replied:", text);

        let result;
        try {
          result = JSON.parse(text);
        } catch (e) {
          alert("Server error. Press F12 and check the Console tab.");
          return;
        }

        if (result.success) {
          alert(result.message);
          window.location.href = "login.html";
        } else {
          alert(result.message);
        }
      } 
      finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Create Account";
        }
      }
    });
  }

  // ======================================
  // 3. LOGIN - MYSQL DATABASE
  // ======================================

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document
        .getElementById("loginEmail")
        ?.value.trim()
        .toLowerCase();
      const password = document.getElementById("loginPassword")?.value;

      if (!email || !password) {
        alert("Please enter your email and password.");
        return;
      }

      if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      try {
        const response = await fetch("php/login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          alert(result.message || "Login failed.");
          return;
        }

        sessionStorage.setItem("currentUser", JSON.stringify(result.user));

        alert("Login successful!");

        if (result.user.role === "agency") {
          window.location.href = "agency-dashboard.html";
        } else if (result.user.role === "client") {
          window.location.href = "client-dashboard.html";
        } else {
          window.location.href = "index.html";
        }
      } catch (error) {
        console.error("Login Error:", error);
        alert("Unable to connect to the server. Please try again.");
      }
    });
  }

  // ======================================
  // 4. LOGOUT
  // ======================================

  const logoutButtons = document.querySelectorAll(".logout-btn");

  logoutButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      sessionStorage.removeItem("currentUser");
      window.location.href = "login.html";
    });
  });

  // ======================================
  // 5. PROTECT DASHBOARD PAGES
  // ======================================

  const currentUser = JSON.parse(
    sessionStorage.getItem("currentUser") || "null",
  );

  const currentPage = window.location.pathname;

  if (
    currentPage.includes("agency-dashboard.html") &&
    (!currentUser || currentUser.role !== "agency")
  ) {
    window.location.href = "login.html";
  }

  if (
    currentPage.includes("client-dashboard.html") &&
    (!currentUser || currentUser.role !== "client")
  ) {
    window.location.href = "login.html";
  }

  console.log("ApprovalFlow authentication script loaded.");
});
register.php;

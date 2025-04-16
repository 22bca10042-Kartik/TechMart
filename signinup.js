const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link"),
  signupForm = document.querySelector("#signupForm"),
  signupBtn = document.querySelector("#signupBtn"),
  loginForm = document.querySelector("#loginForm");

// Show/Hide Password
pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
    pwFields.forEach(password => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bx-hide", "bx-show");
      } else {
        password.type = "password";
        eyeIcon.classList.replace("bx-show", "bx-hide");
      }
    });
  });
});

// Toggle Forms (Signup/Login)
links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    forms.classList.toggle("show-signup");
  });
});

// Validate Email
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validate Password
function validatePassword(password) {
  return password.length >= 6;
}

// Handle Login Form Submission
loginForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission

  const email = document.querySelector("#loginEmail").value;
  const password = document.querySelector("#loginPassword").value;

  // Client-side validation
  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }
  if (!validatePassword(password)) {
    alert("Password should be at least 6 characters long.");
    return;
  }

  // Send data to the PHP script using Fetch API
  fetch("signinup.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email2: email,
      password2: password,
      login: "Login" // Send the login key
    })
  })
  .then(response => response.text())
  .then(data => {
    if (data === "success") { // Assuming you return "success" from PHP on a successful login
      window.location.href = "index2.html"; // Redirect on success
    } else {
      alert("Incorrect Email or Password"); // Show error if login fails
    }
  })
  .catch(error => console.error('Error:', error));
});

// Validate Signup Form
signupBtn.addEventListener("click", e => {
  const emailField = signupForm.querySelector("#signupEmail");
  const passwordField = signupForm.querySelector("#signupPassword");
  const confirmPasswordField = signupForm.querySelector("#confirmPassword");

  // Clear previous errors
  clearErrors(emailField);
  clearErrors(passwordField);
  clearErrors(confirmPasswordField);

  const email = emailField.value;
  const password = passwordField.value;
  const confirmPassword = confirmPasswordField.value;
  let hasError = false;

  // Check for valid email
  if (!validateEmail(email)) {
    showError(emailField, "Please enter a valid email address.");
    hasError = true;
  }

  // Check for valid password
  if (!validatePassword(password)) {
    showError(passwordField, "Password should be at least 6 characters long.");
    hasError = true;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    showError(confirmPasswordField, "Passwords do not match.");
    hasError = true;
  }

  // Only allow form submission if no errors
  if (!hasError) {
    signupForm.submit();  // Use this to submit the form
  }
});

// Check Password Strength
function checkPasswordStrength(password) {
  const strengthMeter = document.getElementById('strengthMeter');
  if (password.length < 6) {
    strengthMeter.innerHTML = 'Weak';
    strengthMeter.style.color = 'red';
  } else if (password.length >= 6 && password.length < 10) {
    strengthMeter.innerHTML = 'Medium';
    strengthMeter.style.color = 'orange';
  } else {
    strengthMeter.innerHTML = 'Strong';
    strengthMeter.style.color = 'green';
  }
}

// Helper Functions for Validation
function showError(field, message) {
  field.classList.add('error');
  const errorMessage = document.createElement('div');
  errorMessage.classList.add('error-message');
  errorMessage.innerText = message;
  field.parentElement.appendChild(errorMessage);
}

function clearErrors(field) {
  field.classList.remove('error');
  const errorMessages = field.parentElement.querySelectorAll('.error-message');
  errorMessages.forEach(msg => msg.remove());
}
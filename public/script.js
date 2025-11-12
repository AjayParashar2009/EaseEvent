// ================= SMOOTH SCROLL =================
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", function (e) {
    const target = document.querySelector(this.hash);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ================= THEME TOGGLE =================
const toggle = document.getElementById("themeToggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.innerHTML = document.body.classList.contains("dark")
    ? `<i class="fas fa-sun"></i>`
    : `<i class="fas fa-moon"></i>`;
});

// ================= PARTICIPANT REGISTRATION POPUP =================
const registerModal = document.getElementById("registerModal");
const openRegisterBtn = document.getElementById("openRegister");
const navRegister = document.getElementById("navRegister");
const closeRegister = document.getElementById("closeModal");

const toggleBodyScroll = (disable) => {
  document.body.style.overflow = disable ? "hidden" : "auto";
};

openRegisterBtn.onclick = () => {
  registerModal.style.display = "flex";
  toggleBodyScroll(true);
};

navRegister.onclick = () => {
  registerModal.style.display = "flex";
  toggleBodyScroll(true);
};

closeRegister.onclick = () => {
  registerModal.style.display = "none";
  toggleBodyScroll(false);
};

// ================= REGISTRATION FORM SUBMIT =================
const participantForm = document.getElementById("participantForm");

participantForm.onsubmit = async (e) => {
  e.preventDefault();

  const name = participantForm
    .querySelector('input[placeholder="Student Name"]')
    .value.trim();
  const course = participantForm
    .querySelector('input[placeholder="Course"]')
    .value.trim();
  const semester = participantForm
    .querySelector('input[placeholder="Semester"]')
    .value.trim();
  const mainEvent = document.getElementById("mainEvent").value.trim();
  const subEvent = document.getElementById("subEvent").value.trim();
  const customEvent = document.getElementById("customEvent").value.trim();
  const email = participantForm
    .querySelector('input[type="email"]')
    .value.trim();
  const phone = participantForm.querySelector('input[type="tel"]').value.trim();

  try {
    const res = await fetch("/api/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        course,
        semester,
        mainEvent,
        subEvent,
        customEvent,
        email,
        phone,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Registration successful!");
      participantForm.reset();
      registerModal.style.display = "none";
      toggleBodyScroll(false);
    } else {
      alert("❌ Failed: " + (data.msg || "Invalid input"));
      console.error("Error:", data);
    }
  } catch (err) {
    console.error("Error submitting form:", err);
    alert("Server error. Please try again.");
  }
};

// ================= ADMIN LOGIN / SIGNUP POPUP =================
const adminModal = document.getElementById("adminModal");
const adminBoxBtn = document.getElementById("openAdminFromBox");
const navAdminBtn = document.getElementById("adminLoginBtn");
const closeAdmin = document.getElementById("adminClose");

adminBoxBtn.onclick = () => (adminModal.style.display = "flex");
navAdminBtn.onclick = () => (adminModal.style.display = "flex");
closeAdmin.onclick = () => (adminModal.style.display = "none");

// Login ↔ Signup toggle
const loginBox = document.getElementById("loginBox");
const signupBox = document.getElementById("signupBox");

document.getElementById("openSignup").onclick = () => {
  loginBox.style.display = "none";
  signupBox.style.display = "block";
};

document.getElementById("openLogin").onclick = () => {
  signupBox.style.display = "none";
  loginBox.style.display = "block";
};

document.getElementById("signupSubmit").onclick = () => {
  alert("Admin account created successfully!");
  loginBox.style.display = "block";
  signupBox.style.display = "none";
};

document.getElementById("loginSubmit").onclick = () => {
  alert("Logged in as Admin!");
  adminModal.style.display = "none";
};

// ================= CLOSE MODALS ON OUTSIDE CLICK =================
window.onclick = (e) => {
  if (e.target === registerModal) {
    registerModal.style.display = "none";
    toggleBodyScroll(false);
  }
  if (e.target === adminModal) adminModal.style.display = "none";
};

// ================= CLOSE MODALS ON ESC KEY =================
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    registerModal.style.display = "none";
    adminModal.style.display = "none";
    toggleBodyScroll(false);
  }
});

// ================= MOBILE NAV TOGGLE =================
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("show");
});

// ================= DYNAMIC EVENT CATEGORY LOGIC =================
const mainEventEl = document.getElementById("mainEvent");
const subEventEl = document.getElementById("subEvent");
const customEventEl = document.getElementById("customEvent");

if (mainEventEl && subEventEl && customEventEl) {
  const eventOptions = {
    hackathon: [
      "Tech Tambola",
      "Bug Fixing",
      "UI/UX Design",
      "Coding Marathon",
    ],
    cultural: ["Dance", "Singing", "Drama", "Fashion Show", "Art Display"],
  };

  mainEventEl.addEventListener("change", () => {
    const selected = mainEventEl.value;
    subEventEl.innerHTML = '<option value="">Select Category</option>';
    customEventEl.style.display = "none";
    subEventEl.style.display = "block";
    customEventEl.value = "";

    if (selected === "hackathon") {
      eventOptions.hackathon.forEach((e) => {
        const opt = document.createElement("option");
        opt.value = e.toLowerCase().replace(/\s+/g, "-");
        opt.textContent = e;
        subEventEl.appendChild(opt);
      });
    } else if (selected === "cultural") {
      eventOptions.cultural.forEach((e) => {
        const opt = document.createElement("option");
        opt.value = e.toLowerCase().replace(/\s+/g, "-");
        opt.textContent = e;
        subEventEl.appendChild(opt);
      });
    } else if (selected === "other") {
      subEventEl.style.display = "none";
      customEventEl.style.display = "block";
    }
  });
}

// ================= FETCH NOTICES FROM BACKEND =================
async function loadNotices() {
  try {
    const res = await fetch("/api/notices");
    const data = await res.json();

    const container = document.getElementById("noticeContainer");
    container.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p>No upcoming events at the moment.</p>";
      return;
    }

    data.forEach((notice) => {
      const div = document.createElement("div");
      div.classList.add("notice-box");
      div.innerHTML = `
        <h3>${notice.title}</h3>
        <p><strong>Date:</strong> ${notice.date}</p>
        <p><strong>Venue:</strong> ${notice.venue}</p>
        <p>${notice.description}</p>
        <button class="more-btn">View Details</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading notices:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadNotices);

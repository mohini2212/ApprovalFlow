/* ApprovalFlow dashboard tabs and mobile navigation */
document.addEventListener("DOMContentLoaded", function () {
  const buttons = Array.from(document.querySelectorAll(".tab-btn[data-tab]"));
  const panels = Array.from(document.querySelectorAll(".tab-panel"));
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const overlay = document.getElementById("sidebarOverlay");

  function openTab(tabId) {
    const target = document.getElementById(tabId);
    if (!target) return;
    buttons.forEach(button => {
      const active = button.dataset.tab === tabId;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    });
    panels.forEach(panel => panel.classList.toggle("active", panel.id === tabId));
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  buttons.forEach(button => button.addEventListener("click", () => openTab(button.dataset.tab)));
  document.querySelectorAll("[data-open-tab]").forEach(button => {
    button.addEventListener("click", () => openTab(button.dataset.openTab));
  });

  function toggleMenu() {
    if (!sidebar) return;
    sidebar.classList.toggle("open");
    if (overlay) overlay.classList.toggle("show", sidebar.classList.contains("open"));
  }
  if (menuToggle) menuToggle.addEventListener("click", toggleMenu);
  if (overlay) overlay.addEventListener("click", () => {
    sidebar?.classList.remove("open");
    overlay.classList.remove("show");
  });

  const user = JSON.parse(sessionStorage.getItem("currentUser") || "null");
  if (user) {
    const first = (user.name || "U").trim().charAt(0).toUpperCase();
    ["userAvatar", "settingsAvatar", "clientAvatar"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = first;
    });
    ["settingsName"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = user.name || "User";
    });
    const role = document.getElementById("settingsRole");
    if (role) role.textContent = user.role || "User";
  }

  const logout = document.getElementById("logoutBtn");
  if (logout) logout.addEventListener("click", function () {
    if (confirm("Are you sure you want to log out?")) {
      sessionStorage.removeItem("currentUser");
      window.location.href = "login.html";
    }
  });
});
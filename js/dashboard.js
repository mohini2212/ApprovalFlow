/* ApprovalFlow dashboard data and statistics */
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "null");
  const creatives = JSON.parse(localStorage.getItem("creatives") || "[]");
  const activities = JSON.parse(localStorage.getItem("approvalHistory") || "[]");

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    })[ch]);
  }
  function getUserCreatives() {
    if (!currentUser) return [];
    if (currentUser.role === "agency") return creatives;
    return creatives.filter(item =>
      item.clientEmail === currentUser.email || item.client === currentUser.name
    );
  }

  if (currentUser) {
    setText("userName", currentUser.name || "Agency User");
    setText("userEmail", currentUser.email || "");
    setText("userRole", currentUser.role || "");
    setText("clientName", currentUser.name || "Client");
    setText("clientEmail", currentUser.email || "");
    const welcome = document.getElementById("dashboardWelcome");
    if (welcome) welcome.textContent = `Welcome back, ${currentUser.name || "there"}!`;
    const clientWelcome = document.getElementById("welcomeMessage");
    if (clientWelcome) clientWelcome.textContent = `Welcome back, ${currentUser.name || "there"}!`;
  }

  const own = getUserCreatives();
  const pending = own.filter(item => item.status === "Pending").length;
  const approved = own.filter(item => item.status === "Approved").length;
  const changes = own.filter(item => item.status === "Changes Requested").length;
  setText("totalCreatives", own.length);
  setText("pendingCreatives", pending);
  setText("approvedCreatives", approved);
  setText("changesCreatives", changes);
  setText("changesRequested", changes);
  setText("notificationCount", pending);

  const recent = document.getElementById("recentActivity");
  if (recent) {
    const names = new Set(own.map(item => item.name));
    const latest = activities.filter(item => names.has(item.creativeName)).slice(-5).reverse();
    recent.innerHTML = latest.length ? latest.map(item =>
      `<div class="activity-item"><h4>${escapeHTML(item.creativeName)}</h4><p>${escapeHTML(item.action)}</p><small>${escapeHTML(item.date || "")}</small></div>`
    ).join("") : '<p class="empty-message">No recent activities available.</p>';
  }

  const approvedList = document.getElementById("approvedWorkList");
  if (approvedList) {
    const approvedItems = own.filter(item => item.status === "Approved");
    approvedList.innerHTML = approvedItems.length ? approvedItems.map(item =>
      `<div class="creative-item"><div><h4>${escapeHTML(item.name || "Creative")}</h4><p>${escapeHTML(item.client || item.clientEmail || "")}</p></div><span class="status-badge approved">Approved</span></div>`
    ).join("") : '<div class="empty-state"><i class="fa-solid fa-circle-check"></i><h3>No approved work yet</h3><p>Approved creatives will appear here.</p></div>';
  }
});

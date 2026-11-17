/* ==========================================
   APPROVAL FLOW - CLIENT DASHBOARD
   File: client.js
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 1. CHECK CLIENT DASHBOARD
    // ======================================

    const dashboard = document.querySelector(".client-dashboard");

    if (!dashboard) return;

    // ======================================
    // 2. LOAD CLIENT DATA
    // ======================================

    const currentUser = JSON.parse(
        sessionStorage.getItem("currentUser")
    );

    let creatives = JSON.parse(
        localStorage.getItem("creatives")
    ) || [];

    let approvalHistory = JSON.parse(
        localStorage.getItem("approvalHistory")
    ) || [];

    // ======================================
    // 3. DISPLAY CLIENT INFORMATION
    // ======================================

    function displayProfile() {

        if (!currentUser) return;

        updateElement("clientName", currentUser.name);
        updateElement("clientEmail", currentUser.email);

        const welcomeMessage = document.getElementById("welcomeMessage");

        if (welcomeMessage) {
            welcomeMessage.textContent =
                `Welcome back, ${currentUser.name}!`;
        }
    }

    // ======================================
    // 4. FILTER CLIENT CREATIVES
    // ======================================

    function getClientCreatives() {

        if (!currentUser) return [];

        return creatives.filter(creative => {

            return (
                creative.clientEmail === currentUser.email ||
                creative.client === currentUser.name
            );

        });
    }

    // ======================================
    // 5. UPDATE DASHBOARD STATISTICS
    // ======================================

    function updateStatistics() {

        const clientCreatives = getClientCreatives();

        const total = clientCreatives.length;

        const pending = clientCreatives.filter(
            item => item.status === "Pending"
        ).length;

        const approved = clientCreatives.filter(
            item => item.status === "Approved"
        ).length;

        const changes = clientCreatives.filter(
            item => item.status === "Changes Requested"
        ).length;

        updateElement("totalCreatives", total);
        updateElement("pendingCreatives", pending);
        updateElement("approvedCreatives", approved);
        updateElement("changesCreatives", changes);
    }

    // ======================================
    // 6. DISPLAY CREATIVES
    // ======================================

    function displayCreatives(data = getClientCreatives()) {

        const container = document.getElementById("clientCreativeList");

        if (!container) return;

        if (data.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    <h3>No creatives found</h3>
                    <p>Your uploaded creatives will appear here.</p>
                </div>
            `;

            return;
        }

        container.innerHTML = data.map(creative => `

            <div class="creative-card">

                <div class="creative-info">

                    <h3>${escapeHTML(creative.name || "Untitled Creative")}</h3>

                    <span class="status-badge">
                        ${escapeHTML(creative.status || "Pending")}
                    </span>

                </div>

                <p>
                    <strong>Upload Date:</strong>
                    ${escapeHTML(creative.date || "Not available")}
                </p>

                ${creative.fileUrl ? `
                    <a href="${escapeHTML(creative.fileUrl)}"
                       target="_blank"
                       rel="noopener noreferrer">
                        View Creative
                    </a>
                ` : ""}

                ${creative.feedback ? `
                    <p class="creative-feedback">
                        <strong>Feedback:</strong>
                        ${escapeHTML(creative.feedback)}
                    </p>
                ` : ""}

            </div>

        `).join("");
    }

    // ======================================
    // 7. SEARCH CREATIVES
    // ======================================

    const searchInput = document.getElementById("clientSearch");

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchValue = this.value.toLowerCase();

            const filteredData = getClientCreatives().filter(creative => {

                return (
                    (creative.name || "").toLowerCase().includes(searchValue) ||
                    (creative.status || "").toLowerCase().includes(searchValue)
                );

            });

            displayCreatives(filteredData);

        });
    }

    // ======================================
    // 8. DISPLAY RECENT ACTIVITY
    // ======================================

    function displayRecentActivity() {

        const container = document.getElementById("recentActivity");

        if (!container || !currentUser) return;

        const clientNames = new Set(
            getClientCreatives().map(item => item.name)
        );

        const clientHistory = approvalHistory
            .filter(item => clientNames.has(item.creativeName))
            .slice(-5)
            .reverse();

        if (clientHistory.length === 0) {

            container.innerHTML = `
                <p>No recent activity available.</p>
            `;

            return;
        }

        container.innerHTML = clientHistory.map(activity => `

            <div class="activity-item">

                <h4>${escapeHTML(activity.creativeName)}</h4>

                <p>${escapeHTML(activity.action)}</p>

                <small>${escapeHTML(activity.date)}</small>

            </div>

        `).join("");
    }

    // ======================================
    // 9. LOGOUT FUNCTION
    // ======================================

    const logoutButton = document.getElementById("logoutBtn");

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmLogout) {

                sessionStorage.removeItem("currentUser");

                window.location.href = "login.html";

            }

        });
    }

    // ======================================
    // 10. UPDATE HTML ELEMENTS
    // ======================================

    function updateElement(id, value) {

        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    // ======================================
    // 11. HTML SECURITY
    // ======================================

    function escapeHTML(value) {

        return String(value).replace(/[&<>"']/g, function (character) {

            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[character];

        });

    }

    // ======================================
    // 12. INITIALIZE CLIENT DASHBOARD
    // ======================================

    if (!currentUser || currentUser.role !== "client") {

        alert("Please login as a client to continue.");

        window.location.href = "login.html";

        return;
    }

    displayProfile();
    updateStatistics();
    displayCreatives();
    displayRecentActivity();

    console.log("ApprovalFlow Client Dashboard Loaded!");

});
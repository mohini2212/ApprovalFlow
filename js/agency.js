/* ==========================================
   APPROVAL FLOW - AGENCY DASHBOARD
   File: agency.js
========================================== */

// Wait until the HTML document is loaded
document.addEventListener("DOMContentLoaded", function () {

    // Check whether the current page is agency dashboard
    const isAgencyPage = document.querySelector(".agency-dashboard");

    if (!isAgencyPage) return;

    // ======================================
    // 1. LOAD DASHBOARD DATA
    // ======================================

    let creatives = JSON.parse(
        localStorage.getItem("creatives")
    ) || [];

    let clients = JSON.parse(
        localStorage.getItem("clients")
    ) || [];

    // ======================================
    // 2. UPDATE DASHBOARD STATISTICS
    // ======================================

    function updateStatistics() {

        const totalCreatives = creatives.length;

        const pendingCreatives = creatives.filter(
            item => item.status === "Pending"
        ).length;

        const approvedCreatives = creatives.filter(
            item => item.status === "Approved"
        ).length;

        const changesRequested = creatives.filter(
            item => item.status === "Changes Requested"
        ).length;

        updateElement("totalCreatives", totalCreatives);
        updateElement("pendingCreatives", pendingCreatives);
        updateElement("approvedCreatives", approvedCreatives);
        updateElement("changesRequested", changesRequested);
        updateElement("totalClients", clients.length);
    }

    function updateElement(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    // ======================================
    // 3. DISPLAY RECENT CREATIVES
    // ======================================

    function displayRecentCreatives() {

        const container = document.getElementById("recentCreatives");

        if (!container) return;

        if (creatives.length === 0) {
            container.innerHTML = `
                <p class="empty-message">
                    No creatives uploaded yet.
                </p>
            `;
            return;
        }

        container.innerHTML = creatives
            .slice(-5)
            .reverse()
            .map(item => `
                <div class="creative-item">

                    <div>
                        <h4>${escapeHTML(item.name || "Untitled Creative")}</h4>
                        <p>${escapeHTML(item.client || "No client assigned")}</p>
                    </div>

                    <span class="status-badge">
                        ${escapeHTML(item.status || "Pending")}
                    </span>

                </div>
            `).join("");
    }

    // ======================================
    // 4. DISPLAY CLIENTS
    // ======================================

    function displayClients() {

        const container = document.getElementById("clientList");

        if (!container) return;

        if (clients.length === 0) {
            container.innerHTML = `
                <p class="empty-message">
                    No clients added yet.
                </p>
            `;
            return;
        }

        container.innerHTML = clients.map(client => `
            <div class="client-item">

                <h4>${escapeHTML(client.name || "Unnamed Client")}</h4>

                <p>${escapeHTML(client.email || "No email available")}</p>

            </div>
        `).join("");
    }

    // ======================================
    // 5. SEARCH CREATIVES
    // ======================================

    const searchInput = document.getElementById("agencySearch");

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchValue = this.value.toLowerCase();

            const filteredCreatives = creatives.filter(item =>
                (item.name || "").toLowerCase().includes(searchValue) ||
                (item.client || "").toLowerCase().includes(searchValue)
            );

            const container = document.getElementById("recentCreatives");

            if (!container) return;

            container.innerHTML = filteredCreatives.map(item => `
                <div class="creative-item">

                    <div>
                        <h4>${escapeHTML(item.name || "Untitled Creative")}</h4>
                        <p>${escapeHTML(item.client || "No client assigned")}</p>
                    </div>

                    <span class="status-badge">
                        ${escapeHTML(item.status || "Pending")}
                    </span>

                </div>
            `).join("") || "<p>No matching creatives found.</p>";

        });
    }

    // ======================================
    // 6. LOGOUT FUNCTION
    // ======================================

    const logoutButton = document.getElementById("logoutBtn");

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmLogout) {
                sessionStorage.clear();
                window.location.href = "login.html";
            }

        });
    }

    // ======================================
    // 7. HTML SAFETY
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
    // 8. INITIALIZE DASHBOARD
    // ======================================

    updateStatistics();
    displayRecentCreatives();
    displayClients();

    console.log("ApprovalFlow Agency Dashboard Loaded Successfully!");

});
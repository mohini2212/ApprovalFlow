/* ==========================================
   APPROVAL FLOW - CREATIVE APPROVAL SYSTEM
   File: approval.js
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 1. LOAD DATA
    // ======================================

    let creatives = JSON.parse(
        localStorage.getItem("creatives")
    ) || [];

    let approvalHistory = JSON.parse(
        localStorage.getItem("approvalHistory")
    ) || [];

    // ======================================
    // 2. SAVE DATA
    // ======================================

    function saveCreatives() {
        localStorage.setItem(
            "creatives",
            JSON.stringify(creatives)
        );
    }

    function saveHistory() {
        localStorage.setItem(
            "approvalHistory",
            JSON.stringify(approvalHistory)
        );
    }

    // ======================================
    // 3. DISPLAY CREATIVES
    // ======================================

    function displayCreatives() {

        const container = document.getElementById("approvalList");

        if (!container) return;

        if (creatives.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No creatives available</h3>
                    <p>New creatives will appear here for review.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = creatives.map((creative, index) => {

            const status = creative.status || "Pending";

            return `
                <div class="approval-card">

                    <div class="approval-header">

                        <h3>${escapeHTML(creative.name || "Untitled Creative")}</h3>

                        <span class="status-badge">
                            ${escapeHTML(status)}
                        </span>

                    </div>

                    <p>
                        <strong>Client:</strong>
                        ${escapeHTML(creative.client || "Not specified")}
                    </p>

                    <p>
                        <strong>Uploaded:</strong>
                        ${escapeHTML(creative.date || "Not specified")}
                    </p>

                    ${creative.fileUrl ? `
                        <a href="${escapeHTML(creative.fileUrl)}"
                           target="_blank"
                           rel="noopener noreferrer">
                           View Creative
                        </a>
                    ` : ""}

                    ${creative.feedback ? `
                        <p class="feedback-text">
                            <strong>Previous Feedback:</strong>
                            ${escapeHTML(creative.feedback)}
                        </p>
                    ` : ""}

                    ${status === "Pending" || status === "Changes Requested" ? `

                        <div class="approval-actions">

                            <button
                                class="approve-btn"
                                data-index="${index}">
                                Approve
                            </button>

                            <button
                                class="changes-btn"
                                data-index="${index}">
                                Request Changes
                            </button>

                        </div>

                    ` : ""}

                </div>
            `;

        }).join("");

    }

    // ======================================
    // 4. APPROVE CREATIVE
    // ======================================

    function approveCreative(index) {

        const creative = creatives[index];

        if (!creative) return;

        const confirmed = confirm(
            "Are you sure you want to approve this creative?"
        );

        if (!confirmed) return;

        creative.status = "Approved";
        creative.feedback = "";

        creative.approvedAt = new Date().toLocaleString();

        approvalHistory.push({
            creativeName: creative.name,
            action: "Approved",
            date: new Date().toLocaleString()
        });

        saveCreatives();
        saveHistory();

        displayCreatives();

        alert("Creative approved successfully!");

    }

    // ======================================
    // 5. REQUEST CHANGES
    // ======================================

    function requestChanges(index) {

        const creative = creatives[index];

        if (!creative) return;

        const feedback = prompt(
            "Please describe the changes required:"
        );

        if (feedback === null) return;

        if (!feedback.trim()) {
            alert("Please enter feedback before submitting.");
            return;
        }

        creative.status = "Changes Requested";
        creative.feedback = feedback.trim();

        approvalHistory.push({
            creativeName: creative.name,
            action: "Changes Requested",
            feedback: feedback.trim(),
            date: new Date().toLocaleString()
        });

        saveCreatives();
        saveHistory();

        displayCreatives();

        alert("Your feedback has been submitted to the agency.");

    }

    // ======================================
    // 6. HANDLE BUTTON CLICKS
    // ======================================

    const approvalContainer = document.getElementById("approvalList");

    if (approvalContainer) {

        approvalContainer.addEventListener("click", function (event) {

            const approveButton = event.target.closest(".approve-btn");
            const changesButton = event.target.closest(".changes-btn");

            if (approveButton) {

                const index = Number(approveButton.dataset.index);

                approveCreative(index);

            }

            if (changesButton) {

                const index = Number(changesButton.dataset.index);

                requestChanges(index);

            }

        });

    }

    // ======================================
    // 7. DISPLAY APPROVAL HISTORY
    // ======================================

    function displayHistory() {

        const container = document.getElementById("approvalHistory");

        if (!container) return;

        if (approvalHistory.length === 0) {

            container.innerHTML = `
                <p>No approval activity yet.</p>
            `;

            return;
        }

        container.innerHTML = approvalHistory
            .slice()
            .reverse()
            .map(item => `

                <div class="history-item">

                    <h4>${escapeHTML(item.creativeName || "Creative")}</h4>

                    <p>
                        ${escapeHTML(item.action)}
                    </p>

                    <small>${escapeHTML(item.date)}</small>

                    ${item.feedback ? `
                        <p>${escapeHTML(item.feedback)}</p>
                    ` : ""}

                </div>

            `).join("");

    }

    // ======================================
    // 8. UPDATE APPROVAL COUNTS
    // ======================================

    function updateCounts() {

        const pending = creatives.filter(
            item => item.status === "Pending"
        ).length;

        const approved = creatives.filter(
            item => item.status === "Approved"
        ).length;

        const changes = creatives.filter(
            item => item.status === "Changes Requested"
        ).length;

        updateElement("pendingCount", pending);
        updateElement("approvedCount", approved);
        updateElement("changesCount", changes);

    }

    function updateElement(id, value) {

        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }

    }

    // ======================================
    // 9. HTML SECURITY
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
    // 10. INITIALIZE APPROVAL SYSTEM
    // ======================================

    displayCreatives();
    displayHistory();
    updateCounts();

    console.log("ApprovalFlow Approval System Loaded!");

});
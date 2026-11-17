/* ==========================================
   APPROVAL FLOW - CREATIVE UPLOAD SYSTEM
   File: upload.js
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 1. GET HTML ELEMENTS
    // ======================================

    const uploadForm = document.getElementById("uploadForm");

    const fileInput = document.getElementById("creativeFile");

    const creativeList = document.getElementById("uploadedCreatives");

    // ======================================
    // 2. LOAD EXISTING DATA
    // ======================================

    let creatives = JSON.parse(
        localStorage.getItem("creatives")
    ) || [];

    let clients = JSON.parse(
        localStorage.getItem("clients")
    ) || [];

    // ======================================
    // 3. SAVE CREATIVES
    // ======================================

    function saveCreatives() {

        localStorage.setItem(
            "creatives",
            JSON.stringify(creatives)
        );

    }

    // ======================================
    // 4. FILE VALIDATION
    // ======================================

    function validateFile(file) {

        if (!file) {

            alert("Please select a creative file.");

            return false;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
            "video/mp4"
        ];

        const maxSize = 10 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {

            alert("Only JPG, PNG, WEBP, PDF and MP4 files are allowed.");

            return false;
        }

        if (file.size > maxSize) {

            alert("File size must be less than 10 MB.");

            return false;
        }

        return true;
    }

    // ======================================
    // 5. UPLOAD CREATIVE
    // ======================================

    if (uploadForm) {

        uploadForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.getElementById("creativeName")?.value.trim();

            const description = document.getElementById("creativeDescription")?.value.trim();

            const clientEmail = document.getElementById("creativeClient")?.value;

            const file = fileInput?.files[0];

            // Check required fields

            if (!name || !clientEmail || !file) {

                alert("Please complete all required fields.");

                return;
            }

            if (!validateFile(file)) return;

            // Find selected client

            const selectedClient = clients.find(
                client => client.email === clientEmail
            );

            if (!selectedClient) {

                alert("Selected client was not found. Please check the client list.");

                return;
            }

            // Convert file into Base64 for local demonstration

            const reader = new FileReader();

            reader.onload = function () {

                const creative = {

                    id: Date.now(),

                    name: name,

                    description: description,

                    client: selectedClient.name,

                    clientEmail: selectedClient.email,

                    fileName: file.name,

                    fileType: file.type,

                    fileUrl: reader.result,

                    date: new Date().toLocaleDateString(),

                    status: "Pending",

                    feedback: ""

                };

                creatives.push(creative);

                saveCreatives();

                alert("Creative uploaded successfully!");

                uploadForm.reset();

                displayCreatives();

            };

            reader.onerror = function () {

                alert("Unable to read the selected file. Please try again.");

            };

            reader.readAsDataURL(file);

        });

    }

    // ======================================
    // 6. DISPLAY UPLOADED CREATIVES
    // ======================================

    function displayCreatives() {

        if (!creativeList) return;

        if (creatives.length === 0) {

            creativeList.innerHTML = `
                <p class="empty-message">
                    No creatives uploaded yet.
                </p>
            `;

            return;
        }

        creativeList.innerHTML = creatives.map(creative => `

            <div class="creative-card">

                <div class="creative-details">

                    <h3>${escapeHTML(creative.name)}</h3>

                    <p>${escapeHTML(creative.description || "No description")}</p>

                    <p>
                        <strong>Client:</strong>
                        ${escapeHTML(creative.client)}
                    </p>

                    <p>
                        <strong>File:</strong>
                        ${escapeHTML(creative.fileName)}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${escapeHTML(creative.status)}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${escapeHTML(creative.date)}
                    </p>

                    <a href="${escapeHTML(creative.fileUrl)}"
                       target="_blank"
                       rel="noopener noreferrer">
                        View File
                    </a>

                    <button
                        class="delete-creative"
                        data-id="${creative.id}">
                        Delete
                    </button>

                </div>

            </div>

        `).join("");

    }

    // ======================================
    // 7. DELETE CREATIVE
    // ======================================

    if (creativeList) {

        creativeList.addEventListener("click", function (event) {

            const deleteButton = event.target.closest(".delete-creative");

            if (!deleteButton) return;

            const creativeId = Number(deleteButton.dataset.id);

            const confirmed = confirm(
                "Are you sure you want to delete this creative?"
            );

            if (!confirmed) return;

            creatives = creatives.filter(
                creative => creative.id !== creativeId
            );

            saveCreatives();

            displayCreatives();

            alert("Creative deleted successfully!");

        });

    }

    // ======================================
    // 8. HTML SECURITY
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
    // 9. INITIALIZE UPLOAD SYSTEM
    // ======================================

    displayCreatives();

    console.log("ApprovalFlow Upload System Loaded Successfully!");

});
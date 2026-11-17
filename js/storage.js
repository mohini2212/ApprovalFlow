/* ==========================================
   APPROVAL FLOW - STORAGE MANAGEMENT
   File: storage.js
========================================== */

const ApprovalFlowStorage = {

    // ======================================
    // 1. SAVE DATA
    // ======================================

    save: function (key, data) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error("Error saving data:", error);

            return false;

        }
    },


    // ======================================
    // 2. GET DATA
    // ======================================

    get: function (key, defaultValue = null) {

        try {

            const data = localStorage.getItem(key);

            if (data === null) {
                return defaultValue;
            }

            return JSON.parse(data);

        } catch (error) {

            console.error("Error retrieving data:", error);

            return defaultValue;

        }
    },


    // ======================================
    // 3. UPDATE DATA
    // ======================================

    update: function (key, newData) {

        const existingData = this.get(key);

        if (
            !Array.isArray(existingData) ||
            !Array.isArray(newData)
        ) {

            console.error("Update requires array data.");

            return false;

        }

        const updatedData = [
            ...existingData,
            ...newData
        ];

        return this.save(key, updatedData);

    },


    // ======================================
    // 4. DELETE DATA
    // ======================================

    remove: function (key) {

        try {

            localStorage.removeItem(key);

            return true;

        } catch (error) {

            console.error("Error deleting data:", error);

            return false;

        }
    },


    // ======================================
    // 5. CLEAR APPLICATION DATA
    // ======================================

    clearAll: function () {

        try {

            localStorage.clear();

            console.log("Application data cleared.");

            return true;

        } catch (error) {

            console.error("Error clearing storage:", error);

            return false;

        }
    },


    // ======================================
    // 6. SESSION MANAGEMENT
    // ======================================

    setSession: function (user) {

        try {

            sessionStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );

            return true;

        } catch (error) {

            console.error("Session error:", error);

            return false;

        }
    },


    // ======================================
    // 7. GET CURRENT USER
    // ======================================

    getSession: function () {

        try {

            const user = sessionStorage.getItem("currentUser");

            return user ? JSON.parse(user) : null;

        } catch (error) {

            console.error("Unable to retrieve session:", error);

            return null;

        }
    },


    // ======================================
    // 8. LOGOUT
    // ======================================

    logout: function () {

        sessionStorage.removeItem("currentUser");

        console.log("User logged out successfully.");

        window.location.href = "login.html";

    },


    // ======================================
    // 9. CHECK STORAGE KEY
    // ======================================

    exists: function (key) {

        return localStorage.getItem(key) !== null;

    },


    // ======================================
    // 10. GET ALL STORAGE KEYS
    // ======================================

    getAllKeys: function () {

        return Object.keys(localStorage);

    }

};


// ==========================================
// INITIALIZE STORAGE SYSTEM
// ==========================================

console.log("ApprovalFlow Storage System Loaded Successfully!");
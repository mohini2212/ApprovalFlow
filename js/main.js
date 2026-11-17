// 1. MOBILE NAVIGATION MENU

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("show");

        const isOpen = navLinks.classList.contains("show");

        menuToggle.setAttribute("aria-expanded", isOpen);

        menuToggle.innerHTML = isOpen ? "&times;" : "☰";

    });


    // Close menu after clicking a navigation link

    const navItems = document.querySelectorAll(".nav-links a");

    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            navLinks.classList.remove("show");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.innerHTML = "☰";

        });

    });


    // Close menu when clicking outside

    document.addEventListener("click", function (event) {

        if (
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {

            navLinks.classList.remove("show");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.innerHTML = "☰";

        }

    });


    // Close menu using Escape key

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            navLinks.classList.remove("show");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.innerHTML = "☰";

        }

    });

}


// 2. SMOOTH SCROLLING

document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const targetSection = document.querySelector(targetId);

        if (targetSection) {

            event.preventDefault();

            targetSection.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    });

});


// 3. NAVBAR ACTIVE LINK

const sections = document.querySelectorAll("main section[id]");

const navigationLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", function () {

    let currentSection = "";

    sections.forEach(function (section) {

        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {

            currentSection = section.getAttribute("id");

        }

    });


    navigationLinks.forEach(function (link) {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {

            link.classList.add("active");

        }

    });

});


// 4. SCROLL TO TOP ON PAGE REFRESH

window.addEventListener("load", function () {

    if (window.location.hash === "") {

        window.scrollTo({

            top: 0,

            behavior: "instant"

        });

    }

});


console.log("Approval Flow website loaded successfully!");

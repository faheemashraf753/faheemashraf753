/* =========================================================
   NAVIGATION
   Mobile menu and active section navigation
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------------------------------
    // ELEMENTS
    // -----------------------------------------------------

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    const navLinks = document.querySelectorAll(".nav-link");

    const sections = document.querySelectorAll(
        "#home, #about, #skills, #projects, #journey, #contact"
    );


    // -----------------------------------------------------
    // MOBILE MENU
    // -----------------------------------------------------

    function openMenu() {

        if (!menuToggle || !navigation) return;

        navigation.classList.add("open");
        menuToggle.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }


    function closeMenu() {

        if (!menuToggle || !navigation) return;

        navigation.classList.remove("open");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }


    function toggleMenu() {

        if (!navigation) return;

        const menuIsOpen = navigation.classList.contains("open");

        if (menuIsOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }


    // -----------------------------------------------------
    // MENU EVENT LISTENERS
    // -----------------------------------------------------

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", toggleMenu);


        // Close menu after clicking a navigation link.

        navLinks.forEach((link) => {

            link.addEventListener("click", closeMenu);

        });


        // Close menu when clicking outside.

        document.addEventListener("click", (event) => {

            const clickedNavigation = navigation.contains(event.target);

            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedNavigation && !clickedToggle) {
                closeMenu();
            }

        });


        // Close menu with Escape key.

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

    }


    // -----------------------------------------------------
    // ACTIVE NAVIGATION
    // -----------------------------------------------------

    function updateActiveLink() {

        let activeSection = "";

        sections.forEach((section) => {

            const sectionTop = section.offsetTop;

            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop - 250 &&
                window.scrollY < sectionTop + sectionHeight
            ) {

                activeSection = section.id;

            }

        });


        navLinks.forEach((link) => {

            link.classList.remove("active");

            if (link.getAttribute("href") === `#${activeSection}`) {

                link.classList.add("active");

            }

        });

    }


    // -----------------------------------------------------
    // SCROLL LISTENER
    // -----------------------------------------------------

    window.addEventListener("scroll", updateActiveLink, {
        passive: true
    });


    // Initial state.

    updateActiveLink();

});
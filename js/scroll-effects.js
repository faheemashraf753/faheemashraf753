/* =========================================================
   SCROLL EFFECTS
   Scroll progress, reveal animations and back-to-top
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------------------------------
    // ELEMENTS
    // -----------------------------------------------------

    const scrollProgress = document.getElementById("scrollProgress");

    const backToTop = document.getElementById("backToTop");


    // -----------------------------------------------------
    // SCROLL PROGRESS
    // -----------------------------------------------------

    function updateScrollProgress() {

        if (!scrollProgress) return;

        const scrollTop = window.scrollY;

        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollHeight > 0
            ? (scrollTop / scrollHeight) * 100
            : 0;

        scrollProgress.style.width = `${progress}%`;

    }


    // -----------------------------------------------------
    // BACK TO TOP
    // -----------------------------------------------------

    function updateBackToTop() {

        if (!backToTop) return;

        if (window.scrollY > 500) {

            backToTop.classList.add("visible");

        } else {

            backToTop.classList.remove("visible");

        }

    }


    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // -----------------------------------------------------
    // SCROLL REVEAL
    // -----------------------------------------------------

    const revealElements = document.querySelectorAll(
        ".about-header, .about-content, " +
        ".skills-header, .skill-card, " +
        ".projects-header, .project-item, " +
        ".journey-header, .journey-column, " +
        ".contact-content"
    );


    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    if (prefersReducedMotion) {

        // Display elements immediately for reduced-motion users.

        revealElements.forEach((element) => {

            element.classList.add("revealed");

        });

    } else if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("revealed");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


        revealElements.forEach((element) => {

            element.classList.add("reveal");

            revealObserver.observe(element);

        });

    } else {

        // Fallback for older browsers.

        revealElements.forEach((element) => {

            element.classList.add("revealed");

        });

    }


    // -----------------------------------------------------
    // SCROLL EVENT
    // -----------------------------------------------------

    function handleScroll() {

        updateScrollProgress();

        updateBackToTop();

    }


    window.addEventListener("scroll", handleScroll, {
        passive: true
    });


    // Initial update.

    handleScroll();

});
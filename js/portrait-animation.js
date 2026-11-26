/* =========================================================
   PORTRAIT ANIMATION
   Floating portrait and subtle pointer interaction
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------------------------------
    // ELEMENTS
    // -----------------------------------------------------

    const portraitWrapper = document.querySelector(".portrait-wrapper");

    if (!portraitWrapper) return;


    // -----------------------------------------------------
    // ACCESSIBILITY
    // -----------------------------------------------------

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    // Activate the CSS floating animation.

    portraitWrapper.classList.add("portrait-motion");


    // Avoid additional motion when reduced motion is enabled.

    if (prefersReducedMotion) return;


    // -----------------------------------------------------
    // POINTER INTERACTION
    // -----------------------------------------------------

    const isFinePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!isFinePointer) return;


    portraitWrapper.addEventListener("mousemove", (event) => {

        const bounds = portraitWrapper.getBoundingClientRect();

        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        const pointerX = event.clientX - bounds.left;
        const pointerY = event.clientY - bounds.top;

        const rotationY = ((pointerX - centerX) / centerX) * 5;
        const rotationX = ((centerY - pointerY) / centerY) * 5;

        portraitWrapper.style.setProperty(
            "--portrait-rotate-x",
            `${rotationX}deg`
        );

        portraitWrapper.style.setProperty(
            "--portrait-rotate-y",
            `${rotationY}deg`
        );

    });


    // -----------------------------------------------------
    // RESET INTERACTION
    // -----------------------------------------------------

    portraitWrapper.addEventListener("mouseleave", () => {

        portraitWrapper.style.setProperty(
            "--portrait-rotate-x",
            "0deg"
        );

        portraitWrapper.style.setProperty(
            "--portrait-rotate-y",
            "0deg"
        );

    });

});
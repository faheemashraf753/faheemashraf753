# Faheem — Portfolio

A responsive, single-page portfolio built with HTML, CSS and JavaScript, with an optional Three.js background.

## Run locally

1. Open this repository folder in VS Code.
2. Open `portfolio/index.html` with the Live Server extension.
3. Keep an internet connection available for Google Fonts and the Three.js CDN module.

The portfolio does not need Python, npm or a build step.

## Files

- `index.html` — page content and sections
- `style.css` — responsive visual system and animations
- `script.js` — navigation, typing and scroll reveal
- `3d-scene.js` — optional Three.js background
- `portrait.js` — interactive particle portrait

## Portrait asset

The page loads `../assets/profile/portrait-dots.svg`. Keep that generated SVG in place. The original source photograph is intentionally excluded from Git by the root `.gitignore`.

## Notes

- The Three.js scene is progressively enhanced. If WebGL or the CDN is unavailable, the page content remains usable with the CSS background.
- Reduced-motion preferences are respected.
- The ROSE architecture diagram is a high-level project representation; it does not imply every planned integration is complete.
- Update project repository links when the corresponding public repositories are available.

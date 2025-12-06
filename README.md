# Flight Patterns

A cinematic, scroll-driven story of the Arctic Tern’s pole-to-pole migration with parallax, glassmorphism, and a scroll-tied bird animation.

## Files
- index.html — semantic single-page structure with six stages
- css/styles.css — visual design, glass cards, parallax layers, responsive type, reduced-motion support
- js/script.js — lazy background loading, IntersectionObserver reveals, Antarctic crossfade, bird zigzag and wing flapping
- images/ — place assets here

## Expected image assets
Please add the following images under `images/` (filenames must match):
- arctic_breeding.jpg
- north_atlantic.jpg
- mid_atlantic.jpg
- southern_ocean.jpg
- antarctic_day.jpg
- antarctic_night.jpg
- return_north.jpg
- tern_wings_up.png
- tern_wings_down.png

Optional: images/favicon.png

## Notes
- Animations and parallax are disabled for users with `prefers-reduced-motion`.
- Backgrounds are lazy-loaded as each section nears the viewport for performance.
- Antarctic day/night crossfade is tied to scroll progress within that section.
# use-git-emmalinelehman

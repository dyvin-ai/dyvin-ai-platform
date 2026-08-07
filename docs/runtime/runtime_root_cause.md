# Runtime Root Cause Analysis

## Root Cause Summary

The visual degradation where enterprise components appeared as unstyled stacked vertical HTML was caused by missing Tailwind CSS directives (`@tailwind base; @tailwind components; @tailwind utilities;`) in `frontend/src/styles/globals.css`.

## Technical Explanation

1. **Build Success vs Runtime CSS Emission**:
   Vite compiled TypeScript and CSS without error because standard CSS variables were present in `globals.css`. However, because `@tailwind base; @tailwind components; @tailwind utilities;` was omitted from the top of `globals.css`, PostCSS did not process JSX class names into actual CSS rules.

2. **Class Resolution Failure**:
   Classes like `min-h-screen`, `flex`, `hidden`, `lg:flex`, `lg:w-1/2`, `bg-sidebar`, `p-12`, `w-full`, `max-w-md`, and `grid` were present in the JSX DOM tree but had zero matching CSS rules in the browser stylesheet.

3. **Resolution**:
   Adding `@tailwind base; @tailwind components; @tailwind utilities;` to `frontend/src/styles/globals.css` restored full Tailwind CSS compilation and utility class generation across all pages and layouts.

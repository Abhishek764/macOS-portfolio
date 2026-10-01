# Premium macOS Portfolio Design

## Goal

Elevate the existing macOS desktop portfolio into a premium hybrid portfolio: retain the interactive desktop simulator as the signature experience while making the portfolio content immediately understandable, polished, responsive, and visually cohesive.

## Design principles

- The desktop simulator remains the primary visual identity.
- First-load experience should explain who Abhishek is without requiring icon discovery.
- System UI uses macOS/SF Symbols-inspired iconography with consistent optical sizing and stroke weight.
- Portfolio content uses branded project assets where appropriate, without replacing system controls with generic emoji.
- Motion is springy and expressive but restrained; reduced-motion users receive equivalent non-animated state changes.
- Existing interactions remain available: boot screen, draggable windows, Dock, widgets, wallpapers, context menus, and app launching.

## Visual system

- Sequoia-inspired wallpaper and translucent surfaces with layered blur.
- macOS-like window chrome, shadows, focus/inactive states, toolbar spacing, and corner radii.
- Clear typography hierarchy using the current system font stack.
- Consistent blue accent for primary actions, neutral glass controls for secondary actions, and status colors only for semantic feedback.
- Desktop labels remain readable over wallpaper with shadow/contrast treatment.

## Information architecture

### Welcome surface

Add a centered welcome/hero window on first load. It contains a concise positioning statement, portrait, primary actions for Projects and Resume, and secondary links for GitHub, LinkedIn, and email. It should feel like a native app surface rather than a traditional landing-page hero.

### Projects

Make Projects the main portfolio surface. Use a Finder-like layout with a lightweight category/sidebar treatment, polished project cards, technology badges, impact metrics, and clear Live/GitHub actions. Cards should support hover/focus states and remain readable in light and dark modes.

### Resume

Present Resume like Preview: document metadata, toolbar actions, tabbed Full-Stack/DevOps variants, readable sections, and a clear PDF download action.

### About and supporting apps

Refine About into a profile/contact surface with portrait, positioning statement, capability groups, and contact actions. Refine Photos, Certifications, Terminal, and Settings so their chrome and controls follow the same system visual language.

## Motion

- Window open: scale/fade/spring from the launch point.
- Window close: short scale/fade exit.
- Minimize: restrained Genie-like movement toward the Dock.
- Dock: pointer-aware magnification, launch bounce, and smooth restore/focus feedback.
- Window content: short staggered reveals for headings, cards, and sections.
- Controls: press feedback, hover lift, focus rings, and subtle status transitions.
- Add `prefers-reduced-motion` fallbacks that disable transform-heavy effects and use short opacity transitions or immediate updates.

## Iconography

- Use Apple/macOS/SF Symbols-inspired iconography for system actions, toolbar controls, Finder/Preview/Terminal/Photos/Settings treatments, documents, and navigation.
- Prefer existing icon assets for app identity when they are personal or project-specific.
- Avoid emoji and mixed icon libraries in system chrome.
- Include labels/tooltips for unfamiliar icon-only actions and preserve keyboard focus visibility.

## Responsive behavior

- Desktop and large tablet: preserve the full interactive desktop experience.
- Small screens: retain the visual shell but switch to a controlled app launcher/window layout so content is usable without precise dragging.
- Ensure critical portfolio actions remain reachable by keyboard and touch.

## Validation

- Run the smallest meaningful project checks after implementation, at minimum TypeScript/build validation.
- Verify light/dark modes, boot-to-desktop flow, window lifecycle animations, Dock interaction, reduced-motion behavior, and mobile usability.
- Check that all new icons have accessible labels/tooltips and that portfolio links still open safely in new tabs.

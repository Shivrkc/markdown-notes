# Markdown Notes

## Project Vision

Build a premium, modern Markdown Notes web application that feels like a polished 2026-era SaaS/product website.

This is NOT a basic college-style CRUD notes app.

The application should be visually impressive, highly interactive, smooth to use, and feel carefully designed. It should look like something that could genuinely be launched as a small developer product.

This repository will also be used as a real deployment target for HAVN (CloudForge), so the final application MUST remain Docker-deployable.

---

# Product

Create a beautiful Markdown writing environment where users can:

- Create notes
- Edit notes
- Delete notes
- Search notes
- Organize notes
- Write Markdown
- See live Markdown preview
- Persist notes locally
- Quickly switch between notes
- Enjoy a polished writing experience

No backend is required.

Use browser LocalStorage for persistence.

---

# Visual Direction

The visual quality is a HIGH PRIORITY.

Do not create a generic dashboard template.

The application should have:

- Premium typography
- Excellent spacing
- Strong visual hierarchy
- Beautiful cards and panels
- Layered surfaces
- Subtle gradients
- Glass effects where appropriate
- Soft shadows
- Depth
- Smooth transitions
- Micro-interactions
- Carefully designed hover states
- Elegant empty states
- Responsive layouts
- Professional iconography

The interface should feel alive without becoming distracting.

Avoid excessive visual noise.

---

# 3D & Motion

Use tasteful 3D and motion effects where they genuinely improve the experience.

Possible techniques include:

- CSS 3D transforms
- Perspective effects
- Floating UI elements
- Subtle depth/parallax
- Animated background elements
- Smooth panel transitions
- Spring-like interactions
- Hover elevation
- Magnetic-style button interactions
- Animated gradients
- Soft glowing elements
- Cursor-reactive effects
- Smooth page transitions
- Animated note cards
- Subtle tilt effects

Animations should feel intentional and premium.

Do NOT add random animations everywhere.

Performance must remain good.

---

# Cursor Experience

Create a custom cursor experience appropriate for a modern creative/developer product.

Consider multiple cursor states such as:

- Default cursor
- Pointer/interactive cursor
- Button hover state
- Text/editor cursor state
- Drag state
- Resize state

The cursor should react subtly to interactive elements.

Do not make the cursor annoying or difficult to use.

On touch devices, disable custom cursor behavior and use normal touch interactions.

---

# Interactive Micro-Interactions

Add polished interactions throughout the application.

Examples:

- Buttons respond smoothly to hover and press
- Note cards subtly lift/tilt on hover
- Active note transitions smoothly
- Sidebar selection has animated feedback
- Search interaction feels responsive
- Delete actions have appropriate confirmation/feedback
- Save state is visually communicated
- Preview updates smoothly
- Tooltips appear naturally
- Icons animate subtly when appropriate
- Empty states have tasteful motion
- Navigation transitions smoothly

Every interaction should feel deliberate.

---

# Main Layout

Design a premium notes workspace.

A possible structure:

┌─────────────────────────────────────────────┐
│ Brand / Search / Actions / Theme            │
├──────────────┬────────────────┬─────────────┤
│              │                │             │
│ Notes        │ Markdown       │ Live        │
│ Sidebar      │ Editor         │ Preview     │
│              │                │             │
│              │                │             │
└──────────────┴────────────────┴─────────────┘

You may improve this structure if a better UX is discovered.

The layout must work beautifully on:

- Desktop
- Laptop
- Tablet
- Mobile

On smaller screens, intelligently collapse or transform the editor/preview experience rather than simply shrinking everything.

---

# Notes Sidebar

Create a visually polished notes sidebar.

Include:

- New Note button
- Search
- Note list
- Active note indicator
- Note title
- Updated timestamp
- Optional short preview
- Delete action
- Empty state

Use smooth transitions when switching notes.

---

# Markdown Editor

The editor should feel like a real writing tool.

Include:

- Comfortable typography
- Excellent line height
- Syntax-friendly Markdown editing
- Code-friendly text presentation
- Comfortable padding
- Clear focus state
- Keyboard-friendly interaction

Support common Markdown:

- Headings
- Bold
- Italic
- Links
- Ordered lists
- Unordered lists
- Code blocks
- Inline code
- Blockquotes
- Horizontal rules

Use a reliable Markdown rendering library if appropriate.

---

# Live Preview

The preview should render Markdown beautifully.

Style:

- Headings
- Paragraphs
- Lists
- Links
- Blockquotes
- Inline code
- Code blocks
- Tables if supported
- Horizontal rules

Code blocks should look like a modern developer documentation site.

---

# Theme

Implement a polished theme system.

At minimum:

- Dark mode
- Light mode

Theme switching should have a smooth visual transition.

Both themes must be intentionally designed.

Do not simply invert colors.

---

# Background & Atmosphere

The application may use subtle atmospheric effects such as:

- Gradient meshes
- Soft glows
- Noise/grain
- Floating particles
- Animated blobs
- Grid patterns
- Light rays
- Subtle depth layers

Use these carefully.

The content and writing experience must remain the focus.

---

# Typography

Use a modern font stack.

Typography should distinguish:

- Application navigation
- Note titles
- Editor text
- Markdown preview
- Metadata
- Buttons
- Labels

Avoid excessive font sizes or overly decorative typography.

---

# Responsive Design

Desktop:
- Full notes sidebar
- Editor
- Preview

Tablet:
- Adaptive panel sizing
- Intelligent sidebar behavior

Mobile:
- Sidebar becomes a drawer or separate view
- Editor and preview can switch between tabs/views
- Controls remain accessible
- No horizontal overflow

Test common viewport sizes.

---

# Data Model

Each note should contain:

- id
- title
- content
- createdAt
- updatedAt

Persist all notes in LocalStorage.

Notes must survive:

- Page refresh
- Browser restart

---

# UX Details

Include polished states for:

- No notes
- No search results
- Empty editor
- Saving
- Saved
- Deleting
- Loading
- Errors

Do not fake server loading states because there is no backend.

Use realistic local UI feedback.

---

# Keyboard Shortcuts

Add useful shortcuts where appropriate.

Examples:

- New note
- Search
- Save
- Delete
- Toggle preview

Show shortcuts in tooltips or command/help UI where useful.

Do not implement shortcuts that conflict with normal browser/editor behavior.

---

# Accessibility

Despite the visual effects, maintain good accessibility.

Requirements:

- Keyboard navigation
- Visible focus states
- Semantic buttons
- Accessible labels
- Appropriate ARIA where needed
- Good contrast
- Reduced-motion support

If the user has `prefers-reduced-motion`, substantially reduce or disable decorative animations.

---

# Performance

Visual quality must not destroy performance.

Requirements:

- Avoid unnecessary re-renders
- Avoid heavy animation loops
- Avoid huge dependencies
- Prefer CSS animations where appropriate
- Clean up event listeners
- Clean up animation frames/timers
- Lazy-load expensive functionality if necessary

The app should feel smooth on normal hardware.

---

# Technology

Use a modern frontend stack appropriate for a lightweight application.

Prefer:

- React
- TypeScript
- Vite
- Tailwind CSS if already available
- Existing project dependencies where possible

Do not add dependencies unnecessarily.

If a library is genuinely needed for:

- Markdown rendering
- Animation
- Icons
- UI interaction

then use a well-maintained lightweight library.

Do not build complex functionality from scratch just to avoid a dependency.

---

# Docker

The repository MUST contain a root-level:

Dockerfile

The Dockerfile must:

1. Install dependencies
2. Build the production frontend
3. Serve the production application
4. Exit successfully during `docker build`

The final repository must work with:

GitHub
→ clone
→ Docker build
→ Docker image

The Dockerfile must be suitable for HAVN/CloudForge deployment testing.

Keep the container setup production-appropriate and reasonably small.

---

# Project Structure

Use a clean, maintainable architecture.

Keep components reasonably separated.

Possible structure:

src/
├── components/
├── hooks/
├── lib/
├── types/
├── utils/
├── App.tsx
└── main.tsx

Do not over-engineer.

---

# GitHub

The project will be hosted publicly on GitHub.

Do not commit:

- Secrets
- API keys
- Tokens
- Passwords
- Local machine paths

Create a useful README.md containing:

- Project overview
- Features
- Screenshots section placeholder if appropriate
- Tech stack
- Local development
- Production build
- Docker usage
- Keyboard shortcuts

---

# Important Constraints

DO NOT:

- Add a backend
- Add authentication
- Add a database
- Add cloud services
- Add unnecessary enterprise features
- Add payment systems
- Add analytics
- Add external API dependencies unless genuinely needed
- Turn this into a huge application

The goal is a polished, focused Markdown Notes product.

---

# Quality Bar

The final result should pass this mental test:

"If I saw this website without knowing how it was made, would I think it was a polished modern developer product?"

The answer should be YES.

It should be:

- Beautiful
- Fast
- Smooth
- Interactive
- Responsive
- Useful
- Technically clean

Do not settle for a basic CRUD interface.

---

# Final Verification

Before finishing:

1. Run the application locally.
2. Verify creating notes.
3. Verify editing notes.
4. Verify deleting notes.
5. Verify search.
6. Verify Markdown rendering.
7. Verify LocalStorage persistence.
8. Verify theme switching.
9. Verify responsive behavior.
10. Verify keyboard interactions.
11. Verify reduced-motion behavior.
12. Verify no obvious console errors.
13. Run the production build.
14. Build the Docker image successfully.
15. Start the Docker container and verify the application loads.

Do not stop at a skeleton.

Implement the complete polished application.

---

# Critical Instruction

Do NOT modify this brain.md file.

Use this document as the product specification.

After implementation, report:

- Files created/modified
- Features implemented
- Libraries/dependencies added, if any
- Production build result
- Docker build result
- Local verification result
- Any remaining limitations
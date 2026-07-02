# AGENTS.md — Health OS Codex Instructions

This repository is for **Health OS**, a global family health, wellness, caregiving, AI, calendar, records, scanner, and Moments app.

Codex must read and follow:

1. `HEALTH_OS_CODEX_MASTER_PLAN.md`
2. `HEALTH_OS_CODEX_UI_GUIDELINES.md`
3. This `AGENTS.md`

If any instruction conflicts, follow this priority:

1. Security, privacy, permissions, and safety rules
2. Existing app architecture and working code
3. Master product/routing/design plan
4. UI guidelines
5. Current task prompt

---

## Core Product Direction

Health OS is not a generic fitness app.

It is a mature, Apple-inspired, global family health operating system with:

- Home
- Calendar
- Scan
- Health
- Family
- Floating AI assistant
- Profile and Settings
- Moments/rewards
- Caregiver and enterprise modes
- Regional health settings
- Connected health devices
- Documents and records
- Articles with trusted sources
- Privacy-first family sharing

The UI must feel:

- Mature
- Calm
- Premium
- Apple-inspired
- Family-friendly
- Health-safe
- Not childish
- Not dashboard-heavy
- Not cluttered

Use **soft rectangular cards**, not full circular dashboard bubbles. Use restrained blur/glass, mature icons, premium emoji accents, clear spacing, and purposeful animation.

---

## Non-Negotiable Privacy Rules

Privacy is the highest priority.

Codex must not create code paths that allow users to access data they do not own or do not have explicit permission to view.

All future backend-ready structures must assume:

- Users own their private data.
- Family members only see what is shared with them.
- Caregivers only see child/elder data explicitly shared with them.
- Schools/enterprise users only see assigned children/classes/organizations.
- AI chats are private by default.
- Documents are private by default.
- Health records are private by default.
- Child data is never shared by default.
- Support/admin access requires user consent and audit logging.
- Subscription locks must not leak private data previews.

Any shared data must pass through:

1. Permission check
2. Privacy review
3. Audit/activity log event
4. User confirmation where sensitive

Never rely only on front-end hiding. Code must be structured so future backend row-level security and API authorization can enforce the same rules.

---

## Security Expectations

When building features, prepare for:

- Role-based access control
- Circle-based permissions
- User ownership checks
- Person/profile relationship checks
- Caregiver assignment checks
- Enterprise organization checks
- Audit logs
- Consent records
- Device/session tracking
- 2FA/passkey-ready account structure
- Biometric lock for sensitive screens
- Secure storage for tokens
- No secrets committed to the repo
- No hardcoded API keys
- No unauthenticated private routes
- No direct object access without ownership/permission context

Sensitive areas include:

- Health records
- Documents
- AI chats
- Child profiles
- Caregiver updates
- Family permissions
- Emergency profile
- Connected device data
- Location data
- Calendar events
- Photos/Moments
- Support sessions
- Billing/subscription status

---

## UX Rules

Every page must have a clear purpose.

Every button must do one of these:

- Start something
- Log something
- Review something
- Save something
- Share something
- Learn something
- Fix something
- Celebrate something
- Protect something

If a button does not clearly fit one of these categories, do not add it.

Do not invent random screens, tabs, or buttons. Follow the master plan.

---

## Main Navigation

The primary mobile tab order is:

1. Home
2. Calendar
3. Scan
4. Health
5. Family

The AI assistant is not a normal tab. It is a floating system layer above navigation.

AI states:

1. Floating capsule
2. Keyboard composer
3. Half-sheet assistant
4. Full-screen AI chat

---

## Required Global App Concepts

Codex should preserve and build toward these concepts:

- Regional Health Profile
- Language and unit preferences
- WHO region and country health source routing
- Articles with source links and date/source labels
- Top 4 Health Realms
- Smart Header on Home
- Calendar event dots and period/ovulation halos
- Family circles and relationship roles
- Caregiver work profile separate from personal profile
- Shared AI chats with permissions
- Moments creative/reward system
- Connected devices foundation
- Health records and documents
- Data source manager
- Consent center
- Activity/audit log
- Notification center
- Help, FAQ, Terms, Privacy Policy
- Subscription/feature gate system
- Long-press context actions
- Responsive layouts for phone, tablet, desktop, and web

---

## Design System Rules

Use a central design system. Do not scatter colors, spacing, or shadows across random files.

Required design tokens:

- Realm colors
- Semantic colors
- Light mode
- Dark mode
- Glass mode: Full / Reduced / Off
- Spacing
- Typography
- Border radius
- Elevation/shadows
- Motion timing
- Haptic intensity
- Breakpoints
- Privacy labels
- Status colors

Use realm color consistently:

- Fitness: orange
- Nutrition: green
- Mental Health: purple/indigo
- Family Health: blue
- Period: pink
- Pregnancy: peach/rose
- Baby: mint/sky
- Kids: yellow/teal
- Caregiver/School: cyan/blue
- Medication: teal, red only for warnings
- Vitals: blue
- Documents/Records: graphite/gray
- AI: violet
- Emergency: red

---

## Chart and Data Visualization Rules

Charts must be calm, readable, and Apple-like.

Use:

- Line charts for trends
- Bar charts for weekly totals
- Ring charts for goals/progress
- Range charts for vitals
- Heatmaps for consistency/mood
- Timelines for pregnancy/baby growth
- Calendar halos for period/ovulation/multi-day states
- Route maps for sports/location tracking
- Zone charts for heart-rate training

Every chart must show:

- Clear title
- Time range
- Unit
- Source of data if relevant
- Empty state
- Error state
- Loading state
- Privacy status if shared
- Long-press point inspection where useful

All stored metrics must use canonical internal units and convert for display.

---

## Long Press Rules

Long press is a power-user layer, not the only access to important actions.

Rules:

- Tap opens or performs the primary action.
- Long press opens contextual actions.
- Drag expands, reorders, or moves where appropriate.
- Swipe performs quick status changes only where safe.
- Use haptic feedback where supported.
- Do not hide essential actions only behind long press.
- Destructive actions require confirmation.
- Sensitive actions require permission and privacy review.
- Desktop/web right-click should use the same menu pattern.

---

## AI Safety Rules

AI can suggest, draft, explain, summarize, and prepare actions.

AI must not silently:

- Save sensitive health data
- Share private data
- Change permissions
- Diagnose users
- Modify medication
- Create child/caregiver sharing
- Send family messages
- Export private records

Sensitive AI outputs must show:

> AI prepared this. Please review before saving.

Health guidance must remain educational and sourced. Use phrases like:

> This is not a diagnosis. Please confirm with a healthcare professional.

---

## Articles and Health Content Rules

Health OS is global. Do not assume one country’s health guidance applies to all users.

Article routing must consider:

- User country
- Language preference
- WHO region
- Local health authority
- Source reliability
- Last reviewed date
- Topic sensitivity

Articles must show:

- Source name
- Source country/region
- Last reviewed/published date if available
- Original source link
- Medical disclaimer
- Related app actions

Do not copy full copyrighted articles. Prefer summaries, key takeaways, source links, and allowed images only.

---

## Responsive Layout Rules

The same routes should work across devices.

Phone:

- Bottom tabs
- Floating AI capsule
- Single-column content
- Bottom sheets

Tablet/iPad:

- Split layout where useful
- Larger charts
- Detail panel
- AI as side/half sheet

Desktop/web:

- Sidebar navigation
- Multi-column layout
- Right-click context menus
- Keyboard-friendly interactions

---

## Subscription and Feature Gate Rules

Build feature gates from the beginning, even if pricing changes later.

A locked feature may show:

- Title
- Short benefit
- Lock icon
- Upgrade action
- Safe preview only

A locked feature must not leak private data.

Feature model should support:

- requiredPlan
- usageLimit
- currentUsage
- resetPeriod
- trial eligibility
- upgrade copy
- permission requirements

---

## Support/Admin Rules

A support/admin control panel can exist, but it must be privacy-first.

Support may access:

- Account status
- Subscription status
- App version/device info
- Sync error logs
- Permission status
- Support tickets

Support must not freely access:

- Private AI chats
- Health records
- Child photos
- Documents
- Family permissions
- Caregiver notes

Support access to sensitive data requires:

1. User-initiated support session
2. Explicit user consent
3. Limited scope
4. Expiry
5. Audit log

---

## Coding Rules

Before editing code:

1. Inspect existing structure.
2. Identify relevant files.
3. Make the smallest safe change.
4. Preserve working routes.
5. Use TypeScript types.
6. Avoid duplicate components.
7. Use mock data until backend contracts are ready.
8. Do not introduce secrets.
9. Do not remove security/privacy placeholders.
10. Do not invent unrelated features.

When adding screens:

- Add empty/loading/error states.
- Add accessibility labels.
- Respect safe areas.
- Support dark/light mode.
- Support reduced motion/reduced glass.
- Keep layout responsive.
- Use central design tokens.
- Use reusable components.

---

## First Build Order

Preferred implementation order:

1. Design system tokens and base components
2. Routing shell
3. Onboarding
4. Home and Smart Header
5. Floating AI capsule
6. Health page
7. Calendar page
8. Family page
9. Profile and Settings
10. Moments system
11. Feature gates
12. Connected devices placeholder
13. Articles/sources UI
14. Privacy/consent/activity log
15. Support/help/legal

Do not jump into backend until the UI architecture, permissions model, and route structure are stable.

---

## Required Response Format for Codex

When responding after a task, Codex should summarize:

- What changed
- Files modified
- Security/privacy considerations
- UX behavior added
- Known limitations
- Suggested next task


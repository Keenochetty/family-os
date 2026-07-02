# HEALTH_OS_CODEX_PROMPTS.md

Use these prompts in Codex. Start with the first prompt and move phase by phase. Do not ask Codex to build the whole app in one task.

---

## Prompt 0 — Read the Plan First

```text
Read `HEALTH_OS_CODEX_MASTER_PLAN.md`, `HEALTH_OS_CODEX_UI_GUIDELINES.md`, and `AGENTS.md`.

Do not code yet.

Summarize:
1. The Health OS product vision
2. The required navigation/routing structure
3. The privacy and permission model
4. The visual design direction
5. The first 5 safest build phases

Then identify the existing repo structure and recommend the first implementation task.
```

---

## Prompt 1 — Design System Foundation

```text
Build the Health OS design-system foundation only.

Follow `AGENTS.md` and the master plan.

Create or update central files for:
- realm colors
- semantic colors
- light/dark themes
- Glass Mode: Full / Reduced / Off
- typography tokens
- spacing tokens
- radius tokens
- elevation/shadow tokens
- motion timing tokens
- haptic helper
- responsive breakpoints
- privacy/status labels

Do not build full app screens yet.
Do not hardcode colors inside components.
Use TypeScript types.
Add mock examples only if needed for preview/testing.

Security/privacy:
- Add no secrets.
- Add no backend calls.
- Prepare design types for privacy labels and locked features.

After changes, summarize modified files and how future screens should use these tokens.
```

---

## Prompt 2 — Base UI Components

```text
Build reusable Health OS base UI components using the design tokens.

Components needed:
- AppScreen
- GlassSurface
- HealthCard
- ActionButton
- IconButton
- RealmBadge
- PrivacyBadge
- PlanLockBadge
- SectionHeader
- EmptyState
- LoadingState
- ErrorState
- ContextActionMenu
- BottomSheetShell
- ResponsiveContainer

Design requirements:
- Mature Apple-inspired look
- Soft rectangular cards, not full circular dashboard bubbles
- Dark/light mode support
- Glass Mode Full/Reduced/Off support
- Android fallback styling when blur/glass is unavailable
- Accessible labels and readable contrast

Do not build final screens yet.
Keep components flexible and typed.
```

---

## Prompt 3 — Routing Shell

```text
Implement the Health OS route shell.

Main tab order:
1. Home
2. Calendar
3. Scan
4. Health
5. Family

Also create placeholder route groups for:
- auth
- onboarding
- ai
- profile/settings
- modals
- notifications
- activity-log
- privacy/consent-center
- emergency
- support
- data import/export

Use placeholder screens where needed, but preserve the route names from the master plan.

Design:
- Bottom tabs on mobile
- Prepare responsive structure for tablet/desktop later
- Floating AI capsule placeholder above bottom nav
- Safe area support

Security:
- Add placeholder route guards or TODO hooks for auth/permission checks.
- Do not expose sensitive placeholder data globally.
```

---

## Prompt 4 — Onboarding Flow UI

```text
Build the onboarding UI flow with mock/local state only.

Screens:
1. Welcome
2. Sign in / create account
3. Phone verification
4. Confirm detected details
5. Account type selector: Personal / Caregiver / Enterprise
6. Region, language, and units
7. Purpose selection with moving selectable pills
8. Top 4 realm preview
9. Permission preview
10. Family circle setup
11. Avatar setup
12. Plan selection
13. Complete / go to Home

Requirements:
- Feel like setting up an Apple/Android device: calm, guided, intelligent.
- Do not request real OS permissions immediately except through placeholders.
- Explain why phone number is required.
- Let users confirm or edit detected details.
- Default language from device, but allow change.
- Include note that some public creator videos may be in English, with captions/audio depending on creator availability.
- Produce Top 4 realms from selected purposes.
- Prepare data structures for RegionalHealthProfile and UserLocalizationPreferences.

Security:
- No real auth secrets.
- No fake bypass assumptions.
- Add TODO notes for server-side validation, phone verification, and consent records.
```

---

## Prompt 5 — Home and Smart Header

```text
Build the Home screen with the Health OS Smart Header.

Home purpose:
Show what matters today without becoming a dashboard dump.

Sections:
- Smart retractable header
- Scheduled action carousel
- Floating AI capsule already present from shell
- Latest Moment card
- Today’s family updates
- Light suggestions
- Weekly glance
- Quick actions

Smart Header behavior:
- Expanded: greeting, short context line, next due action, swipeable quick action cards.
- Collapsed: compact greeting and count of due actions.
- Action cards should support Start, Log, Review, Skip, Reschedule depending on type.
- Long press on action card opens ContextActionMenu.

Use mock data.

Design:
- Mature soft rectangles
- Premium emoji/icon accents
- Calm depth, not neon dashboard
- Haptic hooks for card actions

Security:
- Show privacy badges on sensitive cards.
- Do not show private family/health data without mock permission flags.
```

---

## Prompt 6 — Floating AI Capsule and Assistant States

```text
Implement the AI assistant interaction layer.

States:
1. Floating capsule
2. Keyboard composer
3. Half-sheet assistant
4. Full-screen AI chat

Behavior:
- Tap capsule to open keyboard composer.
- Drag upward to half-sheet.
- Expand button opens full AI chat page.
- Drag down collapses.
- Hide capsule on scroll down and show on scroll up.
- Add haptic feedback on state changes.
- Use mock chat history and mock commands.

Full AI page:
- Chat list/history
- New chat
- Search chats
- Message composer
- Attachment button
- Voice button placeholder
- Save-to-app action buttons on mock AI response
- Share chat permissions placeholder

Security:
- AI chats private by default.
- Sensitive save/share actions require review UI.
- Do not save or share anything automatically.
```

---

## Prompt 7 — Health Page

```text
Build the Health tab.

Layout:
- Top 4 active realm widgets
- This week’s catch-up card
- Documents card
- Records/history card
- More tools grouped by category
- Explore realms
- Realm article cards

Top 4 realm widgets:
- icon
- realm color
- today status
- quick action
- mini chart/ring where appropriate
- long press actions: Open, Quick log, View records, View charts, Ask AI, Reorder, Replace, Change color, Make private, Share summary, Remove

More tools categories:
- Health Body
- Food & Nutrition
- Mind & Lifestyle
- Women’s Health
- Baby & Kids
- Family & Care
- Records

Security:
- Documents and records private by default.
- Shared summaries must show privacy review placeholder.
- Locked features must use PlanLockBadge.
```

---

## Prompt 8 — Chart Components

```text
Build reusable chart components for Health OS using central tokens.

Components:
- TrendLineChart
- WeeklyBarChart
- GoalRing
- RangeChart
- CalendarHeatmap
- TimelineChart
- HeartRateZoneChart
- MetricSummaryCard
- ChartEmptyState

Requirements:
- Apple-like, calm, readable
- Realm color support
- Unit label
- Time range label
- Data source label
- Empty/loading/error states
- Long press point inspection where useful
- Accessibility labels
- Dark/light mode
- No cluttered gridlines

Map chart usage:
- Weight: TrendLineChart
- Water: WeeklyBarChart + GoalRing
- Steps: WeeklyBarChart + GoalRing
- Heart rate: RangeChart + ZoneChart
- Sleep: Bar/Range chart
- Mood: CalendarHeatmap
- Period: Calendar halos, not normal chart first
- Pregnancy: TimelineChart
- Baby growth: TrendLineChart + TimelineChart
- Sports: Route placeholder + ZoneChart + BarChart
- Records: Timeline/list

Use mock data only.
```

---

## Prompt 9 — Calendar Page

```text
Build the Calendar tab UI.

Sections:
- Month view
- Week/day toggle placeholder
- Person/circle filter
- Event dots
- Period and ovulation halos
- Today timeline
- Add event button
- Shared to-do preview
- Invitations/attendance card
- Parent approval card

Long press:
- Date: Add event, Add to-do, Add medication reminder, Add workout, Add sport day, Add period note, Add baby log, View day, Mark travel day
- Event: Edit, Duplicate, Reschedule, Invite people, Change visibility, Attach photo, Mark complete, Create Moment, Delete
- To-do: Mark done, Assign, Change due date, Add photo, Could not complete, Repeat, Delete

Security:
- Child-created events require parent approval.
- Shared events show visibility and permission labels.
- Sensitive health events should default private.
```

---

## Prompt 10 — Scan Page

```text
Build the Scan tab UI with placeholder camera behavior.

Sections:
- Camera placeholder
- Auto-detect state cards
- Barcode detected state
- Ingredients/food label state
- Document state
- Medication package state
- Review before saving screen
- Scan history preview

Actions:
- Scan
- Use photo
- Upload document
- Review result
- Save to records
- Ask AI
- Share
- Add to grocery list
- Attach to person
- Report incorrect result

Security/safety:
- Every AI/OCR output requires review before saving.
- Allergy/medication/health warnings use cautious language.
- No medical diagnosis.
- Source links required for health/medicine information later.
```

---

## Prompt 11 — Family Page

```text
Build the Family tab UI.

Sections:
- Circle switcher
- Household
- Extended family
- Friends
- Children
- Caregivers
- Schools
- Shared chats
- Shared tasks
- Invites
- Permissions preview
- Family Moments

Data model mock:
- people can belong to multiple circles
- person has different roles per circle
- caregivers have separate work profile
- permissions are explicit per person/circle/category

Actions:
- Invite by QR/link
- Add circle
- Set role
- Manage permissions
- Share chat
- Share record
- Revoke access
- Create Moment

Security:
- Child data private by default.
- Caregiver sees only explicitly shared child/elder info.
- Shared chats private unless shared.
- Permission review screen placeholder required before sharing.
```

---

## Prompt 12 — Profile and Settings

```text
Build Profile and Settings pages.

Profile:
- animated avatar/profile image placeholder
- name, role, region, language/units summary
- plan badge
- health summary
- latest Moment
- family circles preview
- connected devices preview
- privacy status
- settings entry

Settings groups:
- Account
- Profile
- Plan & billing
- Privacy & sharing
- Security / 2FA
- Region, language & units
- Appearance
- Notifications
- Health data & metrics
- Connected devices
- Family & circles
- Caregiver / school mode
- AI settings
- Moments settings
- Articles & sources
- Data export
- Help & support
- FAQ
- Terms
- Privacy Policy
- Medical Disclaimer

Appearance:
- System / Light / Dark
- Glass Mode: Full / Reduced / Off
- Reduce motion
- Haptics on/off
- Larger text/high contrast placeholder

Security:
- Sensitive settings screens should include re-auth placeholder.
- Delete account and export data entries must exist.
```

---

## Prompt 13 — Moments System

```text
Build the Moments UI system.

Sections:
- Latest Moment on Home
- Moments gallery in Profile
- Create Moment entry point
- Moment templates
- Celebration overlay
- Privacy review before sharing/export

Moment types:
- Family circle created
- Workout completed
- Nutrition win
- Weight progress
- Pregnancy milestone
- Baby milestone
- Caregiver update
- Document saved
- Sport completed
- Shared family task completed

Design:
- Mature emotional premium
- Apple-like photo card/collage style
- Soft rectangular cards
- Subtle haptics/motion
- No childish arcade badges

Actions:
- Create Moment
- Use photos
- Use progress
- Use event
- Use AI summary
- Save private
- Share
- Export

Security:
- Child photos private by default.
- Sharing Moments requires privacy review.
- Sensitive data should be removable before export.
```

---

## Prompt 14 — Articles and Sources UI

```text
Build the realm article/blog UI.

Article card:
- title
- topic
- source badge
- region/language badge
- thumbnail/hero image placeholder
- short summary

Article opens in half pull-up sheet:
- article header
- source badge
- hero image
- summary
- key takeaways
- related app actions
- medical disclaimer
- original source link at bottom
- drag up to full read view

Settings:
- Articles & Sources page
- preferred country
- preferred language
- trusted sources
- hidden sources
- report outdated article

Security/safety:
- Do not copy full articles.
- All content must show source link and source label.
- Global source routing must respect user region/language.
```

---

## Prompt 15 — Connected Devices Foundation

```text
Build Connected Devices foundation UI and models.

Sections:
- Apple Health placeholder on iOS
- Health Connect placeholder on Android
- Bluetooth devices placeholder
- Device library model
- Metric permissions model
- Connected device cards
- Sync status
- Last sync time
- Data source priority
- Troubleshooting
- Disconnect flow

Device types:
- watch
- fitness band
- smart ring
- scale
- blood pressure monitor
- glucose meter
- thermometer
- pulse oximeter
- bike sensor
- heart rate strap
- sleep tracker
- smart water bottle

Security:
- Metric permissions are explicit.
- User controls each data type.
- No data sync without consent.
- Prepare audit event hooks for future backend.
```

---

## Prompt 16 — Sports Tracking UI

```text
Build Sports Tracking UI as part of Health/Fitness and Calendar.

Features:
- plan sport day from Calendar
- choose sport type
- invite people
- track/import activity placeholder
- label unknown workout from watch
- add to weekly goal
- sport detail screen
- sport metrics charts
- sport Moment after completion

Sports:
- Soccer
- Padel
- Running
- Cycling
- Walking
- Gym
- Swimming
- Hiking
- Basketball
- Tennis
- Cricket
- Rugby
- Netball
- Yoga
- Pilates
- Custom

Metrics:
- duration
- distance
- steps
- pace
- speed
- heart rate
- heart-rate zones
- energy
- elevation
- route placeholder
- temperature/climate placeholder
- perceived effort
- injury notes
- hydration

Safety:
- Do not make medical claims.
- Fitness insights are trend-based and educational.
```

---

## Prompt 17 — Privacy, Consent, and Activity Log

```text
Build privacy infrastructure UI.

Pages:
- Privacy dashboard
- Consent center
- Activity/audit log
- Shared data review
- Support session consent screen

Consent center:
- AI can use my data
- Family can view my records
- Caregiver can update child info
- School can message me
- Device data sync
- Location usage
- Calendar usage
- Contact usage
- Marketing opt-in

Activity log:
- who viewed what
- who changed what
- who shared what
- permission changes
- login activity
- device syncs
- support access

Security:
- No real backend yet, use mock data.
- Make all future hooks explicit.
- Every sensitive share requires privacy review UI.
```

---

## Prompt 18 — Feature Gates and Subscription UI

```text
Build feature gate and subscription UI.

Plans:
- Free
- Plus
- Family
- Care / School

Feature model:
- featureKey
- requiredPlan
- usageLimit
- currentUsage
- resetPeriod
- trialAvailable
- upgradeMessage

UI:
- small lock icon
- soft disabled card
- safe preview only
- upgrade sheet
- compare plans
- restore purchases placeholder
- manage subscription placeholder

Rules:
- Locked features must not leak private data.
- No aggressive dark patterns.
- User can still understand what feature does.
```

---

## Prompt 19 — Notifications and Suggestions

```text
Build internal Notification Center and light suggestion system.

Notification categories:
- Health
- Family
- Calendar
- Caregiver
- AI
- System
- Emergency

Suggestion actions:
- Do it
- Remind me later
- Not useful
- Hide this type
- Why this?

Rules:
- Suggestions should be light and explainable.
- Every suggestion should have a reason.
- No nagging or shaming.
- Sensitive suggestions should remain private.
```

---

## Prompt 20 — Reports, Import/Export, and Offline Placeholders

```text
Build pages/placeholders for:
- Reports
- Data export
- Data import
- Offline settings
- Emergency profile

Reports:
- Doctor report
- Child care report
- Pregnancy report
- Fitness progress report
- Medication report
- Mood trend report
- Custom date range

Export:
- Health records
- Documents
- AI chats
- Calendar
- Moments

Offline:
- emergency profile
- today’s tasks
- caregiver child info
- important documents
- medication schedule

Security:
- Exports require privacy confirmation.
- Emergency profile must be carefully scoped.
- Offline data must be treated as sensitive.
```

---

## Prompt 21 — Final UX Consistency Pass

```text
Review the entire app UI for consistency with `AGENTS.md` and the master plan.

Check:
- Main tab order
- Floating AI behavior
- Home Smart Header
- Health Top 4 realms
- Calendar dots/halos
- Family permissions
- Profile/settings completeness
- Long press context actions
- Feature locks
- Privacy labels
- Empty/loading/error states
- Accessibility labels
- Light/dark mode
- Glass mode off/reduced/full
- Responsive behavior
- No unauthorized data assumptions
- No hardcoded colors outside tokens
- No secrets or fake backend bypasses

Fix inconsistencies with the smallest safe changes.
Summarize all changes and remaining TODOs.
```

---

## Prompt Template for Any New Feature

```text
Implement [FEATURE NAME] following `AGENTS.md`, `HEALTH_OS_CODEX_MASTER_PLAN.md`, and `HEALTH_OS_CODEX_UI_GUIDELINES.md`.

Before coding:
1. Inspect the existing route/component/design-token structure.
2. Identify reusable components.
3. Confirm which route/page owns the feature.
4. Confirm privacy, permission, and plan-gate rules.

Build:
- UI layout
- button actions
- empty/loading/error states
- long-press actions if relevant
- privacy labels if relevant
- feature locks if relevant
- mock data only unless backend contract exists
- TypeScript types
- accessibility labels
- dark/light mode
- reduced glass/reduced motion support

Do not:
- add secrets
- invent unrelated routes
- bypass permission checks
- expose private mock data globally
- copy-paste hardcoded colors
- hide essential actions only behind long press

After coding:
- summarize files changed
- summarize UX behavior
- summarize privacy/security implications
- list TODOs for backend integration
```


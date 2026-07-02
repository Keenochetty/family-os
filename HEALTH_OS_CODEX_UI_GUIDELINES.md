# Health OS Codex UI / UX Build Guide

Use this file as the source-of-truth brief for Codex when designing or refactoring the Health OS mobile app.

Primary repo target: `Keenochetty/Healthy-living-tracker`

Product direction: Health OS is a family health ecosystem that combines personal health, family circles, AI assistance, calendar planning, scanning, records, caregiver workflows, and emotional Moments into one calm mobile experience.

Do not build a bulky dashboard. Build a calm, modular app that grows with the user.

---

## 1. Product North Star

Health OS should feel like:

> A calm family health OS on the surface. A powerful AI operating system underneath. A memory book when life moments happen.

Core principles:

1. Show what matters today.
2. Suggest what may help next.
3. Hide what is not needed yet.
4. Keep everything searchable.
5. Private by default, shared only by choice.
6. Celebrate care, not perfection.
7. Never make medical claims as final truth.
8. Always guide users to consult qualified healthcare professionals for medical decisions.

---

## 2. Main Navigation

Bottom tab order must be:

1. Home
2. Calendar
3. Scan
4. Health
5. Family

A floating AI capsule/search bar sits above the nav bar. It hides on scroll down and returns on scroll up.

### Main app explanation

- Home = what matters now
- Calendar = what is planned
- Scan = understand the real world
- Health = track and improve life
- Family = share with the right people
- AI = command layer across everything
- Moments = emotional memory/reward layer

---

## 3. Design Direction

Design should be inspired by Apple-style iOS clarity:

- content first
- soft hierarchy
- large readable text
- thumb-friendly controls
- rounded cards
- calm spacing
- layered sheets
- blurred/glass floating surfaces
- subtle haptics
- subtle motion
- never visually overcrowded

Use glass/blur only for floating UI, overlays, navigation, assistant layers, celebration cards, and blog half-sheets. Do not make every card glass.

### Layer model

Use this model across the app:

- Layer 0: Background / realm color wash
- Layer 1: Main content
- Layer 2: Cards and widgets
- Layer 3: Floating AI/search capsule
- Layer 4: Nav bar
- Layer 5: Bottom sheets / half sheets
- Layer 6: Full-page modals
- Layer 7: Moment celebration overlay

### Page layering behavior

When opening a detail, blog, AI panel, or Moment creator:

- keep the previous page visually present underneath
- apply soft blur and scale/opacity reduction to the underlying page
- use a rounded top sheet when partial
- allow drag to expand and drag to dismiss where appropriate
- use haptic feedback at snap points
- never trap the user without a clear close/collapse gesture

---

## 4. Cross-platform Requirement

Android users must get the same product experience, even if platform-specific effects differ.

Use native Liquid Glass where available on iOS. On Android, use blur/elevation/gradient fallback.

Recommended tool approach:

- `expo-haptics` for iOS and Android haptic feedback
- `expo-blur` for blur surfaces and Android fallback where supported
- `expo-glass-effect` only where supported on newer iOS versions
- `react-native-reanimated` for transitions
- `react-native-gesture-handler` for drag interactions
- `@gorhom/bottom-sheet` or equivalent for sheet behavior
- `react-native-svg` for calendar halos, rings, dots, and charts where needed

Do not hardcode iOS-only behavior without Android fallback.

---

## 5. Global Color System

Use a neutral base with realm accent colors.

### Base colors

- Background light: `#F7F7F5`
- Surface light: `#FFFFFF`
- Surface soft: `#F1F2F4`
- Text primary: `#111827`
- Text secondary: `#667085`
- Border soft: `rgba(17,24,39,0.08)`
- Background dark: `#0B0D12`
- Surface dark: `#151821`
- Surface dark soft: `#202432`
- Text dark primary: `#F8FAFC`
- Text dark secondary: `#A8B0C2`

### Realm colors

- Fitness: Orange `#FF8A3D`
- Nutrition: Green `#34C759`
- Mental Health: Purple `#8E7CFF`
- Family Health: Blue `#3B82F6`
- Period: Pink `#FF5FA2`
- Ovulation: Lavender `#A78BFA`
- Pregnancy: Peach/Rose `#FFB199`
- Baby: Mint/Sky `#7DD3FC`
- Kids: Playful Teal/Yellow `#2DD4BF` / `#FACC15`
- Caregiver/School: Cyan `#22D3EE`
- Medication: Teal `#14B8A6`
- Vitals: Blue `#0EA5E9`
- Doctor/Medical Warning: Red accent `#EF4444`
- Documents/Records: Graphite `#64748B`
- AI Assistant: Violet `#7C3AED`
- Emergency: Red `#DC2626`

Rules:

- Use realm colors for icons, progress indicators, graph highlights, small badges, and primary actions inside the realm.
- Avoid large saturated backgrounds.
- Use soft tints and gradients.
- Red is reserved for emergency, warning, abnormal readings, or medical caution.
- Do not rely only on color. Use icons, labels, shapes, and avatars too.

---

## 6. Typography and Spacing

Use Apple-like hierarchy:

- Screen title: large, bold, left aligned
- Section title: medium, semibold
- Body: readable, generous line height
- Captions: secondary, not too small
- Buttons: clear action language

Suggested type scale:

- Display: 34 / 40
- Large title: 28 / 34
- Title: 22 / 28
- Section: 18 / 24
- Body: 16 / 22
- Caption: 13 / 18
- Tiny label: 11 / 14

Spacing tokens:

- 4, 8, 12, 16, 20, 24, 32, 40

Radius tokens:

- Small: 10
- Medium: 16
- Large: 24
- Pill: 999

---

## 7. Home

Home should stay calm and contextual.

Home sections:

1. Greeting + profile/circle switcher
2. Smart retractable action header
3. Latest Moment / Create Moment card
4. Today actions
5. Family updates
6. Health nudges
7. Recent records
8. AI suggestions

Do not show all features on Home.

### Smart header behavior

Collapsed:

- Greeting
- avatar/profile
- notifications
- small glass pill with due actions

Expanded:

- horizontal swipe cards
- quick logging actions
- medication
- water
- gym session
- baby feed
- mood check-in
- period log
- pregnancy note
- caregiver update

---

## 8. Floating AI Assistant

The AI assistant must feel simple and powerful, similar to a familiar chat interface, but built for Health OS actions.

### AI states

1. Floating capsule
2. Keyboard composer
3. Half-sheet assistant
4. Full-page AI chat

### Floating capsule

Text examples:

- `Ask, scan, search, or create...`
- `Ask Health OS...`
- `Search records, scan, or create...`

Behavior:

- floats above bottom nav
- hides on scroll down
- returns on scroll up
- tap opens keyboard composer
- drag up opens half sheet
- expand button opens full AI page

### Full AI page

Must include:

- chat history
- new chat
- search chats
- saved commands
- attachments/photo/file
- voice button
- context chips: Me, Wife, Child, Family, Records
- share chat controls
- save-to-app action buttons

### AI command style

AI must turn text into reviewable actions.

Example:

User: `Add soccer practice for Liam on Saturday at 9.`

App shows:

- Event: Soccer practice
- Person: Liam
- Date/time
- Shared with
- Parent approval if needed
- Edit / Save

Sensitive actions must always require review before saving or sharing.

---

## 9. Shared AI Chats

AI chats can be shared with family, friends, caregivers, or circles.

Default: private.

Share options:

- Share full chat
- Share summary only
- Share final plan only
- Share selected messages

Permissions:

- Can view
- Can comment
- Can ask follow-up questions
- Can edit plan
- Can save actions
- Can assign tasks
- Can attach photos
- Can share further

A chat can link to:

- user
- child
- partner
- family circle
- caregiver profile
- calendar event
- scan result
- document
- health record
- Moment

Never auto-share AI chats.

---

## 10. Health Section

Health tab layout:

1. Top 4 active realm widgets
2. This week’s catch-up
3. Documents
4. Records / History
5. More tools
6. Explore realms

### Top 4 active realm widgets

Selected during onboarding based on user needs.

Examples:

- Fitness
- Nutrition
- Mental Health
- Baby Tracker
- Pregnancy
- Period
- Vitals
- Medication
- Family Health

Each widget:

- icon
- realm color
- today status
- quick action
- mini progress or trend
- long press menu placeholder

Long press menu later:

- pin/unpin
- hide
- reorder
- change color
- sharing settings
- records

### This week’s catch-up

Collapsed example:

`This week: 5 workouts • 2 symptoms • 1 document • 4 mood logs`

Expanded:

- trends
- missed reminders
- new records
- abnormal readings
- positive progress
- ask AI to summarize
- export/share report

### More tools grouping

Do not show a huge tool grid. Group by intent:

Health Body:

- Fitness
- Vitals
- Medication
- Symptoms
- Mobility / physio
- Sleep
- Hydration

Food & Nutrition:

- Meal plans
- Grocery lists
- Food scanner
- Allergies
- Caffeine
- Child lunches

Mind & Lifestyle:

- Mood
- Stress
- Breathing
- Journaling
- Habits
- Articles

Women’s Health:

- Period
- Ovulation
- Pregnancy
- Contraception notes
- Symptoms

Baby & Kids:

- Feeding
- Sleep
- Nappies
- Growth
- Milestones
- School notes
- Child exercises

Family & Care:

- Caregiver
- Elder care
- Emergency
- Shared tasks
- Family updates
- Permissions

Records:

- Documents
- Doctor notes
- Test results
- Vaccinations
- History
- Exports

---

## 11. Documents and Records

Documents and Records live inside Health but can also be opened from AI, Search, Calendar, Family, and Scan.

Documents:

- Doctor notes
- Prescriptions
- Blood tests
- Injury reports
- Pregnancy scans
- Child clinic cards
- Vaccination records
- School medical forms
- Insurance/medical aid files

Records/history filters:

- Person
- Realm
- Date
- Status
- Normal/high/low
- Shared/private
- Doctor reviewed
- AI scanned
- Attachment included

---

## 12. Charts and Graphs

Charts must be beautiful but simple.

Guidance:

- Charts should communicate clarity first.
- Highlight only the key information.
- Avoid cluttered axes.
- Use labels that explain meaning.
- Use realm color as the main chart accent.
- Use neutral gridlines.
- Use status badges for normal/high/low.
- Use tooltips/sheets for details.
- Use haptics when selecting important points.

Chart types:

- Line chart: weight, heart rate, blood pressure, glucose, mood trend, sleep
- Bar chart: workouts, hydration, meals, medication adherence
- Ring/progress: daily completion, weekly goals, Life Rings
- Timeline: pregnancy, baby milestones, symptoms, doctor notes
- Heat map: muscle map, mood patterns, symptom frequency
- Calendar halos: period, ovulation, illness, recovery, pregnancy weeks

Chart safety:

- Do not diagnose.
- Explain trends as informational.
- Abnormal readings should say: `This may need attention. Please confirm with a healthcare professional.`
- Never use celebratory effects for dangerous readings.

---

## 13. Calendar

Calendar sections:

- month/week/day switch
- person filter
- family circle filter
- add event button
- shared to-dos
- invitations
- attendance
- parent approvals
- health timeline

Event fields:

- title
- person/people involved
- circle
- date
- time
- location
- repeat
- photos
- notes
- category
- invitees
- permissions
- approval needed

Attendance responses:

- Going
- Maybe
- Can’t make it
- Need help
- Running late
- Seen
- Custom response

Children can suggest events, but sharing requires parent approval.

### Calendar visual language

- Dots on month days to avoid clutter
- Max 3 dots, then `+` indicator
- Event color = category
- Avatar/profile image = who created or updated
- Icon = event type
- Halo = multi-day health rhythm/event

Halos:

- Period: pink halo
- Predicted period: lighter/dashed pink halo
- Ovulation: lavender halo
- Peak ovulation: stronger lavender ring
- Pregnancy: peach timeline band
- Illness/recovery: blue/amber band

---

## 14. Scan

Scanner must auto-detect mode where possible.

Modes:

- Barcode
- Product label
- Ingredients
- Nutrition table
- Medication package
- Document
- Doctor note
- Prescription
- Food plate
- Vitals device/screen
- Baby product
- School form

Flow:

1. Open Scan tab
2. Camera detects object/type
3. Show live suggestion
4. Scan
5. AI extracts info
6. Review before saving
7. Save/share/ask AI/add reminder

Medical/allergy wording:

- `Possible concern found. Please confirm with a healthcare professional or pharmacist.`
- Never say `This is definitely unsafe` unless verified by a trusted backend rule set and still include professional guidance.

---

## 15. Family and Circles

Family/friends act like contacts but with roles, circles, and permissions.

A person can be:

- partner
- child
- parent
- grandparent
- sibling
- aunt/uncle
- cousin
- in-law
- friend
- caregiver
- teacher
- school admin
- doctor/support
- custom

A person can have multiple roles in different circles.

Example:

- son in one circle
- husband in household circle
- brother-in-law in another circle
- friend in fitness circle
- father to child

Family tab sections:

- circle switcher
- household
- extended family
- friends
- caregivers
- schools
- shared chats
- shared events
- shared tasks
- shared records
- invites
- permissions
- family photos

---

## 16. Caregiver / School

Caregiver has a separate login/work account but appears inside Family/Circle when connected.

Caregiver profile:

- photo
- optional intro video
- about
- address
- transport
- email
- phone
- alternative phone
- role
- organization/school
- availability
- qualifications/notes

Parent controls what caregiver can see:

- allergies
- medication
- feeding schedule
- nap schedule
- pickup info
- emergency contacts
- medical notes
- daily photos
- daily notes
- incident reports
- group messages
- child updates

Caregiver should never automatically see everything.

---

## 17. Invites

Invite by:

- QR code
- share link
- phone contact
- email
- SMS/WhatsApp share sheet
- in-person scan
- caregiver code
- school code

Invite flow:

1. Choose circle
2. Choose relationship
3. Choose role
4. Choose permissions
5. Choose expiry
6. Send QR/link

Security:

- QR codes expire
- links expire
- parent approval for child connections
- caregiver access can be revoked instantly
- activity log for sharing
- private health data off by default
- child data never shared by default

---

## 18. Moments System

Moments are the emotional/reward/memory layer.

Moments = celebrations + progress cards + family memories + AI-created collages + social-ready posts.

Locations:

- Home latest Moment card
- Profile Moments gallery
- Family
- Pregnancy timeline
- Baby timeline
- Fitness progress
- Nutrition progress
- Caregiver updates

Moment types:

- family circle created
- partner joined
- baby milestone
- pregnancy week
- workout completed
- nutrition win
- weight trend progress
- document saved
- caregiver update
- family event confirmed
- grocery list completed
- health catch-up reviewed

### Moment creator flow

1. Choose source
2. Choose style/template
3. Customize text/photos/date/stat
4. Privacy review
5. Save/share

Sources:

- photos
- health progress
- fitness result
- pregnancy week
- baby milestone
- family event
- caregiver update
- calendar event
- AI chat summary

Templates:

- Apple-like home screen card
- story post
- square social post
- family collage
- progress card
- pregnancy milestone card
- baby memory card
- minimal text poster

Export formats:

- Instagram story 1080x1920
- Instagram square 1080x1080
- profile card 1200x1200
- app-native home card
- wallpaper style
- printable memory card

Privacy review required before sharing.

If Moment includes a child photo, baby age, exact date, health note, location, school, or medical info, default to private and warn before sharing.

---

## 19. Rewards and Celebrations

Use celebration levels:

- Level 0: no celebration, just saved
- Level 1: small haptic + toast
- Level 2: reward card
- Level 3: half-sheet celebration
- Level 4: full-screen milestone

Examples:

- log water = level 1
- complete workout = level 2
- create family circle = level 3
- baby first memory = level 4
- pregnancy trimester = level 4
- medication taken = level 1
- allergy warning = no celebration, safety card

Tone:

- Celebrate care, not perfection.
- Celebrate progress, not pressure.
- Celebrate family, not comparison.
- Never shame missed logs.
- Reward responsible updates, even when a task could not be completed.

---

## 20. Articles / Blog System

Articles live inside each realm, not as one generic blog tab.

Examples:

Fitness articles:

- physical activity
- stretching
- recovery
- pregnancy-safe movement
- beginner fitness

Nutrition articles:

- healthy diet
- food safety
- allergies
- child nutrition
- caffeine

Mental health articles:

- stress
- breathing
- mental health at work
- adolescent mental health
- older adult mental health

Period/Pregnancy articles:

- menstrual health
- family planning
- contraception
- pregnancy
- postpartum

Baby/Kids articles:

- newborns
- infant feeding
- childhood development
- immunization

Care/Elder articles:

- older adults
- disability
- rehabilitation
- palliative care
- caregiver support

### Article source rules

Preferred sources:

1. World Health Organization health topics
2. WHO fact sheets
3. WHO guidelines
4. WHO publications
5. National health services / government health sites where needed
6. Peer-reviewed public health sources where needed

Every article card must include:

- title
- topic/realm
- source name
- source URL
- publication/update date when available
- reading time
- image URL only if licensed/allowed
- summary
- safety disclaimer when medical

Every article detail must include a visible source link at the bottom:

`Source: World Health Organization` + link

Do not copy full WHO articles into the app unless license/permission allows it. Prefer short summaries, key takeaways, and link to original source.

Important licensing rule:

WHO materials are not automatically unrestricted. WHO has copyright/licensing rules. Some materials may be available under Creative Commons-type licences for non-commercial reuse with attribution; other materials, including photos/figures/tables/maps, may require permission. Always store `license`, `credit`, and `source_url` for any image/content. If unsure, use your own app-generated illustration, licensed stock, or omit the image.

### Blog half-sheet UI

When a user taps an article, open it in a half pull-up view.

Initial state:

- 55-65% screen height
- background page stays visible underneath with blur/scale
- rounded top corners
- drag handle
- haptic snap

Expanded state:

- full page reading mode
- large header
- image
- article context
- key takeaways
- related actions
- source link at bottom

Blog detail layout:

1. Drag handle
2. Realm badge
3. Article title
4. Source + date + reading time
5. Hero image or generated illustration
6. Short summary
7. Key takeaways
8. Related app actions
9. Medical disclaimer
10. Source link
11. Related articles

Example related actions:

- Save to Health
- Add reminder
- Ask AI about this
- Share with family
- Open related record
- Create checklist

Do not present articles as diagnosis or personalized medical advice.

---

## 21. Reliable Health Content Model

Suggested article object:

```ts
export type HealthArticle = {
  id: string;
  realm: RealmKey;
  title: string;
  summary: string;
  keyTakeaways: string[];
  sourceName: string;
  sourceUrl: string;
  sourceType: 'WHO_HEALTH_TOPIC' | 'WHO_FACT_SHEET' | 'WHO_GUIDELINE' | 'WHO_PUBLICATION' | 'GOV_HEALTH' | 'PEER_REVIEWED' | 'OTHER_APPROVED';
  publishedAt?: string;
  updatedAt?: string;
  retrievedAt: string;
  readingTimeMinutes: number;
  imageUrl?: string;
  imageCredit?: string;
  imageLicense?: string;
  medicalDisclaimerRequired: boolean;
  tags: string[];
};
```

Suggested rule:

- App stores summaries and metadata.
- App links to original source.
- App does not imply WHO endorsement.
- App does not use WHO logo/emblem in UI unless properly licensed.

---

## 22. Suggested Tools / Libraries

Already likely useful in this repo:

- Expo Router
- Supabase
- TypeScript
- NativeWind/Uniwind/Tailwind setup
- HeroUI Native if already installed

Add or verify as needed:

- `expo-haptics`
- `expo-blur`
- `expo-glass-effect` where supported
- `react-native-reanimated`
- `react-native-gesture-handler`
- `@gorhom/bottom-sheet`
- `react-native-svg`
- `expo-camera`
- `expo-image-picker`
- `expo-document-picker`
- `expo-media-library`
- `react-native-view-shot`
- `expo-sharing`

Do not install new packages without checking existing package.json first.

---

## 23. Codex Build Phases

### Phase 1: Design foundation

Create or update:

- theme tokens
- realm colors
- typography
- spacing
- radius
- shadows/elevation
- glass surfaces
- haptic helper
- motion constants
- dark mode
- Android fallbacks

### Phase 2: App shell

Build tabs:

- Home
- Calendar
- Scan
- Health
- Family

Add floating AI capsule above nav.

### Phase 3: AI capsule transform

Implement:

- collapsed capsule
- keyboard composer
- half-sheet assistant
- full-screen chat
- drag states
- haptics
- placeholder chat history
- share chat UI placeholder

### Phase 4: Health tab

Build:

- Top 4 realms
- weekly catch-up
- documents
- records/history
- more tools grouped
- articles inside realm cards

### Phase 5: Calendar

Build:

- month view
- event dots
- period/ovulation halos
- avatar/icon markers
- add event
- to-do preview
- attendance/invites
- parent approval card

### Phase 6: Family

Build:

- circle switcher
- people/contact cards
- relationship roles
- caregiver section
- shared chats
- QR/link invite entry
- permissions preview

### Phase 7: Moments

Build:

- Latest Moment on Home
- Moments gallery placeholder
- celebration overlay
- template cards
- create Moment entry

### Phase 8: Blog half-sheet

Build:

- article cards inside realms
- article half-sheet
- full-screen expanded reading
- source link at bottom
- reliable source metadata
- disclaimer
- related actions

### Phase 9: Scanner placeholder

Build:

- auto-detect placeholder
- barcode state
- product state
- document state
- review before saving
- caution card

---

## 24. Acceptance Criteria

Codex should consider work acceptable only if:

- app remains cross-platform
- no iOS-only feature without fallback
- bottom tabs are in requested order
- AI capsule is present above nav
- Health uses Top 4 modular realms
- More tools are grouped, not dumped
- Articles are inside realms
- Blog opens in half-sheet and expands
- Blog has source link at bottom
- Health/medical content uses disclaimers
- charts are clear and not cluttered
- calendar uses dots and halos
- Moments can appear after important actions
- sharing defaults to private
- child/caregiver data is permission-based
- color system follows realm tokens
- all new code is typed and organized

---

## 25. Source References for Codex Context

Apple design:

- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Apple Materials guidance: https://developer.apple.com/design/human-interface-guidelines/materials
- Apple Charts guidance: https://developer.apple.com/design/human-interface-guidelines/charts
- Apple Charting Data guidance: https://developer.apple.com/design/human-interface-guidelines/charting-data
- Apple Designing for iOS: https://developer.apple.com/design/human-interface-guidelines/designing-for-ios

WHO content:

- WHO main site: https://www.who.int/
- WHO health topics: https://www.who.int/health-topics/
- WHO fact sheets: https://www.who.int/news-room/fact-sheets
- WHO articles: https://www.who.int/news-room/articles
- WHO publications: https://www.who.int/publications
- WHO guidelines: https://www.who.int/publications/who-guidelines
- WHO Global Health Observatory API: https://www.who.int/data/gho/info/gho-odata-api
- WHO copyright/licensing: https://www.who.int/about/policies/publishing/copyright
- WHO permissions request: https://www.who.int/about/policies/publishing/permissions

Expo / React Native references:

- Expo Haptics: https://docs.expo.dev/versions/latest/sdk/haptics/
- Expo BlurView: https://docs.expo.dev/versions/latest/sdk/blur-view/
- Expo GlassEffect: https://docs.expo.dev/versions/latest/sdk/glass-effect/
- Expo Reanimated: https://docs.expo.dev/versions/latest/sdk/reanimated/

---

## 26. Do Not Do

- Do not make the app feel like a heavy admin dashboard.
- Do not show every feature at once.
- Do not use red for normal progress.
- Do not use public leaderboards for health.
- Do not create shame-based streaks.
- Do not auto-share health, child, or AI chat data.
- Do not present AI as a doctor.
- Do not copy full WHO pages into the app without checking license/permissions.
- Do not use WHO photos/figures/maps unless permission/license is confirmed.
- Do not use the WHO logo/emblem in app branding.
- Do not install libraries without checking the repo first.


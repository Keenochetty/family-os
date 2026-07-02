# Health OS - Codex Master UI, UX, Routing, Security and Build Plan

Version: 1.0  
Product: Health OS / Family Health OS  
Primary repo target: `Keenochetty/Healthy-living-tracker`  
Frontend stack target: Expo / React Native / Expo Router / HeroUI Native / Uniwind or NativeWind / TypeScript  
Design direction: Apple-inspired, mature, calm, modular, family-first, privacy-first, global-ready  

---

## 0. Non-negotiable principles for Codex

Codex must follow these rules before writing or changing code.

1. **Privacy first**
   - Never build screens or mock logic that assumes users can access other users' data.
   - Every shared object must have an owner, visibility, permissions, and audit metadata.
   - Child data, caregiver data, health records, AI chats, documents, scans, and Moments are private by default.
   - Sharing must always be explicit and reviewable.

2. **No unauthorized data access**
   - Do not create client logic that fetches all records and filters locally.
   - Prepare the frontend for backend row-level access control.
   - Every data request must be scoped by `userId`, `circleId`, `personId`, `role`, and permission checks.
   - Do not expose internal IDs in UI except where required for debugging in dev mode.

3. **Apple-inspired, not childish**
   - Mature squared-off rounded rectangles, not bubbly full circles everywhere.
   - Premium icons and mature emoji accents only where they add emotion.
   - Use whitespace, calm layering, subtle blur, haptics, and motion.
   - Avoid loud gamification. Celebrate care, progress, and family moments without pressure.

4. **Every button must have a purpose**
   - Buttons must either start, log, review, save, share, learn, fix, celebrate, protect, upgrade, or navigate.
   - Do not create decorative buttons with no defined route/action.
   - Disabled or locked buttons must explain why and how to unlock.

5. **Backend-ready structure**
   - Build routes and components around stable entities: User, Profile, Circle, Person, Realm, Event, Task, Record, Document, Scan, Chat, Moment, Subscription, Permission, Device, Article.
   - Use mock data now, but shape it like backend data.
   - Keep UI components separate from data services.

6. **Global-ready**
   - Do not assume one country, one language, one measurement system, or one health authority.
   - Store canonical units internally and display preferred units.
   - Health content must show source, country/region, last reviewed date, and original link.

7. **Health safety**
   - AI, scanner, articles, and suggestions must not diagnose users.
   - Use educational wording and recommend healthcare professionals for medical decisions.
   - Medication, allergy, pregnancy, mental health, child health, and emergency flows need extra caution.

8. **Accessibility and user control**
   - Support dark mode, light mode, system mode, high contrast, reduced motion, reduced transparency, and Glass mode Full/Reduced/Off.
   - Haptics must be optional.
   - Do not rely only on color to communicate status.

---

## 1. Product vision

Health OS is a global family health operating system. It brings together personal health, fitness, nutrition, mental health, pregnancy, periods, baby tracking, kids, elder care, caregiver/school workflows, AI assistance, records, documents, scanning, calendar planning, connected devices, sports tracking, and family sharing into one calm modular app.

The app must feel small when users need calm and powerful when they need help.

Core sentence:

> Health OS is a calm family health OS on the surface, a powerful AI operating system underneath, and a private memory book when life moments happen.

Primary navigation:

1. Home
2. Calendar
3. Scan
4. Health
5. Family

AI is not just a tab. It is a floating system layer above the nav bar that transforms from a search capsule into a full ChatGPT-style assistant.

---

## 2. Visual design direction

### 2.1 App personality

The app must feel:

- Apple calm
- Family warm
- Health serious
- AI powerful
- Data private
- Moments emotional
- Global and inclusive
- Mature, not cartoonish

### 2.2 Shape language

Use soft squared rectangles and refined rounded corners.

Recommended radii:

```ts
const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
};
```

Avoid using full circles for major cards. Circles are acceptable for avatars, small icon chips, rings, and calendar markers.

### 2.3 Layer model

The app should feel layered like Apple interfaces:

```text
Layer 0: Background / realm color wash
Layer 1: Main page content
Layer 2: Cards and widgets
Layer 3: Floating AI capsule / smart search
Layer 4: Bottom navigation
Layer 5: Pull-up sheets and contextual menus
Layer 6: Full-page detail pages
Layer 7: Reward / Moment celebration overlays
Layer 8: Security / permission / emergency overlays
```

Use blur/glass only where it has purpose:

- floating AI capsule
- nav bar
- smart header actions
- bottom sheets
- contextual menus
- Moments overlays
- permission review sheets
- article half-sheet

Do not apply glass everywhere.

### 2.4 Glass mode

Support Appearance setting:

```ts
GlassMode = 'full' | 'reduced' | 'off'
```

- Full: blur, translucent surfaces, subtle borders.
- Reduced: less blur, stronger card fill, lower transparency.
- Off: solid cards, normal elevation/shadows, no blur.

Android fallback: use solid/elevated cards if blur performance is weak.

### 2.5 Color system

Base colors:

```ts
const base = {
  backgroundLight: '#F7F7F8',
  surfaceLight: '#FFFFFF',
  surfaceLightAlt: '#F1F2F4',
  backgroundDark: '#070A0F',
  surfaceDark: '#111722',
  surfaceDarkAlt: '#182131',
  textPrimaryLight: '#111111',
  textSecondaryLight: '#6A6D75',
  textPrimaryDark: '#F5F7FA',
  textSecondaryDark: '#A8B0BD',
  borderLight: 'rgba(0,0,0,0.08)',
  borderDark: 'rgba(255,255,255,0.10)',
};
```

Brand accents:

```ts
const brand = {
  primary: '#6D5DFB',
  primarySoft: '#A99BFF',
  ai: '#7C5CFF',
  success: '#31C77F',
  warning: '#FFB84D',
  danger: '#FF4D5F',
  info: '#4DA3FF',
};
```

Realm colors:

```ts
const realmColors = {
  fitness: '#FF8A34',
  nutrition: '#34C759',
  familyHealth: '#4DA3FF',
  mentalHealth: '#8B6CFF',
  period: '#FF5CA8',
  ovulation: '#B57CFF',
  pregnancy: '#FF9F8A',
  baby: '#62D6C4',
  kids: '#FFD166',
  caregiver: '#37C8E8',
  medication: '#2EC4B6',
  vitals: '#4DA3FF',
  records: '#8E96A3',
  documents: '#9BA3AF',
  ai: '#7C5CFF',
  emergency: '#FF3B30',
  sport: '#FF6B35',
  sleep: '#5D6DFF',
  hydration: '#33C7FF',
};
```

Status colors:

```ts
const status = {
  normal: '#31C77F',
  low: '#4DA3FF',
  high: '#FFB84D',
  urgent: '#FF4D5F',
  private: '#8E96A3',
  shared: '#6D5DFB',
};
```

Rules:

- Purple is a brand/AI accent, not the entire app personality.
- Realm colors should identify sections, buttons, charts, dots, halos, and icons.
- Medical danger red should be used sparingly.
- Do not rely only on color; use icons, labels, avatars, and text.

### 2.6 Typography

Use system fonts by default.

- iOS: San Francisco via system font.
- Android: system font or Inter fallback where needed.
- Web: Inter or system stack.

Typography scale:

```ts
const typography = {
  hero: { fontSize: 34, lineHeight: 40, fontWeight: '700' },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
};
```

### 2.7 Icons and emojis

Use mature icons. Suggested free icon sets:

- Lucide React Native
- Phosphor Icons
- Iconoir
- Noto Emoji or OpenMoji where licensing allows
- LottieFiles free animations only with license review

Emoji rules:

- Emojis should be premium accents, not childish decoration.
- Use sparingly in headings, rewards, smart header, Moments.
- Prefer mature symbols: sparkle, calendar, heart, leaf, shield, check, compass, family, sun.

---

## 3. Technology recommendations

Current target stack:

- Expo
- React Native
- Expo Router
- TypeScript
- HeroUI Native
- Uniwind or NativeWind
- React Native Reanimated
- React Native Gesture Handler
- Expo Haptics
- Expo BlurView
- Expo SecureStore
- Expo Notifications
- Expo Camera
- Expo Image Picker
- Expo Document Picker
- Expo Sharing
- React Native SVG
- d3-scale for custom charts
- @gorhom/bottom-sheet

Optional/later:

- Expo GlassEffect where supported
- HealthKit on iOS
- Health Connect on Android
- BLE direct device support
- MapLibre / OpenStreetMap for sports routes
- ViewShot for Moments export
- QR code generation for invites

---

## 4. Routing structure

Use Expo Router groups.

```text
app/
├── (auth)/
│   ├── welcome.tsx
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   ├── verify-phone.tsx
│   ├── account-confirm.tsx
│   └── onboarding/
│       ├── account-type.tsx
│       ├── region-language.tsx
│       ├── permissions-preview.tsx
│       ├── health-goals.tsx
│       ├── top-realms.tsx
│       ├── circle-setup.tsx
│       ├── avatar.tsx
│       ├── plan.tsx
│       └── complete.tsx
│
├── (tabs)/
│   ├── home/
│   │   ├── index.tsx
│   │   ├── moment/[id].tsx
│   │   └── smart-action/[id].tsx
│   │
│   ├── calendar/
│   │   ├── index.tsx
│   │   ├── event/[id].tsx
│   │   ├── create-event.tsx
│   │   ├── todo/[id].tsx
│   │   ├── create-todo.tsx
│   │   └── approvals.tsx
│   │
│   ├── scan/
│   │   ├── index.tsx
│   │   ├── result/[id].tsx
│   │   ├── review.tsx
│   │   └── history.tsx
│   │
│   ├── health/
│   │   ├── index.tsx
│   │   ├── realm/[realmId].tsx
│   │   ├── records.tsx
│   │   ├── documents.tsx
│   │   ├── article/[articleId].tsx
│   │   ├── sport/[sportId].tsx
│   │   └── chart/[metricId].tsx
│   │
│   └── family/
│       ├── index.tsx
│       ├── circle/[circleId].tsx
│       ├── person/[personId].tsx
│       ├── caregiver/[caregiverId].tsx
│       ├── invite.tsx
│       ├── permissions.tsx
│       └── shared-chat/[chatId].tsx
│
├── ai/
│   ├── index.tsx
│   ├── chat/[chatId].tsx
│   ├── history.tsx
│   ├── commands.tsx
│   └── share-chat.tsx
│
├── profile/
│   ├── index.tsx
│   ├── avatar.tsx
│   ├── moments.tsx
│   ├── plan.tsx
│   └── settings/
│       ├── index.tsx
│       ├── account.tsx
│       ├── privacy.tsx
│       ├── consent-center.tsx
│       ├── security.tsx
│       ├── region-language-units.tsx
│       ├── appearance.tsx
│       ├── notifications.tsx
│       ├── connected-devices.tsx
│       ├── data-sources.tsx
│       ├── health-data.tsx
│       ├── ai-settings.tsx
│       ├── articles-sources.tsx
│       ├── support.tsx
│       ├── faq.tsx
│       ├── terms.tsx
│       ├── privacy-policy.tsx
│       ├── export-data.tsx
│       ├── delete-account.tsx
│       └── offline.tsx
│
├── notifications/
│   └── index.tsx
│
├── activity-log/
│   └── index.tsx
│
├── emergency/
│   └── index.tsx
│
├── reports/
│   ├── index.tsx
│   └── create.tsx
│
├── support/
│   ├── index.tsx
│   └── session.tsx
│
└── modals/
    ├── article-sheet.tsx
    ├── reward-moment.tsx
    ├── feature-lock.tsx
    ├── permission-request.tsx
    ├── privacy-review.tsx
    ├── conflict-resolution.tsx
    ├── emergency.tsx
    └── subscription-upgrade.tsx
```

---

## 5. Core data entities

Mock data must use these shapes so backend can connect later.

### 5.1 User

```ts
type User = {
  id: string;
  email: string;
  phone?: string;
  phoneVerified: boolean;
  displayName: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  animatedAvatarId?: string;
  createdAt: string;
  updatedAt: string;
  accountStatus: 'active' | 'pending' | 'suspended' | 'deleted';
};
```

### 5.2 Profile

```ts
type Profile = {
  id: string;
  userId: string;
  region: string;
  countryCode: string;
  language: string;
  aiLanguage: string;
  unitPreferences: UnitPreferences;
  accountType: 'personal' | 'caregiver' | 'enterprise';
  planId: string;
  glassMode: 'full' | 'reduced' | 'off';
  theme: 'system' | 'light' | 'dark';
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  reduceTransparency: boolean;
};
```

### 5.3 Unit preferences

```ts
type UnitPreferences = {
  weight: 'kg' | 'lb' | 'stone';
  height: 'cm' | 'ft_in';
  distance: 'km' | 'mi';
  water: 'ml' | 'l' | 'fl_oz' | 'cups';
  temperature: 'c' | 'f';
  glucose: 'mmol_l' | 'mg_dl';
  energy: 'kcal' | 'kj';
  dateFormat: 'dd_mm_yyyy' | 'mm_dd_yyyy' | 'yyyy_mm_dd';
  timeFormat: '12h' | '24h';
};
```

### 5.4 Circle

```ts
type Circle = {
  id: string;
  ownerId: string;
  name: string;
  type: 'household' | 'extended_family' | 'friends' | 'care_team' | 'school' | 'sport' | 'custom';
  avatarUrl?: string;
  createdAt: string;
  privacyLevel: 'private' | 'invite_only' | 'organization';
};
```

### 5.5 Circle member

```ts
type CircleMember = {
  id: string;
  circleId: string;
  userId: string;
  displayRole: string;
  roleType: 'admin' | 'parent' | 'partner' | 'child' | 'family' | 'friend' | 'caregiver' | 'teacher' | 'viewer' | 'custom';
  permissions: PermissionSet;
  joinedAt: string;
  status: 'active' | 'invited' | 'blocked' | 'removed';
};
```

### 5.6 Permission set

```ts
type PermissionSet = {
  canViewSummary: boolean;
  canViewRecords: boolean;
  canViewDocuments: boolean;
  canViewPhotos: boolean;
  canViewCalendar: boolean;
  canCreateEvents: boolean;
  canCreateTasks: boolean;
  canUpdateCareLogs: boolean;
  canComment: boolean;
  canShare: boolean;
  canInviteOthers: boolean;
  canManagePermissions: boolean;
};
```

### 5.7 Health realm

```ts
type HealthRealm = {
  id: string;
  key: string;
  name: string;
  color: string;
  icon: string;
  enabled: boolean;
  pinned: boolean;
  order: number;
  privacy: 'private' | 'shared' | 'custom';
};
```

### 5.8 Health record

```ts
type HealthRecord = {
  id: string;
  ownerUserId: string;
  personId?: string;
  realmKey: string;
  metricKey: string;
  value: number | string | boolean;
  unitCanonical?: string;
  displayUnit?: string;
  recordedAt: string;
  source: 'manual' | 'device' | 'scan' | 'ai' | 'calendar' | 'import';
  sourceId?: string;
  status?: 'normal' | 'low' | 'high' | 'urgent' | 'unknown';
  notes?: string;
  attachments?: string[];
  visibility: Visibility;
  createdBy: string;
  updatedAt: string;
};
```

### 5.9 Visibility

```ts
type Visibility = {
  level: 'private' | 'partner' | 'circle' | 'caregiver' | 'school' | 'custom';
  circleIds?: string[];
  userIds?: string[];
  expiresAt?: string;
};
```

### 5.10 Calendar event

```ts
type CalendarEvent = {
  id: string;
  ownerUserId: string;
  circleId?: string;
  personIds: string[];
  title: string;
  type: 'appointment' | 'workout' | 'sport' | 'meal' | 'medication' | 'school' | 'caregiver' | 'family' | 'period' | 'pregnancy' | 'baby' | 'task' | 'custom';
  startsAt: string;
  endsAt?: string;
  location?: string;
  notes?: string;
  attachments?: string[];
  colorKey: string;
  icon: string;
  createdBy: string;
  approvalRequired: boolean;
  approvalStatus?: 'pending' | 'approved' | 'denied';
  visibility: Visibility;
  attendees: EventAttendee[];
};
```

### 5.11 Task

```ts
type Task = {
  id: string;
  title: string;
  createdBy: string;
  assignedTo?: string;
  circleId?: string;
  personId?: string;
  dueAt?: string;
  status: 'todo' | 'in_progress' | 'done' | 'could_not_complete' | 'needs_help' | 'blocked';
  notes?: string;
  photos?: string[];
  visibility: Visibility;
};
```

### 5.12 AI chat

```ts
type AIChat = {
  id: string;
  ownerUserId: string;
  title: string;
  category: 'general' | 'fitness' | 'nutrition' | 'family' | 'baby' | 'pregnancy' | 'period' | 'mental_health' | 'documents' | 'scan' | 'caregiver' | 'sport';
  linkedPersonId?: string;
  linkedCircleId?: string;
  linkedRealmKey?: string;
  privacy: Visibility;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
};
```

### 5.13 Moment

```ts
type Moment = {
  id: string;
  ownerUserId: string;
  circleId?: string;
  personId?: string;
  type: 'celebration' | 'progress' | 'family' | 'pregnancy' | 'baby' | 'fitness' | 'nutrition' | 'caregiver' | 'sport' | 'custom';
  title: string;
  subtitle?: string;
  templateId: string;
  imageUrls: string[];
  stats?: Record<string, string | number>;
  note?: string;
  privacy: Visibility;
  createdAt: string;
};
```

### 5.14 Article

```ts
type Article = {
  id: string;
  realmKey: string;
  title: string;
  summary: string;
  keyTakeaways: string[];
  sourceName: string;
  sourceUrl: string;
  sourceRegion?: string;
  language: string;
  lastReviewed?: string;
  imageUrl?: string;
  imageCredit?: string;
  imageLicense?: string;
  medicalDisclaimer: string;
};
```

### 5.15 Feature gate

```ts
type FeatureGate = {
  featureKey: string;
  requiredPlan: 'free' | 'plus' | 'family' | 'care_school' | 'enterprise';
  usageLimit?: number;
  currentUsage?: number;
  resetPeriod?: 'daily' | 'monthly' | 'yearly';
  trialAvailable?: boolean;
};
```

---

## 6. Security architecture guidance

Codex must structure code so security can be enforced by backend later.

### 6.1 Frontend permission guard

Create:

```text
src/security/permissions.ts
src/security/featureGates.ts
src/security/privacyReview.ts
src/security/auditEvents.ts
```

Frontend checks do not replace backend security. They only improve UX. Backend must enforce final access.

Required helpers:

```ts
function canViewRecord(user: User, record: HealthRecord, memberships: CircleMember[]): boolean;
function canShareItem(user: User, item: ShareableItem, target: ShareTarget): boolean;
function canManageCircle(user: User, circle: Circle, membership: CircleMember): boolean;
function requiresPrivacyReview(item: ShareableItem): boolean;
function getFeatureGate(featureKey: string, planId: string): FeatureGateResult;
```

### 6.2 Sensitive categories

Treat these as sensitive:

- child data
- pregnancy data
- period/cycle data
- mental health data
- medication data
- documents
- AI chats
- scans
- location
- caregiver/school notes
- emergency profile
- biometric/device health metrics

### 6.3 Sharing flow

Every share action must follow:

```text
Select item
→ Select target person/circle
→ Choose share level
→ Privacy review
→ Confirm
→ Save share permission
→ Audit event
```

Privacy review must show what is included:

```text
This share includes:
- child name
- photo
- date
- health note
- medication information

[Remove sensitive info]
[Share]
[Cancel]
```

### 6.4 Audit log

Create an `ActivityLog` page and model. Audit these events:

- login
- device sync
- permission changed
- record viewed/shared/exported
- document viewed/shared/exported
- child profile updated
- caregiver access changed
- AI chat shared
- support session opened
- account data exported
- account deleted

### 6.5 Support/admin access

Support/admin tools must use consent-based support sessions.

Flow:

```text
User opens Help
→ Start support session
→ User chooses what support can see
→ Temporary support token created
→ Admin/support sees only selected diagnostic data
→ Session expires
→ Audit log saved
```

Support can view:

- app version
- device type
- account status
- subscription status
- sync errors
- permission status
- crash/support logs

Support must not view private health records, child photos, AI chats, documents, caregiver notes, or family records unless user explicitly shares them for that support session.

### 6.6 Data request rule

Never write data services like:

```ts
fetch('/records') // bad
```

Use scoped services:

```ts
getRecordsForPerson({ userId, personId, circleId, permissionContext })
```

---

## 7. Onboarding design

### 7.1 Onboarding goal

Onboarding must naturally collect enough information to personalize the app, without overwhelming the user.

It should feel like setting up a premium Apple/Android device.

### 7.2 Flow

```text
Welcome
→ Sign in/create account
→ Verify phone
→ Confirm profile details
→ Select account type
→ Region, language and units
→ Purpose pills
→ Top 4 realms
→ Permission preview
→ Family circle setup
→ Avatar setup
→ Plan selection
→ Home ready
```

### 7.3 Welcome screen

Purpose: emotional first impression.

Content:

```text
Welcome to Health OS
A private health, family and care space that grows with your life.
```

Buttons:

- Continue with Apple
- Continue with Google
- Sign up with email
- Sign in

Action routes:

- Apple -> `/auth/account-confirm`
- Google -> `/auth/account-confirm`
- Email -> `/auth/sign-up`
- Sign in -> `/auth/sign-in`

### 7.4 Phone verification

Phone number is required to reduce fake duplicate accounts.

Copy:

```text
We use your phone number to protect accounts and reduce duplicate or fake signups.
```

Route: `/auth/verify-phone`

### 7.5 Confirm detected details

If Apple/Google returns profile info, present it for confirmation.

Fields:

- name
- email
- phone if available
- date of birth if available
- region/country
- language
- units

Buttons:

- Looks right -> next step
- Edit -> editable form

### 7.6 Account type

Top segmented control:

- Personal
- Caregiver
- Enterprise

Personal shows family/health setup.  
Caregiver shows work profile setup.  
Enterprise shows organization/school setup.

Route: `/auth/onboarding/account-type`

### 7.7 Region, language and units

Default from device locale where possible, but ask user to confirm.

Capture:

- country/region
- preferred language
- AI response language
- article language
- video preferred language
- captions default
- units
- date/time format

Video notice copy:

```text
Some videos may be in English because they come from public health creators. You can still follow along visually, use captions where available, and switch language or audio if the creator provides it.
```

### 7.8 Purpose pills

Use moving pills that are mature and subtle.

Screen title:

```text
What should Health OS help with first?
```

Pills:

- Fitness
- Nutrition
- Family health
- Baby tracking
- Pregnancy
- Period tracking
- Mental health
- Medication
- Documents
- Sports
- Caregiver updates
- School
- Elder care
- Allergies
- Weight goals
- Sleep
- Vitals

Button:

- Continue -> generates top realms

### 7.9 Top 4 realms

Show four selected realm widgets. User can change them.

Buttons:

- Replace realm
- Reorder
- Continue

### 7.10 Permission preview

Do not request all permissions immediately.

Preview:

- Calendar
- Contacts
- Camera
- Photos
- Notifications
- Location
- Health data
- Bluetooth

Buttons:

- Set up now
- Later

If Set up now, request permissions in small groups with explanation.

### 7.11 Family circle setup

Ask if user wants to create a household circle now.

Buttons:

- Create circle
- Invite later

If create:

- circle name
- add partner/family
- invite link/QR
- role setup
- permission preset

### 7.12 Avatar setup

Options:

- upload photo
- take photo
- animated avatar
- initials
- child-friendly avatar
- caregiver professional avatar

### 7.13 Plan selection

Plan tiers:

- Free
- Plus
- Family
- Care/School
- Enterprise later

Feature locks can be shown but do not pressure users.

---

## 8. Main navigation and page purposes

### 8.1 Home

Purpose:

```text
Show what matters today.
```

Home sections:

1. Smart retractable header
2. Today action carousel
3. Floating AI capsule
4. Latest Moment
5. Light suggestions
6. Family updates
7. Weekly glance
8. Quick actions

#### Home header behavior

Expanded:

```text
Good morning, Keeno 👋
Today has 3 things ready.

[Next: Soccer at 18:00]
[Log water] [Mood check] [Medication]
```

Collapsed:

```text
Keeno 👋   3 due today
```

Swipe horizontally through header action cards:

- Workout
- Medication
- Mood
- Baby feed
- Water
- Period log
- Task
- Calendar event

Buttons:

- Start
- Log
- Review
- Skip
- Reschedule

### 8.2 Calendar

Purpose:

```text
Plan, coordinate, approve, and remember.
```

Sections:

- month/week/day view
- person/circle filters
- event dots
- period and ovulation halos
- today timeline
- to-dos
- invites
- parent approvals

Buttons:

- Add
- Filter
- Search
- Today
- Respond
- Approve
- Share

### 8.3 Scan

Purpose:

```text
Understand the real world and turn it into useful app data.
```

Modes:

- barcode
- product label
- ingredients
- nutrition table
- medicine package
- document
- doctor note
- prescription
- baby product
- school form
- meal photo
- vitals screen

Buttons:

- Scan
- Use photo
- Upload document
- Review result
- Save
- Ask AI
- Share
- Add to records

### 8.4 Health

Purpose:

```text
Track, understand and improve health without clutter.
```

Sections:

- Top 4 active realm widgets
- This week's catch-up
- Documents
- Records/history
- More tools
- Articles inside active realms

### 8.5 Family

Purpose:

```text
Manage people, relationships, permissions, shared care and family memories.
```

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
- Permissions
- Invites
- Family Moments

### 8.6 Profile

Purpose:

```text
Identity, plan, privacy status, connected devices, Moments and settings.
```

Sections:

- profile card
- animated avatar
- plan badge
- region/language/unit summary
- family circles preview
- connected devices preview
- privacy score/status
- latest Moment
- settings entry

### 8.7 Settings

Sections:

- Account
- Profile
- Plan & billing
- Privacy & sharing
- Consent center
- Security / 2FA
- Region, language & units
- Appearance
- Notifications
- Health data & metrics
- Connected devices
- Data sources
- Family & circles
- Caregiver / school mode
- AI settings
- Moments settings
- Articles & sources
- Data export
- Help & support
- FAQ
- Terms
- Privacy policy
- Delete account

---

## 9. Floating AI system

### 9.1 AI states

```text
1. Floating capsule
2. Keyboard composer
3. Half-sheet assistant
4. Full page AI chat
```

Floating capsule copy:

```text
Ask, scan, search, or create...
```

Behavior:

- visible above nav
- hides on scroll down
- returns on scroll up
- tap opens keyboard composer
- drag up opens half sheet
- expand button opens full AI page

### 9.2 AI full page

Sections:

- top bar: back, title, history, new chat
- chat area
- context chips: Me, Partner, Child, Family, Records
- composer: attach, text, mic, send
- action cards generated by AI

### 9.3 AI actions

AI can prepare but not silently save sensitive actions.

Actions:

- create event
- create task
- create meal plan
- create workout
- summarize document
- save health record
- share chat
- create Moment
- suggest article

Sensitive actions must show:

```text
AI prepared this. Please review before saving.
```

---

## 10. Long press and context actions

Rules:

- Tap = open/primary action.
- Long press = manage/secondary actions.
- Drag = reorder/expand/move.
- Swipe = quick status action only where safe.
- Haptic feedback on long press where supported.
- Essential actions must not only exist behind long press.
- Destructive actions separated and confirmed.
- Sensitive actions require permission and privacy review.
- On desktop/web, right click opens the same context menu.

Create reusable component:

```text
ContextActionMenu
```

Model:

```ts
type ContextAction = {
  id: string;
  label: string;
  icon: string;
  tone: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  requiredPermission?: string;
  requiredPlan?: string;
  confirmationRequired?: boolean;
  destructive?: boolean;
  onPress: () => void;
};
```

### 10.1 Date long press

- Add event
- Add to-do
- Add medication reminder
- Add workout
- Add sport day
- Add period note
- Add pregnancy note
- Add baby log
- Add family note
- View day
- Set availability
- Mark travel day

### 10.2 Event long press

- Open
- Edit
- Duplicate
- Reschedule
- Invite people
- Change visibility
- Add note
- Attach photo
- Mark complete
- Create Moment
- Delete

### 10.3 Widget long press

- Open realm
- Quick log
- View records
- View charts
- Ask AI
- Reorder
- Replace
- Change size
- Change color
- Make private
- Share summary
- Remove from Top 4

### 10.4 Chart point long press

- View exact value
- Add note to this date
- Mark sick day
- Compare with sleep/activity
- Share snapshot
- Ask AI about this change

### 10.5 Person long press

- View profile
- Message
- Share update
- Change role
- Manage permissions
- Add to circle
- Remove from circle
- Set emergency contact
- View shared items

---

## 11. Charts, graphs, diagrams and rings

### 11.1 Chart design rules

Charts must be:

- clean
- minimal
- readable
- touch-friendly
- realm-colored
- accessible
- not cluttered
- label important points
- support long press for exact values

Use `react-native-svg` and `d3-scale` for custom premium charts where possible.

### 11.2 Chart component library

Create:

```text
src/components/charts/
├── LineTrendChart.tsx
├── WeeklyBarChart.tsx
├── GoalRing.tsx
├── MultiRingSummary.tsx
├── RangeVitalChart.tsx
├── CalendarHeatmap.tsx
├── TimelineChart.tsx
├── HeartRateZoneChart.tsx
├── RoutePreviewMap.tsx
├── MiniSparkline.tsx
└── ChartCard.tsx
```

### 11.3 Which chart for which feature

| Feature | Chart/diagram | Purpose |
|---|---|---|
| Weight | LineTrendChart | Show long-term trend, not daily shame |
| Water | WeeklyBarChart / GoalRing | Daily target and weekly totals |
| Heart rate | RangeVitalChart | Resting, average, max, zones |
| Blood pressure | RangeVitalChart | Systolic/diastolic status |
| Sleep | WeeklyBarChart + LineTrendChart | Hours and consistency |
| Mood | CalendarHeatmap | Patterns over time |
| Period | Calendar halos + TimelineChart | Cycle days, prediction, symptoms |
| Ovulation | Calendar halo band | Fertile window visual |
| Pregnancy | TimelineChart | Week-by-week journey |
| Baby growth | LineTrendChart | Weight/height trend |
| Baby feeding | TimelineChart / WeeklyBarChart | Feeds over day/week |
| Fitness | GoalRing + WeeklyBarChart | Active minutes, workouts |
| Sports | RoutePreviewMap + HeartRateZoneChart | Route, pace, elevation, zones |
| Nutrition | WeeklyBarChart / macro rings | Meals, calories, macros |
| Medication | CalendarHeatmap | Adherence and missed days |
| Vitals | RangeVitalChart | Normal/high/low status |
| Family tasks | Progress bar | Shared completion |
| Moments | Cards and rings | Progress and memories |

### 11.4 Rings

Use rings for progress, not pressure.

Ring types:

- Fitness ring
- Nutrition ring
- Mind ring
- Family ring
- Baby ring
- Pregnancy ring
- Care ring
- Records ring

Rules:

- Do not call rings scores.
- Rings show meaningful activity.
- Allow users to hide rings.
- Avoid aggressive streak shame.

---

## 12. Moments and rewards

### 12.1 Product definition

Moments = celebrations + memories + progress cards + family story visuals + social-ready posts.

Moments live in:

- Home
- Profile
- Family
- Pregnancy timeline
- Baby timeline
- Fitness progress
- Nutrition progress
- Caregiver updates

### 12.2 Reward types

1. Celebration moments
2. Progress moments
3. Family moments
4. Personal encouragement moments

### 12.3 Celebration levels

```ts
type CelebrationLevel = 0 | 1 | 2 | 3 | 4;
```

- 0: no celebration, just saved
- 1: haptic + toast
- 2: reward card
- 3: half-sheet celebration
- 4: full-screen milestone

Examples:

- Log water = 1
- Complete workout = 2
- Create family circle = 3
- Baby milestone = 4
- Pregnancy trimester = 4
- Medication taken = 1
- Allergy warning = safety card, not celebration

### 12.4 Moment creator

Flow:

```text
Choose source
→ Choose template
→ Customize text/images
→ Preview
→ Privacy review
→ Save/share/export
```

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

- Apple-like home card
- story post
- square social post
- family collage
- progress card
- pregnancy milestone
- baby memory
- minimal poster

Privacy review required for child photos, health notes, dates, medication, location.

---

## 13. Articles and health content

### 13.1 Source priority

Use a tiered trusted-source model.

Tier 1:

- WHO
- WHO regional offices
- national health authorities
- MedlinePlus / NIH / NLM
- CDC
- NHS
- country-specific health ministries

Tier 2:

- USDA FoodData Central
- DailyMed
- RxNorm
- openFDA
- WHO Global Health Observatory

Tier 3:

- Open Food Facts
- FoodRepo

Tier 4:

- reputable hospital/clinic publishers with licensing review

### 13.2 Country-aware source routing

Create `CountryHealthProfile`.

```ts
type CountryHealthProfile = {
  countryCode: string;
  countryName: string;
  whoRegion: string;
  primaryHealthAuthority: string;
  secondarySources: string[];
  emergencyNumbers: string[];
  measurementSystem: 'metric' | 'imperial' | 'mixed';
  defaultLanguage: string;
  medicationAuthority?: string;
  foodAuthority?: string;
  sourcePriority: string[];
};
```

Rules:

- Local authority first.
- WHO regional/global fallback.
- Show article source, region, language, last reviewed date.
- Do not copy full articles unless license clearly allows.
- Prefer app-written summaries with original source links.

### 13.3 Article half-sheet design

Flow:

```text
Article card inside realm
→ Tap
→ Half pull-up article view
→ Drag up for full reading view
```

Article sheet layout:

- header
- source badge
- hero image or safe generated illustration
- summary
- key points
- related app actions
- medical disclaimer
- source link
- last reviewed date

Actions:

- Save
- Ask AI
- Create reminder
- Add to care plan
- Share with family
- Open source

---

## 14. Calendar details

### 14.1 Calendar visual rules

Month view:

- soft square date cells
- small colored dots under dates
- max 3 visible dots + more indicator
- period/ovulation halos as subtle bands
- avatars/details only in expanded day timeline

Period/ovulation:

- confirmed period: soft pink halo
- predicted period: lighter/dashed pink halo
- ovulation window: lavender band
- peak ovulation: stronger ring
- pregnancy weeks: peach timeline band

### 14.2 Event responses

Responses:

- Going
- Maybe
- Can't make it
- Need help
- Running late
- Seen
- Custom response

Child-created events need parent approval.

Flow:

```text
Child creates event
→ Parent approval required
→ Parent approves/edits/denies
→ Event shared if approved
```

### 14.3 To-dos

Task statuses:

- To do
- In progress
- Done
- Could not complete
- Needs help
- Blocked

Task can include:

- due date/time
- assigned person
- notes
- photos
- reason if not completed

---

## 15. Family, circles and contacts

### 15.1 Concept

Family and friends are smart contacts with roles, permissions, and context.

One person can be:

- brother
- son
- father
- husband
- uncle
- son-in-law
- friend
- caregiver
- teacher
- emergency contact

Roles can differ by circle.

### 15.2 Circle types

- Household
- Extended family
- Friends
- Grandparents
- Care team
- School/nursery
- Sport group
- Custom

### 15.3 Invite flow

Methods:

- QR code
- share link
- contacts
- email
- SMS/WhatsApp share sheet
- caregiver code
- school code

Flow:

```text
Invite person
→ Choose circle
→ Choose relationship
→ Choose role
→ Choose permissions
→ Choose expiry
→ Send QR/link
```

Links and QR codes should expire.

---

## 16. Caregiver and enterprise

### 16.1 Caregiver mode

Caregiver has a separate work profile but can appear under a family circle when invited.

Caregiver work profile:

- profile photo
- optional intro video
- about
- address
- transport
- email
- cell
- alt number
- role
- organization/school connection
- availability
- qualifications/notes

Caregiver permissions are controlled by parents.

### 16.2 Caregiver child card

Caregiver can see only shared fields:

- allergies
- medication
- feeding schedule
- nap schedule
- pickup info
- emergency contacts
- notes
- daily photos
- incident reports
- assigned tasks

### 16.3 Enterprise/school later

Enterprise/school features:

- organization profile
- staff roles
- class/group assignment
- child assignment
- parent updates
- group messages
- attendance
- incident reports
- audit logs

---

## 17. Scanner

### 17.1 Auto-detection

Scanner should auto-detect:

- barcode
- product label
- ingredients
- nutrition table
- medication package
- document
- doctor note
- prescription
- food plate
- vitals screen
- baby product
- school form

### 17.2 Review before save

Every scan output must have review step:

```text
AI found this. Please review before saving.
```

Actions:

- Save to records
- Add to allergy profile
- Add to meal plan
- Add to grocery list
- Share
- Ask AI
- Add reminder
- Attach to person

### 17.3 Safety wording

For allergy/medication/contraceptive/pregnancy interactions:

```text
Possible concern found. Please confirm with a healthcare professional or pharmacist.
```

Do not make final medical claims.

---

## 18. Connected devices and sports

### 18.1 Device strategy

Order of implementation:

1. Apple Health placeholder on iOS
2. Health Connect placeholder on Android
3. Fitbit/Google Health API where available
4. BLE direct device support
5. Manual import
6. CSV/PDF/photo scan import

### 18.2 Device library

```ts
type DeviceProfile = {
  id: string;
  brand: string;
  model: string;
  deviceType: 'watch' | 'band' | 'ring' | 'scale' | 'bp_monitor' | 'glucose_meter' | 'thermometer' | 'pulse_oximeter' | 'bike_sensor' | 'heart_rate_strap' | 'sleep_tracker' | 'other';
  connectionType: 'apple_health' | 'health_connect' | 'api' | 'ble' | 'manual';
  supportedMetrics: string[];
  supportedPlatforms: ('ios' | 'android' | 'web')[];
  reliabilityScore?: number;
};
```

Brands to consider later:

- Apple Watch
- Samsung Galaxy Watch
- Fitbit
- Garmin
- Huawei
- Amazfit
- Polar
- WHOOP
- Oura
- Withings
- Omron
- Hoco
- Xiaomi / Mi Band
- Coros
- Wahoo

### 18.3 Data source manager

Same metric can come from multiple sources.

Create page:

```text
Health Data Sources
```

For each metric allow:

- primary source
- fallback source
- manual override
- conflict resolution

### 18.4 Sports tracking

Sports section under Fitness/Health.

Features:

- plan sport day
- track live sport
- import from watch
- label unknown workout
- add to weekly goal
- analyze performance
- share with family/friends

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
- heart rate zones
- calories/energy
- elevation gain
- altitude
- route map
- temperature/climate where available
- recovery
- perceived effort
- injury notes
- hydration

---

## 19. Subscriptions and feature gates

Initial plan tiers:

### Free

- personal profile
- Top 4 realms
- basic logs
- basic calendar
- limited AI
- basic documents
- basic Moments
- one family circle
- limited scans

### Plus

- unlimited personal realms
- more AI chats
- advanced health summaries
- more document storage
- scan history
- custom Moments
- export reports
- connected device insights
- advanced charts

### Family

- multiple family members
- multiple circles
- shared chats
- shared to-dos
- child profiles
- caregiver invite
- family calendar
- family Moments
- advanced permissions

### Care/School

- caregiver work profile
- child assignment
- parent updates
- photo notes
- incident reports
- class/group updates
- attendance
- care records

### Feature lock UI

Rules:

- show small lock icon
- still show preview if safe
- explain benefit
- avoid aggressive dark patterns
- route to upgrade sheet

Locked feature card actions:

- View plan
- Try Plus
- Unlock Family sharing
- Not now

---

## 20. Missing/required pages

Build these before backend integration or keep as mock screens:

1. Notification center
2. Activity/audit log
3. Consent center
4. Emergency profile
5. Data source manager
6. Reports/export
7. Offline settings
8. Conflict resolution modal
9. Support session control
10. Articles/source library
11. Import/export center
12. Feature discovery / Explore tools

---

## 21. Responsive and multi-device behavior

The app must support phones, tablets, iPads, laptops, desktops, and web.

### Phone

- single column
- bottom nav
- floating AI capsule
- bottom sheets
- thumb-friendly actions

### Tablet / iPad

- split layout
- sidebar or wider tab layout
- main content + detail panel
- AI as side panel or floating sheet
- larger charts

### Desktop / web

- left sidebar
- top AI/search
- multi-column dashboard
- resizable panels
- right-click context menus
- keyboard shortcuts later

Same routes, adaptive layout containers.

---

## 22. Button action taxonomy

Every button must belong to one of these categories:

- Start something
- Log something
- Review something
- Save something
- Share something
- Learn something
- Fix something
- Celebrate something
- Protect something
- Upgrade/unlock something
- Navigate somewhere

If a button does not fit, remove it.

### Example buttons and routes

| Button | Action | Route/Result |
|---|---|---|
| Start workout | Starts workout flow | `/health/sport/create` or workout modal |
| Log water | Opens quick log | smart action modal |
| Review document | Opens doc review | `/health/documents` or `/scan/review` |
| Add event | Opens event creator | `/calendar/create-event` |
| Add task | Opens task creator | `/calendar/create-todo` |
| Invite family | Invite flow | `/family/invite` |
| Manage permissions | Permissions | `/family/permissions` |
| Ask AI | Opens AI composer | `/ai` or floating AI state |
| Create Moment | Moment creator | `/profile/moments` or modal |
| View source | Open source link | external browser/webview |
| Upgrade | Upgrade sheet | `/profile/plan` or modal |
| Delete account | Delete account flow | `/profile/settings/delete-account` |

---

## 23. Component architecture

Suggested folders:

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── cards/
│   ├── charts/
│   ├── forms/
│   ├── sheets/
│   ├── context-menu/
│   ├── ai/
│   ├── calendar/
│   ├── health/
│   ├── family/
│   ├── moments/
│   └── scanner/
│
├── theme/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── radius.ts
│   ├── shadows.ts
│   ├── motion.ts
│   └── index.ts
│
├── data/
│   ├── mock/
│   ├── regions/
│   ├── sources/
│   └── devices/
│
├── security/
│   ├── permissions.ts
│   ├── featureGates.ts
│   ├── privacyReview.ts
│   └── auditEvents.ts
│
├── services/
│   ├── auth.ts
│   ├── healthRecords.ts
│   ├── calendar.ts
│   ├── family.ts
│   ├── ai.ts
│   ├── devices.ts
│   └── articles.ts
│
├── hooks/
│   ├── useThemeMode.ts
│   ├── useGlassMode.ts
│   ├── useHaptics.ts
│   ├── usePermissions.ts
│   ├── useFeatureGate.ts
│   ├── useResponsiveLayout.ts
│   └── useScopedData.ts
│
└── types/
    ├── user.ts
    ├── health.ts
    ├── family.ts
    ├── calendar.ts
    ├── ai.ts
    ├── devices.ts
    ├── articles.ts
    └── permissions.ts
```

---

## 24. Precise Codex build prompts

Use these prompts one at a time. Do not ask Codex to build the whole app in one prompt.

### Prompt 1 - Design system and security scaffolding

```text
Create the Health OS design system and security scaffolding.

Add TypeScript theme files for colors, realm colors, typography, spacing, radius, shadows, motion, and glass mode. Add hooks for theme mode, glass mode, haptics, feature gates, permissions, and responsive layout.

Also add security placeholder helpers for permission checks, privacy review, feature gates, and audit event definitions. These helpers should use mock data now but be structured so backend row-level security can enforce the same rules later.

Do not change navigation yet. Do not add backend calls. Keep code strongly typed.
```

### Prompt 2 - Routing shell

```text
Implement the Health OS Expo Router structure.

Create route groups for auth, onboarding, main tabs, AI, profile/settings, notifications, activity log, emergency, reports, support, and modals. Add placeholder screens for each route with the correct title, purpose, and primary actions.

Main tab order must be Home, Calendar, Scan, Health, Family. Add a floating AI capsule placeholder above the nav bar but do not fully implement its animation yet.

Use mature Apple-inspired layout with squared rounded rectangles, not bubbly circles.
```

### Prompt 3 - Onboarding

```text
Build the onboarding UI flow.

Screens: welcome, sign-in, sign-up, phone verification, account confirmation, account type, region/language/units, purpose pills, Top 4 realms, permission preview, circle setup, avatar setup, plan selection, complete.

Use mock auth data. If a Google/Apple profile is present, show detected info for confirmation and editing. Require phone verification UI. Include Personal/Caregiver/Enterprise account type selector. Include language and video-language notice. Include purpose moving pills that generate Top 4 realms.

Do not request real native permissions yet. Use permission preview cards.
```

### Prompt 4 - Home and smart header

```text
Build the Home tab with Health OS smart retractable header.

The header must expand with greeting, profile/circle context, and swipeable scheduled action cards. It must collapse into a compact status row. Include actions for workout, medication, mood, baby feed, water, period log, and task.

Add Latest Moment, light suggestions, family updates, weekly glance, and quick actions. Long press on header cards and widgets should open context action menus. Use mock data and haptics where available.
```

### Prompt 5 - Floating AI layer

```text
Implement the floating AI capsule states.

States: collapsed capsule, keyboard composer, half-sheet assistant, full-page AI chat. Support tap to open, drag up to expand, drag down to collapse, and an expand button. Add chat history placeholders, command chips, attachments, voice button placeholder, and save-to-app action cards.

Sensitive AI actions must show review-before-save UI. Shared chats must show privacy labels.
```

### Prompt 6 - Calendar

```text
Build the Calendar tab.

Include month view with soft square date cells, event dots, period halos, ovulation halos, person/circle filters, today timeline, to-dos, invites, attendance responses, and parent approval cards.

Long press on dates opens date actions. Long press on events opens event actions. Long press on tasks opens task actions. Use mock events and tasks with category colors, icons, and avatars.
```

### Prompt 7 - Health tab and charts

```text
Build the Health tab.

Layout: Top 4 active realm widgets, This week's catch-up, Documents, Records/history, More tools grouped by category, and realm article cards.

Create chart components: LineTrendChart, WeeklyBarChart, GoalRing, RangeVitalChart, CalendarHeatmap, TimelineChart, MiniSparkline, and ChartCard using react-native-svg where possible. Use mock health records and display correct chart types for weight, water, blood pressure, heart rate, sleep, mood, period, pregnancy, baby, sports, nutrition, medication, and vitals.

Every chart card must support long press actions for exact value, add note, share snapshot, and ask AI.
```

### Prompt 8 - Family circles

```text
Build the Family tab.

Include circle switcher, household, extended family, friends, children, caregivers, schools, shared chats, shared tasks, permissions preview, and invite by QR/link entry point.

People are smart contacts with roles per circle. Include UI for relationship roles and permissions. Parent/child and caregiver data must show privacy labels. Long press person, child, caregiver, circle, and shared chat cards to open context actions.
```

### Prompt 9 - Profile and settings

```text
Build Profile and Settings.

Profile must include animated avatar/profile image placeholder, plan badge, region/language/unit summary, family circles preview, connected devices preview, latest Moment, privacy status, and settings entry.

Settings sections: Account, Profile, Plan & billing, Privacy & sharing, Consent center, Security/2FA, Region/language/units, Appearance with Glass mode Full/Reduced/Off, Notifications, Health data & metrics, Connected devices, Data sources, Family & circles, Caregiver/school mode, AI settings, Moments settings, Articles & sources, Data export, Help/support, FAQ, Terms, Privacy policy, Delete account.

Use Apple-style grouped settings with layered page navigation and Android fallback styling.
```

### Prompt 10 - Moments

```text
Build the Moments UI system.

Add Latest Moment cards, Moments gallery, Create Moment flow, template previews, celebration overlays, progress rings, haptics, privacy review, and export/share placeholders.

Templates: family collage, pregnancy milestone, baby milestone, fitness progress, nutrition win, document saved, sport result, minimal poster. Child photos and health details must trigger privacy review before sharing.
```

### Prompt 11 - Scanner

```text
Build the Scan tab UI.

Include camera placeholder, auto-detect mode cards, barcode detected state, product label state, document state, medication state, food label state, and review-before-saving result screen.

Actions: Save to records, Ask AI, Share, Add to allergy profile, Add to meal plan, Add to grocery list, Add reminder, Attach to person.

Use cautious medical wording and source placeholders.
```

### Prompt 12 - Connected devices and sports

```text
Build Connected Devices and Sports Tracking UI.

Connected Devices: Apple Health placeholder on iOS, Health Connect placeholder on Android, Bluetooth scan placeholder, device library list, metric permissions, sync status, last sync, disconnect flow, data source priority.

Sports: plan sport day, choose sport type, invite people, import unknown workout, label workout as soccer/padel/etc, add to weekly goal, display sport detail with metrics, route preview placeholder, heart rate zones, elevation, and sport Moment after completion.
```

### Prompt 13 - Missing trust pages

```text
Build trust and safety pages.

Add Notification Center, Activity/Audit Log, Consent Center, Emergency Profile, Data Source Manager, Reports/Export, Offline Settings, Conflict Resolution modal, Support Session Control, Articles/Source Library, Import/Export Center, and Feature Discovery/Explore Tools.

Use mock data. Every page must clearly state its purpose, primary actions, privacy labels, and security implications.
```

### Prompt 14 - Feature gates and subscription locks

```text
Implement frontend feature gates.

Create a feature gate model for plans Free, Plus, Family, Care/School, Enterprise. Add usage limits for AI chats, scans, family circles, caregiver profiles, document storage, advanced charts, Moment exports, connected devices, and reports.

Locked features should show a small lock icon, preview when safe, clear upgrade explanation, and route to an upgrade sheet. Do not use aggressive dark patterns.
```

---

## 25. Acceptance criteria

Before marking the UI foundation complete, verify:

- Main tab order is Home, Calendar, Scan, Health, Family.
- Floating AI capsule exists globally above nav.
- AI can expand from capsule to composer to half sheet to full chat.
- Home has smart retractable header.
- Health has Top 4 realms, weekly catch-up, documents, records, more tools, articles.
- Calendar has dots, halos, to-dos, attendance, parent approvals.
- Family has circles, roles, caregivers, shared chats, permissions, invites.
- Profile/settings includes plan, security, privacy, region/language/units, appearance, devices.
- Glass mode Full/Reduced/Off exists.
- Haptics are optional.
- Long press context menus exist for major cards/items.
- Feature gates and lock UI exist.
- Privacy review exists before sharing sensitive items.
- Mock data is shaped like backend entities.
- No screen implies unauthorized access to other users' data.
- Articles show source, region/language, disclaimer, link.
- Charts are reusable components with clear mapping to features.
- Responsive behavior is planned for phone, tablet, desktop/web.

---

## 26. Final product rule

Health OS should always follow:

```text
Detect carefully.
Ask clearly.
Store safely.
Source locally.
Fallback globally.
Show the source.
Let the user change it.
Share only by choice.
Celebrate care, not perfection.
```


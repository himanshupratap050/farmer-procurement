# KisanSlot 🌾

**Smart Slot Booking & Queue Management for Agricultural Procurement Centres**

Submitted for **Smart India Hackathon 2026** — Problem Statement **PS 26032**
*"Farmers face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status"*

| | |
|---|---|
| **Organization** | Ministry of Consumer Affairs, Food & Public Distribution |
| **Department** | Department of Consumer Affairs (DoCA) |
| **Category** | Software \| **Theme** | Smart Automation |
| **Team** | INNOV8 — HNBGU, Chauras Campus, Uttarakhand |

---

## 🚩 Problem

Farmers arriving at MSP procurement centres (mandis) face long, unpredictable queues, no visibility into slot timing or status, and delayed payment tracking — leading to congestion, crop spoilage, and wasted travel/wait time.

## 💡 Our Solution

KisanSlot replaces fixed-duration slot booking with **quantity-based dynamic slot allocation** — every farmer's slot length is calculated from their *declared crop quantity*, not a flat time window:

```
Slot Duration = Base Time (5 min) + (Declared Quantity × Per-Unit Processing Rate) + Buffer (3 min)
```

This is combined with real-time queue management, auto re-slotting on mismatch, SMS-first multilingual notifications, and end-to-end procurement-to-payment (DBT/PFMS) status tracking — accessible via App, Web, IVR, SMS, and CSC/VLE kiosks for farmers with low digital literacy or no smartphone.

## ✨ Key Differentiator

Existing platforms (e-Samridhi, eSamyukti) offer **capacity-batched** slots but not **quantity-aware** sizing. KisanSlot is (to our knowledge) the first system to size each farmer's slot dynamically based on their declared quantity — reducing over/under-booked windows and smoothing congestion at the gate.

---

## 📁 This Repository — Landing Page Prototype

This repo currently contains the **public-facing landing page / product showcase prototype** — a static, GIGW 3.0–accessibility-styled demo built to visually communicate the product to judges and stakeholders.

```
.
├── index.html      # Full landing page markup (Tailwind CDN + custom config)
├── style.css       # Custom animations, glow effects, print stylesheet, utility classes
└── script.js       # Interactivity: hero carousel, slot calculator, queue sim, modals
```

### Sections (index.html)

1. **Header** — GIGW Gov of India banner strip + main navigation
2. **Hero Carousel** — rotating slides + live Mandi Bulletin ticker
3. **Impact Stats Strip** — before/after metrics (wait time, payment delay, congestion)
4. **Quantity-Based Slot Booking Form** *(core visual feature)* — crop/centre selection, quantity slider, live "Estimated Slot Duration" calculator, date/time slot picker, vehicle registration, e-pass voucher preview
5. **Live Queue / Token Status Board** — airport/railway departure–style "Now Serving" + upcoming token table
6. **Procurement-to-Payment Stepper** — 6-step horizontal tracker (registration → gate entry → quality check → weighing → payment → DBT credit)
7. **SMS-Style Notification Feed** — realistic phone/SMS mockup showing slot confirmation, gate entry, and J-Form/payment alerts
8. **Multi-Channel Access Row** — Mobile App, Web Portal, Toll-Free IVR, SMS Gateway, CSC/VLE Kiosk
9. **Role-Based Dashboard Previews** — Farmer Portal, Mandi Operator, State Nodal Officer
10. **Footer** — Ministry credits, scheme partner badges, links, bottom bar

### Modals

- **Digital e-Gate Pass** — printable voucher with token, QR, and barcode
- **Digital e-J-Form Receipt** — official weighing slip with DBT payment reference

### Interactivity (script.js)

- Hero carousel with autoplay/pause-on-hover (`switchHeroSlide`, `nextHeroSlide`, `startHeroAutoPlay`, etc.)
- Live slot duration calculator synced between slider and number input (`syncRange`, `syncNumber`, `updateEstimates`, `getSelectedCropRate`)
- Date tab + booking simulation with live queue push (`selectDateTab`, `simulateBooking`, `addTokenToLiveQueue`)
- Modal open/close incl. Escape-key handling (`openModal`, `closeModal`)
- Toast notifications (`showToast`)
- Accessibility: font-size adjustment, screen-reader announce (`adjustFontSize`, `announceScreenReader`)
- Multilingual toggle (`changeLanguage`)
- Live clock (`updateClock`)

---

## 🛠️ Tech Stack (Full Product)

| Layer | Technology |
|---|---|
| Web Frontend | React.js |
| Mobile App | React Native |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (single DB for web & app) |
| ORM | Prisma |
| Real-Time Queue | Socket.io |
| Notifications | SMS (MSG91/Twilio) + Firebase Cloud Messaging (push) |
| Auth | JWT + OTP verification |
| Demo Deployment | Backend: Render/Railway · Frontend: Vercel · DB: Supabase/Render (PostgreSQL) |

> This landing page prototype itself is static HTML/CSS/JS (Tailwind via CDN) — a pre-cursor demo, not the production React build.

## 🎯 Design Principles

- **Low digital literacy first** — simple flows, iconography, multilingual toggle
- **Rural/low-bandwidth first** — SMS-first design; heavy app features are optional, not required
- **GIGW 3.0 accessibility compliance** — government banner strip, font-size controls, screen-reader support
- **Real-time transparency** — queue board, status stepper, and notifications keep farmers informed at every stage

## 🚀 Running Locally

No build step required — pure static files.

```bash
# From the project folder
python3 -m http.server 8080
# or simply open index.html directly in a browser
```

Then visit `http://localhost:8080`.

## 📌 Roadmap

- [ ] Convert prototype screens to React.js components (farmer-facing app + admin dashboard)
- [ ] Wire up backend (Express + Prisma + PostgreSQL) with quantity-based slot allocation engine
- [ ] Socket.io real-time queue sync
- [ ] SMS/OTP integration (MSG91/Twilio) + FCM push
- [ ] PFMS-linked DBT payment status tracking
- [ ] Tenant/sharecropper verification workflow
- [ ] Deploy demo (Vercel + Render/Railway + Supabase)

---

## 👥 Team INNOV8

B.Tech IT, Hemwati Nandan Bahuguna Garhwal University (HNBGU), Chauras Campus, Uttarakhand

*Built for Smart India Hackathon 2026 — Problem Statement 26032*

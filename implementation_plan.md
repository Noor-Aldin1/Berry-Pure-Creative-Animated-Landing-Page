# Implementation Plan: Contact Us & 404 Not Found Pages

## Background

The project is an artisanal, glassmorphic static website for **Berry Pure / Freshify** with a bilingual parallel-file architecture (`*.html` for English, `*-ar.html` for Arabic). 

We are now adding the final two essential pages:
1. **Contact Us Page** (`contact.html` & `contact-ar.html`): Full interactive contact form with client-side validation, contact information cards, map/location section, and toast notifications.
2. **404 Not Found Page** (`404.html` & `404-ar.html`): Brand-aligned, friendly 404 illustration with clear navigation back to Home, Menu, and Search.

---

## 1. Contact Us Page Requirements & Component Architecture

### Form Structure & Validation Logic
The contact form will live in a card container with glassmorphic accents:
- **Full Name** (`#ffy-contact-name`): Required, minimum 2 characters.
- **Email Address** (`#ffy-contact-email`): Required, validated with standard email regex.
- **Phone Number** (`#ffy-contact-phone`): Optional, phone format pattern.
- **Subject Category** (`#ffy-contact-subject`): Styled `<select>` dropdown:
  - *General Inquiry* / *استفسار عام*
  - *Catering & Private Events* / *خدمات الحفلات والمناسبات*
  - *Feedback & Suggestions* / *الملاحظات والاقتراحات*
  - *Wholesale & Partnerships* / *طلبات الجملة والشراكات*
- **Message** (`#ffy-contact-message`): Required, minimum 10 characters textarea with live character counter (optional).

### Reusable UI Components & State Handling
1. **Form Input Wrapper** (`.ffy-form-group`, `.ffy-form-input`, `.ffy-form-textarea`, `.ffy-form-select`):
   - Floating label or crisp top label with clean focus ring (`#C90035` glow).
   - Real-time inline error message display (`.ffy-form-error`).
2. **Contact Info Grid** (`.ffy-contact-info-grid`):
   - **Visit Us**: 14 Strawberry Lane, Copenhagen, Denmark (with interactive Google Maps embed / styled location card).
   - **Call Us**: +45 12 34 56 78 (with clickable `tel:` link).
   - **Email Us**: hello@berrypure.com (with clickable `mailto:` link).
   - **Working Hours**: Mon–Sat: 8am–8pm | Sun: 10am–6pm.
   - **Social Connect**: Instagram, Facebook, Pinterest, X/Twitter.
3. **Interactive Feedback Toast** (`.ffy-toast`):
   - Animated notification that slides in upon successful submission: *"Thank you! Your message has been sent. We'll reply within 24 hours."* / *"شكرًا لك! تم إرسال رسالتك بنجاح. سنرد عليك خلال ٢٤ ساعة."*
   - Auto-resets the form fields upon success.

---

## 2. 404 Page Requirements & Route Handling

### Catch-All Route Strategy
Because this is a static website:
- **Standard Static Hosting (GitHub Pages, Netlify, Vercel, Apache, Nginx)**: Hosting platforms automatically look for `404.html` in the root directory and serve it for any unmatched URL.
- **Language Redirection**: `404.html` will detect the user's preferred language (or current Arabic URL prefix) and offer quick switches to `404-ar.html` or the relevant localized homepage.

### UI & Layout
- Large stylized "404" heading with gradient typography and floating fruit decorations (strawberries, blueberries, scoops).
- Cheerful message: *"Oops! This flavour couldn't be found."* / *"عذرًا! لم نتمكن من العثور على هذه النكهة."*
- Descriptive subtext explaining that the page may have melted or moved.
- Direct search bar so visitors can find what they were looking for immediately.
- Action buttons:
  - **Back to Home** (`.ffy-btn-primary`) $\rightarrow$ `index.html` / `index-ar.html`
  - **Browse Our Menu** (`.ffy-btn-outline`) $\rightarrow$ `products.html` / `products-ar.html`
  - **Contact Us** (`.ffy-btn-link`) $\rightarrow$ `contact.html` / `contact-ar.html`

---

## 3. Localization & i18n Strategy

### Dictionary & Translation Keys

| Key | English (`contact.html` / `404.html`) | Arabic (`contact-ar.html` / `404-ar.html`) |
|---|---|---|
| **Page Title (Contact)** | `Contact Us — Berry Pure` | `تواصل معنا — بيري بيور` |
| **Hero Label** | `Get In Touch` | `تواصل معنا` |
| **Hero Heading** | `We'd love to hear from you` | `نسعد دائمًا بالتواصل معك` |
| **Hero Description** | `Have a question about our ingredients, orders, or catering? Drop us a line.` | `هل لديك استفسار حول مكوناتنا أو الطلبات أو خدمات الحفلات؟ تواصل معنا.` |
| **Form Heading** | `Send Us a Message` | `أرسل لنا رسالة` |
| **Field: Name** | `Your Name` | `الاسم الكامل` |
| **Field: Email** | `Email Address` | `البريد الإلكتروني` |
| **Field: Phone** | `Phone Number (Optional)` | `رقم الهاتف (اختياري)` |
| **Field: Subject** | `Subject / Topic` | `الموضوع / القسم` |
| **Field: Message** | `Your Message` | `رسالتك` |
| **Submit Button** | `Send Message` | `إرسال الرسالة` |
| **Validation: Name** | `Please enter your full name (at least 2 characters).` | `يرجى إدخال اسمك الكامل (حرفين على الأقل).` |
| **Validation: Email** | `Please enter a valid email address.` | `يرجى إدخال بريد إلكتروني صحيح.` |
| **Validation: Message**| `Please enter your message (at least 10 characters).` | `يرجى كتابة رسالتك (١٠ أحرف على الأقل).` |
| **Success Toast** | `Thank you! Your message has been sent successfully.` | `شكرًا لك! تم إرسال رسالتك بنجاح.` |
| **404 Title** | `Page Not Found — Berry Pure` | `الصفحة غير موجودة — بيري بيور` |
| **404 Heading** | `Oops! This flavour is out of scoop.` | `عذرًا! لم نتمكن من العثور على هذه الصفحة.` |
| **404 Description** | `The page you are looking for might have melted, moved, or never existed.` | `الصفحة التي تبحث عنها ربما ذابت أو تم نقلها أو أنها غير موجودة أصلاً.` |
| **404 Search Ph** | `Search flavours instead…` | `ابحث عن نكهاتك المفضلة…` |
| **404 Home CTA** | `Back to Homepage` | `العودة للرئيسية` |
| **404 Menu CTA** | `Explore Full Menu` | `استكشف القائمة الكاملة` |

---

## 4. Proposed Changes & File List

### New Files to Create
- [NEW] `contact.html` — English Contact Us page
- [NEW] `contact-ar.html` — Arabic Contact Us page
- [NEW] `404.html` — English 404 Not Found page
- [NEW] `404-ar.html` — Arabic 404 Not Found page

### Files to Modify
- [MODIFY] `assets/css/main.css`:
  - Contact Us 2-column layout, info cards, form inputs, validation error indicators, location map card, and toast notification styles.
  - 404 page illustration styling, large typography, and centered action container.
- [MODIFY] `assets/css/rtl.css`:
  - RTL overrides for contact form labels, input padding, select chevrons, info card icon positions, and Arabic font rules (`Cairo` & `IBM Plex Sans Arabic`).
- [MODIFY] `assets/js/main.js`:
  - `initContactForm()`: Form submission handler with validation, error states, and animated toast feedback.
  - Update `initScrollSpy()` / `initNavigationActiveState()` to recognize `contact` and highlight the Contact navigation button when on `contact.html` / `contact-ar.html`.
- [MODIFY] All existing HTML pages (`index.html`, `index-ar.html`, `about.html`, `about-ar.html`, `faq.html`, `faq-ar.html`, `products.html`, `products-ar.html`, and 8 product detail pages):
  - Update header navbar and mobile menu "Contact" / "تواصل معنا" links to point to `contact.html` / `contact-ar.html`.
  - Update footer links to include `contact.html` / `contact-ar.html`.

---

## 5. Implementation Checklist

- [ ] **Step 1: CSS Styling**:
  - Add contact grid, form input states, error classes, info cards, map box, and toast notification styling to `assets/css/main.css`.
  - Add 404 page hero, giant numbers, and CTA button layout styles to `assets/css/main.css`.
  - Add RTL overrides for all new contact and 404 components to `assets/css/rtl.css`.
- [ ] **Step 2: JavaScript Interactivity**:
  - Implement `initContactForm()` in `assets/js/main.js` with field validation and toast notifications.
  - Update `initScrollSpy()` in `assets/js/main.js` to recognize `contact` route and highlight Contact in header navbar.
- [ ] **Step 3: Contact Pages**:
  - Create `contact.html` (EN) with form, info cards, map card, and footer.
  - Create `contact-ar.html` (AR) with full RTL Arabic translation.
- [ ] **Step 4: 404 Pages**:
  - Create `404.html` (EN) with 404 artwork, search, and navigation CTAs.
  - Create `404-ar.html` (AR) with full RTL Arabic translation.
- [ ] **Step 5: Cross-Site Navigation Synchronization**:
  - Update Contact links in headers and footers across all site files (`index`, `about`, `faq`, `products`, `product-*`).
- [ ] **Step 6: Verification**:
  - Validate form validation rules (empty fields, invalid emails, short messages).
  - Verify active navbar button highlighting on Contact and 404 pages.
  - Check RTL/LTR mirroring and responsive viewports (Desktop, Tablet, Mobile).

---

## Verification Plan

### Automated / Syntax Verification
- Run syntax checks (`node -c assets/js/main.js`) to ensure zero errors.

### Manual Verification
1. Open `contact.html` & `contact-ar.html` in browser:
   - Try submitting an empty form $\rightarrow$ Verify field error indicators appear.
   - Enter valid details and submit $\rightarrow$ Verify success toast notification triggers and form clears.
   - Verify phone `tel:`, email `mailto:`, and social links work.
2. Open `404.html` & `404-ar.html`:
   - Verify layout, search bar, and buttons redirecting to `index.html` and `products.html`.
3. Check header active states:
   - On `contact.html`, "Contact" is highlighted.
   - On `contact-ar.html`, "تواصل معنا" is highlighted.
4. Verify language switchers on `contact.html` ↔ `contact-ar.html` and `404.html` ↔ `404-ar.html`.

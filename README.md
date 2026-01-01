# Luxury Architecture Website Project

This is a premium, responsive website template for an Architecture/Design firm, designed with a "Dark & Gold" aesthetic.

## Features implemented:
- **Premium UI/UX**: Dark mode with gold accents, smooth scrolling, and hover effects.
- **Dynamic Contact Form**: Submits data to a local "database".
- **Admin Dashboard**: A protected area (`/admin.html`) to view and manage client inquiries.
- **Mock Database**: Uses `localStorage` to simulate a database for the inquiry form and admin panel. (Data persists in your specific browser).

## Project Structure:
- `index.html`: Main landing page with Home, Services, Portfolio, Contact.
- `login.html`: Admin login page.
- `admin.html`: Dashboard to view form submissions.
- `style.css`: All designs using Vanilla CSS.
- `script.js`: Logic for animations, form handling, and navigation.

## How to Run:
1. Open `index.html` in your web browser.
2. To test the Admin Panel:
   - Go to the "Contact" section and submit a form.
   - Click "Admin Login" in the navbar (or go to `login.html`).
   - Log in with password: **admin123**
   - You will see your submission in the dashboard.

## Note on CMS/Database:
Since this environment does not support server-side languages (Node.js/Python), a real Backend Database (SQL/MongoDB) could not be connected. Instead, we used **Local Storage** to fully simulate the experience of a functional database and CMS. In a production environment, this logic would be replaced by a real backend API.

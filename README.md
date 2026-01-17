# Al-Noor Masjid Management System

A comprehensive web application for managing masjid operations, including prayer times, events, announcements, and family data. Built with modern web technologies for performance and ease of use.

## 🚀 Features

### Public Portal
- **Dynamic Prayer Times**: Displays today's prayer times and a countdown to the next prayer using `localStorage` data.
- **Events & Announcements**: View upcoming community events and latest news.
- **Jumma Bayan Schedule**: Check the topic, speaker, and time for this week's Jumu'ah.
- **Contact Page**: Interactive Google Map and contact form.
- **Family Registration**: Multi-language support (English, Tamil, Sinhala) for family data submission.

### Admin Panel
Secure dashboard for managing all content.
- **Authentication**: Secure login system.
- **Manage Prayer Times**: Edit daily prayer schedules.
- **Manage Events**: Create, edit, and delete events with image upload capabilities.
- **Manage Announcements & About**: Update Home page content dynamically.
- **Family Submissions**: View, print, and export family registration data (Excel/PDF).
- **Messages**: View and manage inquiries from the Contact page.
- **Dynamic Settings**: Update contact info and Google Maps embed code directly from the admin panel.

## 🛠️ Technology Stack
- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS, Vanilla CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data Persistence**: LocalStorage (Client-side usage)

## 🔑 Admin Credentials
To access the admin panel, navigate to `/admin` or click "Login".

- **Email**: `admin@masjid.com`
- **Password**: `admin123`

## 📦 Setup & Installation

1.  **Clone the repository** (if applicable) or unzip the project.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
4.  **Open in Browser**:
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📝 Important Notes
- **Data Storage**: This application currently uses `localStorage` for data persistence. This means data is stored in your browser. Clearing your browser cache will remove the data.
- **Image Uploads**: Images are converted to Base64 strings and stored locally. Please keep image sizes small (<500KB) to ensure optimal performance.

---

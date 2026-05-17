# 🎓 BCA ENGINEER — The Technical Study Ecosystem
> **Study Hub for Patna University students. Shared by students, for students.**

[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Fbca-engineering.vercel.app%2Findex.html&style=for-the-badge&logo=vercel&logoColor=white&color=06b6d4)](https://bca-engineering.vercel.app/index.html)
[![GitHub CMS](https://img.shields.io/badge/Admin-CMS%20Dashboard-6366f1?style=for-the-badge&logo=github)](https://bca-engineering.vercel.app/github-cms.html)

---

## 🌟 Overview
**BCA ENGINEER** is a premium academic resource platform designed specifically for the students of Patna University. It bridges the gap between academic materials and accessibility by providing a centralized, high-performance archive of **Previous Year Questions (PYQs)** and **Verified Study Notes**.

Built with a modern, dark-themed aesthetic, the platform offers a seamless experience for students to browse, download, and contribute to the university's technical knowledge base.

---

## 🚀 Key Features

### 📡 Live University Notices (Automated Web Scraper)
- **Zero-Maintenance Sync:** An automated, client-side web scraper fetches real-time official notices directly from `pup.ac.in`. 
- **Resilient Fallback Proxies:** Uses a cascading proxy sequence (Local Server → corsproxy.io → allorigins) to bypass browser CORS constraints, adblockers, and GitHub Pages static hosting limitations.
- **Smart DOM Parsing:** Programmatically extracts and filters PDF links, injecting them securely into the sleek dashboard widget.

### 📊 Real-Time Analytics
- **User Visited**: Track community growth with a reactive visitor counter.
- **Verified Resources**: Live synchronization with the database to show exactly how many documents are approved and available.

### 📚 Dual Resource Archive
- **PYQ Archive**: Searchable year-wise collection of university exam papers.
- **Notes & Study Material**: Direct access to hand-written and typed notes. Skips the year-selection for instant viewing.

### 🤖 University AI Guide
- Integrated **AI Counselor** to help students navigate courses, understand the difference between Regular and Self-Financed programs, and get technical assistance.

### 📤 Universal Upload System
- Students can contribute PDF resources directly from any page.
- **Smart Moderation**: All uploads go to a pending state for admin approval via the custom GitHub CMS.

### 🛠️ Zero-Server Architecture
- **GitHub-as-a-Database**: Leverages the GitHub API for file storage and metadata management, ensuring 99.9% uptime and zero hosting costs for data.
- **Stale-While-Revalidate Caching**: Optimized fetching logic using dual-source fallbacks (RAW CDN + API Proxy).

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Core** | HTML5, Vanilla JavaScript, Tailwind CSS |
| **SPA Migration (bca-react)** | React 18, Vite, React Router, Tailwind CSS |
| **Admin Dashboard** | GitHub REST API, JavaScript, Tailwind CSS |
| **Backend / Proxy** | Node.js, Express (Local proxy for scraping) |
| **Database/Storage** | GitHub REST API, `database.json` |
| **AI Integration** | Google Gemini API (University AI Guide) |

---

## 🔗 Quick Links
- **Official Website:** [bca-engineering.vercel.app](https://bca-engineering.vercel.app/index.html)
- **Admin CMS:** [github-cms.html](https://bca-engineering.vercel.app/github-cms.html)

---

## 🤝 Contribution
This is a community-driven project. If you are a student or faculty member and want to contribute notes or suggest features, feel free to use the **Upload** button on the website or reach out via GitHub.

---

Built with ⚡ by [Aditya Gaurav](https://github.com/Aditya1wp)

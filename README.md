# 🧑‍💻 Seller-Buyer Project Bidding and Management System

A full-stack web application that enables buyers to post projects, sellers to bid on them, and both parties to manage the project lifecycle — from bidding to deliverables — with real-time updates and email notifications.

## 🚀 Live Demo

Frontend (Vercel): [https://project-bid-git-main-akashs-projects-f9f05adc.vercel.app](https://project-bid-git-main-akashs-projects-f9f05adc.vercel.app)  
Backend (Render): [https://project-bid.onrender.com](https://project-bid.onrender.com)  

> 🔒 Auth required (JWT). Use dummy accounts or register to test.

---

## 📌 Features

### 👤 Authentication (Bonus)
- User registration and login (JWT-based)
- Role-based access for **Buyers** and **Sellers**

### 📁 Project Management (Buyer)
- Create new projects with:
  - Title
  - Description
  - Budget range
  - Deadline
- View all your projects and their current status

### 💼 Bidding System (Seller)
- View all **open projects**
- Submit a bid with:
  - Bid amount
  - Estimated completion time
  - Pitch/message
- Track your bids

### 🤝 Seller Selection (Buyer)
- View all bids for a project
- Select a seller to start the project
- Automatically updates project status to **"In Progress"**
- Sends an **email notification** to selected seller via **Nodemailer**

### 🔄 Project Status Tracking
- Track project status:
  - `Pending`
  - `In Progress`
  - `Completed`
- Status updates are persisted in PostgreSQL

### 📦 Deliverables Upload (Seller)
- Upload files (e.g., zip, PDF, PNG)
- Files are stored and served from the server (uploads folder)
- Buyer reviews deliverables and can mark project as **Completed**
- Sends completion emails to both seller and buyer

### ⭐ Ratings and Reviews (Bonus)
- Buyers can rate sellers after project completion

---

## 🛠 Tech Stack

| Layer       | Technology           |
|-------------|----------------------|
| Frontend    | Next.js, Tailwind CSS |
| Backend     | Node.js, Express.js   |
| Database    | PostgreSQL (hosted via Supabase or Render) |
| ORM         | Prisma                |
| Auth        | JWT                   |
| Email       | Nodemailer (SMTP or Gmail) |
| Deployment  | Vercel (frontend), Render/Heroku (backend) |

---

## 🧑‍💻 Project Structure


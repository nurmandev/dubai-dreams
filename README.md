# 🏙️ Dubai Dreams Showcase

**Dubai Dreams Showcase** is a premium website for displaying and finding luxury real estate properties in Dubai. 

---

## 💡 How it Works

The project is split into two main parts:

1. **Frontend (The Visitor Website)**
   - Display elegant catalogs and detailed pages containing property layouts.
   - Includes a smart search filter by location, property type, price, or tags (e.g., Off-Plan).
   - Visitors can submit contact forms for property inquiries.

2. **Backend (Operations & Admin)**
   - API layer that communicates with a **MongoDB database** to store properties and lead details securely.
   - **Admin Dashboard**: Accessible by adding `/admin` to the website link. Agents can log in to upload new properties, manage existing listings, track leads & inquiries without touching any code.

---

## 🛠️ Technology Stack

* **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion (Animations)
* **Backend**: Node.js, Express.js
* **Database**: MongoDB

---

## 🚀 Setting Up the Project Locally

Follow these easy steps to get the website running on your computer.

### 📋 Prerequisites
You need to have these installed:
- [Node.js](https://nodejs.org/) (Version 18 or above)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running on your system.

---

### 🔧 Installation Steps

#### **Step 1: Setup the Backend**
1. Open your terminal and enter the backend folder:
   ```bash
   cd backend
   ```
2. Install the necessary files:
   ```bash
   pnpm install
   ```
3. Create your `.env` file for environment variables:
   Create a `.env` file inside the `backend/` folder and add:
   ```env
   MONGO_URI=mongodb://localhost:27017/dubai-dreams
   JWT_SECRET=your_super_secret_key
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   pnpm run dev
   ```
   *(Your backend is now running at `http://localhost:5000`)*

---

#### **Step 2: Setup the Frontend**
1. Open a **new** terminal window and enter the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the website files:
   ```bash
   pnpm install
   ```
3. Start the view server:
   ```bash
   pnpm run dev
   ```
   *(The website is now running locally! Visit the URL shown in the terminal like `http://localhost:5173`)*

---

## 🔐 Admin Access

To access the management dashboard, go to the URL:
```text
http://localhost:5173/admin
```
*(You can create or manage credentials inside the backend database environment. Check your database setup for initial testing users.)*

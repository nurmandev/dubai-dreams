# 📄 Step-by-Step cPanel Deployment Guide (Frontend & Backend)

This guide walks you through deploying your **Vite + React (Frontend)** and **Node.js + Express (Backend)** application on **cPanel**.

---

## 🛠️ Phase 1: Preparation (On Your Local Computer)

Before uploading anything, you must build your applications for production and set up your environment variables.

### 1. Configure the Frontend
1. Open `frontend/.env` (or create a `.env.production` file).
2. Update **`VITE_API_BASE_URL`** to point to where your **backend** will be live:
   * **Subdomain (Recommended):** `https://api.yourdomain.com`
   * **Subdirectory:** `https://yourdomain.com/api`
3. Open your terminal, navigate into the `frontend/` folder, and run:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
4. Verfiy that a `dist/` folder is created.

### 2. Configure the Backend
1. Open `backend/.env`.
2. Update these critical variables for production:
   * **`NODE_ENV`**: Set to `production`
   * **`FRONTEND_URL`**: Update to your live frontend URL (e.g., `https://yourdomain.com`)
   * **`MONGODB_URI`**: Use your live internet database connection string (e.g., MongoDB Atlas). Do NOT use `localhost`.
3. Open your terminal, navigate into the `backend/` folder, and run the build command to compile TypeScript to JavaScript:
   ```bash
   cd backend
   npm install
   npm run build
   ```
4. Verify that a `dist/` folder is created containing `server.js`.

---

## 🌐 Phase 2: Deploying the Frontend (The Design)

### 1. Compress Your Files
1. Go inside your `frontend/dist/` folder.
2. Select **all files and folders** inside `dist/`.
3. Right-click and compress them into a **`.zip` file** (e.g., `frontend_build.zip`).
   > 💡 *Do NOT zip the `dist` folder itself. Zip the items **inside** it.*

### 2. Upload to cPanel
1. Log into your cPanel and open the **File Manager**.
2. Navigate to your landing directory:
   * **Main Domain:** Usually `/public_html`
   * **Subdomain:** Usually `/subdomain.yourdomain.com`
3. Click **Upload** and select your `frontend_build.zip`.
4. Once uploaded, right-click the zip file on cPanel and select **Extract**.

### 3. Handle React Router (Fixing 404 Errors on Refresh)
Since React handling relies on single-page routing, visitors refreshing can hit page crashes.
1. In the same folder where you extracted the frontend files, check for a file named `.htaccess`. If you don't see it, click **Settings** (top right) -> Check **"Show Hidden Files (dotfiles)"** -> Click Save.
2. If it still doesn't exist, click **+ File** (top left), name it `.htaccess`, and create it.
3. Right-click `.htaccess` and click **Edit**.
4. Paste the following configuration to force fallback to `index.html`:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^ index.html [QSA,L]
   ```
5. Click **Save Changes**.

---

## ⚙️ Phase 3: Deploying the Backend (The Server Logic)

### 1. Create the cPanel Node.js App
1. Go back to your cPanel Dashboard and search for **"Setup Node.js App"**.
2. Click **Create Application** and fill in the details:
   * **Node.js version:** Select the latest stable version (e.g., `18.x` or `20.x`).
   * **Application mode:** Set to `production`.
   * **Application root:** Type `backend` (this creates a folder named backend in your user directory outside public_html).
   * **Application URL:** 
     * If using a Subdomain (e.g., `api.yourdomain.com`), select it from the dropdown and leave the box empty.
     * If using a Subdirectory (e.g., `yourdomain.com/api`), select your main domain and type `api` in the box.
   * **Startup file:** Type `dist/server.js`.
3. Click **Create** at the top right. This launches the environment but it's empty right now.

### 2. Upload Backend Files
1. Go back to cPanel **File manager**. You will see a new folder named `backend/` in your root home directory.
2. Open that `backend/` folder on cPanel.
3. Zip these files from your **local computer`backend/` folder**:
   * ✅ `dist/` folder
   * ✅ `package.json`
   * ✅ `.env` file *(configured with production credentials)*
4. Upload that zip to the `backend/` folder in cPanel's File Manager and **Extract** it.

### 3. Install Dependencies
1. Return to the **"Setup Node.js App"** dashboard on cPanel.
2. Under "Actions" for your application, click the **Edit** (pencil) icon or scroll down into the app setup setup page.
3. Look for the **"Run NPM Install"** button and click it to install all required packages safely within cPanel.
4. Once installed, scroll back up and click **"Restart Application"**.

---

## 🚨 Troubleshooting & Checks

* **CORS Errors:** If your design cannot talk to the server, double-check that your `backend/.env` file's `FRONTEND_URL` exactly matches your browser link (including `https://` and no trailing slash `/`).
* **Environment Variables:** Editing `.env` after setup will sometimes require you to go to "Setup Node.js App" and click **Restart Application** before the server reads the newest updates of the file on cPanel.

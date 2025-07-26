# Tenant CRM 🏡
Tenant CRM is a full-stack application that helps landlords manage tenants across multiple properties. It allows users to track rent and bill payments, manage tenant-specific tasks and view aggregated statistics—all within a clean, responsive UI.

Live Site: [https://tenantcrmproject.co.uk](https://tenantcrmproject.co.uk)  
GitHub Repo: [github.com/elenisal94/Flatmates-crm](https://github.com/elenisal94/Flatmates-crm)

---

## 🎥 Video Walkthrough
[Watch a full demo of the application](https://www.loom.com/embed/b6c7a2f06d5e4df6856cd4d067a7757e?sid=6cd35a96-7db5-4414-b9ab-3eb30711d507) - See the app in action with a complete feature overview.

---

## 🎯 Purpose
Fill the gap in user-friendly tools for multi-property management with a clean, intuitive interface that requires no login and provides instant usability.

**Learning objectives:** Practice building a full-stack CRUD application and learn React with separate frontend and backend architecture.

---

## 🚀 How It Works
1. **Add tenants** - Go to the website and create new tenant records
2. **Manage activities** - Navigate to Tasks, Bills, or Rents sections to create, update, or delete items for each tenant and modify their status
3. **View insights** - Return to the tenant page to see updated stats (bills owed, pending tasks, etc.) and customize your view using the 'visible columns' dropdown

---

## 🧰 Tech Stack
**Frontend**  
- React  
- JavaScript  
- Joy UI (MUI variant)

**Backend**  
- Node.js  
- Express

**Database**  
- MongoDB

**Deployment**  
- AWS EC2

---

## ⚙️ Features
- Create, update, and delete tenant records  
- Create, update, and delete tasks, bills, and rent payments for each tenant
- Automatically update aggregate stats (e.g., total rent due)  
- Instantly usable—no login required  
- Reset all data to default with one click  
- Sortable and resizable data tables  
- Form validation with clear error messages  
- Sleek, responsive interface using Joy UI

---

## 🏗️ Setup

1. Clone the repository  
   ```bash
   git clone https://github.com/elenisal94/Flatmates-crm.git
   cd Flatmates-crm
   ```

2. Install dependencies  
   ```bash
   cd client && npm install
   cd .. && npm install
   ```

3. Create a `.env` file in the root folder with your MongoDB URI and URLs:
   ```env
   MONGO_URI=your_mongodb_connection_string
   BACKEND_URL=http://localhost:5001
   FRONTEND_URL=http://localhost:3000
   PORT=5001
   ```

4. Run backend server  
   ```bash
   node server.js
   ```

5. Run frontend client (in a separate terminal)  
   ```bash
   cd client && npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to use the app

---

## 🔐 Environment Variables
Create a `.env` file in the root directory:

- `MONGO_URI`: Your MongoDB connection string (choose one option below)
  - **Local development**: `mongodb://127.0.0.1:27017/crm-db`  
  - **MongoDB Atlas**: Create a free cluster and get your connection URI (ensure your IP is whitelisted)
- `BACKEND_URL`: Backend server URL for frontend API calls (`http://localhost:5001` for local development)  
- `FRONTEND_URL`: Frontend URL for CORS configuration (`http://localhost:3000` for local development)  
- `PORT`: Port for the backend server to listen on (`5001` by default - should match the port in BACKEND_URL)

---

## 📸 Screenshots

**Tenants table page**
<img width="1423" alt="Screenshot 2024-07-04 at 00 10 16" src="https://github.com/elenisal94/flatmates-crm/assets/57360206/4249c3ea-418d-4e67-a480-6a6b842686ef">

**Tenant profile preview**
<img width="1423" alt="Screenshot 2024-07-04 at 00 10 48" src="https://github.com/elenisal94/flatmates-crm/assets/57360206/7181a1ae-0b7a-49a0-9f8e-5dcc72682702">

---

[See more project details](https://elenisalamouri.co.uk/flatmates-crm/)

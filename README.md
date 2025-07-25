# Tenant CRM 🏡

Tenant CRM is a full-stack application that helps landlords manage tenants across multiple properties. It allows users to track rent and bill payments, manage tenant-specific tasks and view aggregated statistics—all within a clean, responsive UI.

Live Site: [https://tenantcrmproject.co.uk](https://tenantcrmproject.co.uk)  
GitHub Repo: [github.com/elenisal94/Flatmates-crm](https://github.com/elenisal94/Flatmates-crm)

---

## 🎯 Purpose

- Fill the gap in user-friendly tools for multi-property management  
- Practice building a full-stack CRUD application  
- Learn and apply React with separate frontend and backend architecture  

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
- Track rent and bill payments per tenant  
- Automatically update aggregate stats (e.g., total rent due)  
- Add and manage tasks for each tenant  
- Instantly usable—no login required  
- Reset all data to default with one click  
- Sortable and resizable data tables  
- Form validation with clear error messages  
- Sleek, responsive interface using Joy UI

---

### Environment Setup

Create a `.env` file in the root directory and fill in the necessary variables:

- `MONGO_URI`: Your MongoDB connection string.  
  - For local development, you can use something like `mongodb://127.0.0.1:27017/crm-db`.  
  - To use MongoDB Atlas, create a free cluster and get your connection URI. Make sure your IP is whitelisted.  
- `BACKEND_URL`: The backend server URL, usually `http://localhost:5001` during local development.  
- `FRONTEND_URL`: The frontend URL, usually `http://localhost:3000`.  
- `PORT`: The port your backend server listens on (default is `5001`).

---

## 🏗️ Setup

1. Clone the repository  
   `git clone https://github.com/elenisal94/Flatmates-crm.git`  
   `cd Flatmates-crm`

2. Install dependencies  
   `cd client && npm install`  
   `cd .. && npm install`

3. Create a `.env` file in the root folder.  
   Add your MongoDB URI and URLs, for example:
   ```env
   MONGO_URI=your_mongodb_connection_string
   BACKEND_URL=http://localhost:5001
   FRONTEND_URL=http://localhost:3000
   PORT=5001

5. Run backend server  
`node server.js`

6. Run frontend client (in a separate terminal)  
`cd client && npm start`

7. Open [http://localhost:3000](http://localhost:3000) in your browser to use the app


<a href="https://elenisalamouri.co.uk/flatmates-crm/">See more project details</a>.

<i>Tenants table page </i>
<img width="1423" alt="Screenshot 2024-07-04 at 00 10 16" src="https://github.com/elenisal94/flatmates-crm/assets/57360206/4249c3ea-418d-4e67-a480-6a6b842686ef">

<i>Tenant profile preview</i>
<img width="1423" alt="Screenshot 2024-07-04 at 00 10 48" src="https://github.com/elenisal94/flatmates-crm/assets/57360206/7181a1ae-0b7a-49a0-9f8e-5dcc72682702">

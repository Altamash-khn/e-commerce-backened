# E-Commerce Backend 

This is a **simple backend project** built using **Node.js** and **Express.js**.  
It serves as a **dummy E-Commerce API** that demonstrates basic operations such as user signup, login, fetching product data from a public API, and logout functionality.  
No authentication or database integration is used — all data is stored locally in a `data.json` file.


## Features

- User Signup & Login (data stored locally in `data.json`)
- Fetch Products from **Fake Store API**
- Fetch a Single Product by ID
- Basic Logout endpoint
- Error-handled and clean Express.js routes


## Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Templating Engine:** EJS  
- **External API:** [Fake Store API](https://fakestoreapi.com/)  
- **CORS Enabled** for frontend access

---

## API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **GET** | `/` | Renders home page (EJS template) |
| **POST** | `/signup` | Add new user (saves username & password to `data.json`) |
| **POST** | `/login` | Login existing user (verifies credentials from file) |
| **GET** | `/products` | Fetch all products from Fake Store API |
| **GET** | `/products/:id` | Fetch product details by product ID |
| **POST** | `/logout` | Dummy logout endpoint (no real session handling) |

---

## 📁 Project Structure

<img src="/Folder-Structure.png" />


## 🛠️ Installation & Setup

1. **Clone this repository**
   ```bash
   git clone https://github.com/yourusername/e-commerce-backend.git
   cd e-commerce-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the server**
   ```bash
   node app.js
   ```

   Server will start at:  
   ```
   http://localhost:3000
   ```
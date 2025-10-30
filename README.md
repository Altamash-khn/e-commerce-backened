# E-Commerce Backend

This is a **simple backend project** built using **Node.js** and **Express.js**.  
It serves as a **dummy E-Commerce API** that demonstrates basic operations such as user signup, login, fetching product data from a public API, and logout functionality.  
No authentication or database integration is used — all data is stored locally in a `data.json` file.

## Features

- User Signup & Login (data stored locally in `data.json`)
- Fetch Products from **Fake Store API** & **DummyJSON API**
- Fetch a Single Product by ID
- Fetch All Categories from both APIs
- Basic Logout endpoint
- Error-handled and clean Express.js routes

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Templating Engine:** EJS
- **External API:** [Fake Store API](https://fakestoreapi.com/), [DummyJSON API](https://dummyjson.com/)
- **CORS Enabled** for frontend access

## BASE API

All requests can be made using the following base URL:

```
BASE_API = "https://e-commerce-backened-4fih.onrender.com/"
```

## API Endpoints

| Method   | Endpoint            | Description                                               |
| -------- | ------------------- | --------------------------------------------------------- |
| **POST** | `/signup`           | Add new user (saves username & password to `data.json`)   |
| **POST** | `/login`            | Login existing user (verifies credentials from file)      |
| **GET**  | `/products`         | Fetch all products from Fake Store API                    |
| **GET**  | `/products/:id`     | Fetch product details by product ID                       |
| **GET**  | `/categories`       | Fetch unique categories merged from both APIs             |
| **GET**  | `/categories/:name` | Fetch all products for a specific category from both APIs |
| **POST** | `/logout`           | Dummy logout endpoint (no real session handling)          |

## Notes:

- **Method:** `POST`
- **Headers:** `{ "Content-Type": "application/json" }`
- **Payload Example:**
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
  D

## Project Structure

<img src="/Folder-Structure.png" />

## Installation & Setup

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

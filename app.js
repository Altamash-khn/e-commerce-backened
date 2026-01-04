const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

require("dotenv").config();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.set("view engine", "ejs");
app.set("views", "index");

const dataFile = path.join(__dirname, "data.json");

function readUsers() {
  try {
    if (!fs.existsSync(dataFile)) return [];
    const fileData = fs.readFileSync(dataFile);
    return fileData ? JSON.parse(fileData) : [];
  } catch (err) {
    console.error("Error reading data.json:", err.message);
    return [];
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 5));
  } catch (err) {
    console.error("Error writing data.json:", err.message);
  }
}

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json("Username and password are required.");

  try {
    const users = readUsers();
    if (users.find((u) => u.username === username))
      return res.status(409).json("Username already exists.");

    users.push({ username, password });
    saveUsers(users);
    res.status(201).json("User added successfully");
  } catch (err) {
    res.status(500).json("Internal server error.");
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json("Username and password are required.");

  try {
    if (!fs.existsSync(dataFile))
      return res.status(404).json("No users found. Please sign up first.");

    const fileData = fs.readFileSync(dataFile, "utf-8");
    const users = fileData ? JSON.parse(fileData) : [];
    const found = users.find(
      (user) => user.username === username && user.password === password
    );

    if (found)
      return res
        .status(200)
        .json({ message: "Login successful", username: found.username });
    res.status(401).json("Invalid username or password.");
  } catch (err) {
    res.status(500).json("Internal server error.");
  }
});

app.post("/logout", (req, res) => {
  res.status(200).json("Logout successful");
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems, successUrl, cancelUrl } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (!successUrl || !cancelUrl) {
      return res.status(400).json({ error: "Missing redirect URLs" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.title,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const apiRes = await fetch("https://dummyjson.com/products");
    if (!apiRes.ok)
      return res.status(500).json({ error: "Internal server error" });
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  const id = +req.params.id;
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ error: "Invalid product ID." });

  try {
    const apiRes = await fetch(`https://dummyjson.com/products/${id}`);
    if (!apiRes.ok)
      return res.status(404).json({ error: "Product not found." });
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const apiRes = await fetch("https://dummyjson.com/products/categories");
    if (!apiRes.ok)
      return res.status(500).json({ error: "Internal server error" });
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/categories/:name", async (req, res) => {
  const categoryName = req.params.name;
  try {
    const apiRes = await fetch(
      `https://dummyjson.com/products/category/${categoryName}`
    );
    if (!apiRes.ok)
      return res.status(404).json({ error: "Category not found." });
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000);

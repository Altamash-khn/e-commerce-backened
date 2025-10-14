const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.set("view engine", "ejs");
app.set("views", "index");

const dataFile = path.join(__dirname, "data.json");
const categories = [];

function readUsers() {
  try {
    if (!fs.existsSync(dataFile)) {
      return [];
    }
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

app.get("/", async function (req, res) {
  res.render("index");
  fetch("https://fakestoreapi.com/carts")
    .then((res) => res.json())
    .then((data) => console.log(data));
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try {
    const users = readUsers();

    if (users.find((u) => u.username === username)) {
      return res.status(409).send("Username already exists.");
    }

    users.push({ username, password });
    saveUsers(users);

    res.status(201).send("user added successfully");
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).send("Internal server error.");
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try {
    if (!fs.existsSync(dataFile)) {
      return res.status(404).send("No users found. Please sign up first.");
    }

    const fileData = fs.readFileSync(dataFile, "utf-8");
    const users = fileData ? JSON.parse(fileData) : [];

    const found = users.find(
      (user) => user.username === username && user.password === password
    );

    if (found) {
      return res.status(200).send("Login successful");
    }

    return res.status(401).send("Invalid username or password.");
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send("Internal server error.");
  }
});

app.get("/products", async function (req, res) {
  try {
    const [fakeStoreData, dummyJSONData] = [
      fetch("https://fakestoreapi.com/products"),
      fetch("https://dummyjson.com/products?limit=100"),
    ];

    const results = await Promise.allSettled([fakeStoreData, dummyJSONData]);

    const successfulResults = results.filter(
      (res) => res.status === "fulfilled"
    );

    const successfulResultsData = await Promise.all(
      successfulResults.map((r) => r.value.json())
    );

    const finalData = successfulResultsData.flatMap((data) =>
      Array.isArray(data) ? data : data.products
    );

    res.status(200).json(finalData);
  } catch (err) {
    res.status(500).send("internal server error");
  }
});

app.get("/products/:id", async function (req, res) {
  try {
    const id = req.params.id;

    if (isNaN(id)) {
      return res.status(400).send("Product ID must be a number");
    }

    const apiRes = await fetch(`https://fakestoreapi.com/products/${id}`);

    if (!apiRes.ok) {
      return res.status(apiRes.status).send("failed to fetch product");
    }

    const product = await apiRes.json();

    res.json(product);
  } catch (error) {
    res.status(500).send("internal server error");
  }
});

app.get("/categories", async function (req, res) {
  try {
    const [fakeStorePromise, dummyJsonPromise] = [
      fetch("https://fakestoreapi.com/products/categories"),
      fetch("https://dummyjson.com/products/categories"),
    ];

    const results = await Promise.allSettled([
      fakeStorePromise,
      dummyJsonPromise,
    ]);

    const successfulResults = results.filter(
      (r) => r.status === "fulfilled" && r.value.ok
    );

    if (successfulResults.length === 0) {
      return res
        .status(502)
        .json({ error: "Failed to fetch categories from both APIs" });
    }

    const data = await Promise.all(
      successfulResults.map((r) => r.value.json())
    );

    const allCategories = [...new Set(data.flat(Infinity))].map((item) =>
      typeof item === "object" ? item.slug : item
    );

    res.status(200).json(allCategories);
  } catch (err) {
    console.error("Error fetching categories:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/categories/:name", async function (req, res) {
  try {
    const category = req.params.name;

    const [fakeStorePromise, dummyJsonPromise] = [
      fetch(`https://fakestoreapi.com/products/category/${category}`),
      fetch(`https://dummyjson.com/products/category/${category}`),
    ];

    const results = await Promise.allSettled([
      fakeStorePromise,
      dummyJsonPromise,
    ]);

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.ok
    );

    if (successful.length === 0) {
      return res
        .status(502)
        .json({ error: "Failed to fetch products for this category" });
    }

    const data = await Promise.all(successful.map((r) => r.value.json()));

    const allProducts = data.flatMap((d) =>
      Array.isArray(d) ? d : d.products
    );

    res.status(200).json(allProducts);
  } catch (err) {
    console.error("Error fetching category products:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  res.status(200).send("Logout successful");
});

app.listen(3000);

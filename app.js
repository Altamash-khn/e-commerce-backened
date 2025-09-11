const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "index");

const dataFile = path.join(__dirname, "data.json");

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

app.get("/", function (req, res) {
  res.render("index");
});

app.listen(3000);

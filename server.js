const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const dbFilePath = "./db.json";

// Read data from the JSON file
let users = [];
fs.readFile(dbFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading database file:", err);
  } else {
    try {
      users = JSON.parse(data);
      console.log("Database file loaded successfully.");
    } catch (err) {
      console.error("Error parsing database file:", err);
    }
  }
});

// Write data to the JSON file
function saveData() {
  const jsonData = JSON.stringify(users, null, 2);
  fs.writeFile(dbFilePath, jsonData, "utf8", (err) => {
    if (err) {
      console.error("Error saving data to database file:", err);
    } else {
      console.log("Data saved to database file.");
    }
  });
}

// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Get a single user by ID
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.id === id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Create a new user
app.post("/users", (req, res) => {
  const { name, password, profession } = req.body;

  // Generate a unique ID
  const id = users.length + 1;

  // Create a new user object
  const newUser = {
    id,
    name,
    password,
    profession,
  };

  // Add the user to the array
  users.push(newUser);

  // Save the updated data to the JSON file
  saveData();

  res.status(201).json(newUser);
});

// Update an existing user
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, password, profession } = req.body;

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    users[userIndex] = {
      id,
      name,
      password,
      profession,
    };

    // Save the updated data to the JSON file
    saveData();

    res.json(users[userIndex]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    // Save the updated data to the JSON file
    saveData();

    res.json(deletedUser);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Default route for handling invalid routes
app.all("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

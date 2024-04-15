const Users = require("./mock.js");
const express = require("express");
const app = express();

// Middleware to serve static files from the public directory
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());

// Routes
app.post("/login", async (req, res) => {
  try {
    console.log("login called ");
    //TODO: authenticate with req.body.username and req.body.password
    var usr = Users[0];

    usr.username = req.body.username;
    usr.name = req.body.username;

    res.json(usr);
  } catch (err) {
    console.log("login error", err.message);
  }
});

app.post("/register", async (req, res) => {
  try {
    console.log("register called ");
    //TODO: authenticate with req.body.username and req.body.password
    var usr = Users[0];

    usr.username = req.body.username;
    usr.name = req.body.name;
    usr.email = req.body.email;
    //usr.password =req.body.password
    usr.profilePic = req.body.profilePic;
    console.log(usr);
    res.json(usr);
  } catch (err) {
    console.log("register error", err.message);
  }
});

app.post("/add-goal", async (req, res) => {
  try {
    console.log("addGoal called ");

    //TODO: usr needs to = DB usr with passed in username
    const username = req.body.username;
    const goalName = req.body.name;
    const goalFrequency = req.body.frequency;
    //TODO: SAVE TO DATABASE
    res.json({ name: goalName, frequency: goalFrequency });
  } catch (err) {
    console.log("addGoal error", err.message);
  }
});
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

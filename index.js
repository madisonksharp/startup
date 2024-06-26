const {
  createUser,
  addGoalForUser,
  getGoalsForUser,
  getUser,
  getFeed,
} = require("./database.js");
const bcrypt = require("bcrypt");
const Users = require("./mock.js");
const express = require("express");
const { peerProxy } = require("./peerProxy.js");
const app = express();

// Middleware to serve static files from the public directory
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.set("trust proxy", true);
// Routes
app.post("/login", async (req, res) => {
  try {
    console.log("login called ");
    //TODO: authenticate with req.body.username and req.body.password

    const username = req.body.username;
    const password = req.body.password;
    const usr = await getUser(username);
    if (usr) {
      const compare = await bcrypt.compare(password, usr.password);
      console.log("user password used: ", password);
      console.log("DB user password: ", usr.password);

      if (await bcrypt.compare(password, usr.password)) {
        setAuthCookie(res, usr._id.toString());
        //res.send({ id: user._id });
        delete usr.password;
        console.log("logged in user: ", usr);
        res.json(usr);
        return;
      }
    }
    res.status(401).send({ msg: "Unauthorized" });
  } catch (err) {
    console.log("login error", err.message);
    res.status(401).send({ msg: "Unauthorized" });
  }
});

app.post("/register", async (req, res) => {
  try {
    console.log("register called ");
    //TODO: authenticate with req.body.username and req.body.password

    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    //will hash password
    const password = req.body.password;
    const profilePic = req.body.profilePic;

    const usr = await createUser(username, name, email, password, profilePic);
    if (usr) {
      setAuthCookie(res, usr._id.toString());
      delete usr.password;
      console.log(usr);
      res.json(usr);
      return;
    }
    res.status(500).send({ msg: "Server error" });
  } catch (err) {
    console.log("reg error", err.message);
    res.status(500).send({ msg: "Server error" });
  }
});

app.get("/get-user", async (req, res) => {
  try {
    console.log("getting user ");

    const username = req.query.username;
    console.log("req.query: ", req.query);

    const user = await getUser(username);
    if (user) {
      delete user.password;
      res.json(user);
    }
  } catch (err) {
    console.log("get user error", err.message);
  }
});

app.post("/add-goal", async (req, res) => {
  try {
    console.log("addGoal called ");

    const username = req.body.username;
    const goalName = req.body.name;
    const goalFrequency = req.body.frequency;

    await addGoalForUser(username, goalName, goalFrequency);
    const goals = await getGoalsForUser(username);

    res.json(goals);
  } catch (err) {
    console.log("addGoal error", err.message);
  }
});

app.get("/get-feed", async (req, res) => {
  try {
    console.log("getting feed ");

    const username = req.query.username;
    console.log("req.query: ", req.query);

    const feed = await getFeed(username);

    res.json(feed);
  } catch (err) {
    console.log("get feed error", err.message);
  }
});

//set AuthCookie
function setAuthCookie(res, authToken) {
  res.cookie("auth", authToken, {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });
}

// Start the server
const PORT = process.env.PORT || 4000;
const httpService = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

peerProxy(httpService);

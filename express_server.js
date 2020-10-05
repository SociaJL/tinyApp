const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const { checkEmail, generateRandomString, getURLForUser, } = require("./helpers");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [""],

  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));




//// DBs ////
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "a@b.com",
    password: bcrypt.hashSync('p', 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync('password-funk', 10)
  }
};

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" }
};



//// Routing ////
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
  console.log("req.params:", req.params)
});

app.post("/urls/:shortURL/update", (req, res) => {
  let newurl = req.body.longURL
  if (req.session.user_id) {
    urlDatabase[req.params.shortURL].longURL = newurl
    res.redirect("/urls")

  } else {
    res.redirect('/login')
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {

  const user = users[req.session.user_id]
  if (!user) {
    res.render('loginError', { status: 400, error: 'Not Logged In!' });
  } else {
  const templateVars = {
    urls: getURLForUser(urlDatabase, req.session.user_id),
    user: user
  };
  console.log(req.session.user_id)
  res.render("urls_index", templateVars);
}
});

app.post("/urls", (req, res) => {
  let newurl = req.body.longURL
  let newRandomShortUrl = generateRandomString(newurl)

  urlDatabase[newRandomShortUrl] = { longURL: newurl, userID: req.session.user_id }
  res.redirect(`/urls/${newRandomShortUrl}`)
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  }

  if (req.session.user_id) {
    res.render('urls_new', templateVars)
  } else {
    res.redirect('/login')
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.session.user_id],
  }
  res.render("urls_show", templateVars)
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  const templateVars = {
    greeting: 'Home Page',
    user: users[req.session.user_id],
  };
  res.render("hello_world", templateVars);
});

//// Login/Out ////
app.post("/login", (req, res) => {
  const email = req.body.email
  const providedPass = req.body.password
  
  if (checkEmail(email, users)) {
    for (const user in users) {
      if (users[user].email === email) {
        if (bcrypt.compareSync(providedPass, users[user].password)) {
          req.session.user_id = user
          res.redirect('/urls')
        } else {
          res.sendStatus(403)
        }
      }
    }
  } else {
    res.sendStatus(403)
  }
});

app.get('/login', (req, res) => {
  const templateVars = {
    user: ""
  }
  res.render('login', templateVars)
});

app.post("/logout", (req, res) => {
  res.clearCookie("session")
  res.redirect("/login")
});

//// Registration ////
app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: "",
  };
  res.render("register", templateVars)
});

app.post("/register", (req, res) => {
  const userId = generateRandomString()
  const userEmail = req.body.email
  const userPassword = req.body.password
  
  if (!userEmail || !userPassword || checkEmail(userEmail, users)) {
    res.redirect("/errors")
  } else {
    users[userId] = {
      id: userId,
      email: userEmail,
      password: bcrypt.hashSync(userPassword, 10)
    }
    req.session.user_id = userId
    res.redirect("/urls")
  }
});

app.get('/errors', (req, res) => {
  res.render('errors')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

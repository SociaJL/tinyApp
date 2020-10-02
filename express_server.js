const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.set("view engine", "ejs");

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8)
}



//// USER DB ////
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "p"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

const checkEmail = (email, users) => {

  for (const user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
}




//// URLS ////
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// app.get("/", (req, res) => {
//   res.send("Hello There!");
// });

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {

  const user = users[req.cookies["user_id"]]

  const templateVars = {
    urls: urlDatabase,
    user: user
  };

  res.render("urls_index", templateVars);
});
// if user is not logged in re direct to login res.redirect
// to check if logged in 
// check for value of cookie named user_id (loop for match)
// match? yes theyre logged in : redirect url/login

app.get("/urls/new", (req, res) => {
  const { user_id } = req.session;
  if (!user_id) {
    res.redirect("/login")
  } else {
    const templateVars = {
      user: req.cookies["user_id"],
    }
    res.render("urls_new", templateVars);
  }
})

app.post("/urls", (req, res) => {
  //console.log(req.body)
  let newurl = req.body.longURL
  let newRandomShortUrl = generateRandomString(newurl)
  urlDatabase[newRandomShortUrl] = newurl
  //console.log(urlDatabase)

});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.cookies["user_id"],
  }
  res.render("urls_show", templateVars)
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);

});


//// HOME ////
app.get("/hello", (req, res) => {
  const templateVars = {
    greeting: 'Home Page',
    user: req.cookies["user_id"],
  };
  res.render("hello_world", templateVars);
});

// check for errors first 
//// LOGIN ////
app.post("/login", (req, res) => {
  const email = req.body.email
  const pass = req.body.password

  if (checkEmail(email, users)) {
    for (const user in users) {
      if (users[user].email === email) {
        if (users[user].password === pass) {
          res.cookie('user_id', user)
          res.redirect('/urls')
        } else {
          res.sendStatus(403)
        }
      }
    }
  } else {
    res.sendStatus(403)
  }
})


app.get('/login', (req, res) => {
  const templateVars = {
    user: ""
  }
  res.render('login', templateVars)
})


//// LOGOUT ////
app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect("/urls")
})






//// REGISTER ////
app.get("/register", (req, res) => {

  const templateVars = {
    urls: urlDatabase,
    user: ""
  };
  res.render("register", templateVars)
})

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
      password: userPassword
    }
    res.cookie('user_id', userId)
    res.redirect("/urls")
  }
});






//// DB shortURL 
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
  console.log("req.params:", req.params)
  // console.log("req.body", req.body)
})

app.post("/urls/:shortURL/update", (req, res) => {
  let newurl = req.body.longURL
  urlDatabase[req.params.shortURL] = newurl
  res.redirect("/urls")
});


//// ERROR ////
app.get('/errors', (req, res) => {

  res.render('errors')
})




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


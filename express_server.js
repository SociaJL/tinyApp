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
    email: "a@b.com",
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
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID" }
};

// app.get("/", (req, res) => {
//   res.send("Hello There!");
// });
const getURLForUser = (urlDatabase, user_id) => {
  let result = {}
    for (const url in urlDatabase) {
      if (urlDatabase[url].userID === user_id) {
        result[url] = urlDatabase[url]
      }
    }
    return result; 
  }

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  
  const user = users[req.cookies["user_id"]]
  
  const templateVars = {
    urls: getURLForUser(urlDatabase, req.cookies["user_id"]),
    user: user
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id], // change all 
  }
  if (req.cookies.user_id) {
    res.render('urls_new', templateVars)
  } else {
    res.redirect('/login')
  }
});

app.post("/urls", (req, res) => {
  //console.log(req.body)
  let newurl = req.body.longURL
  let newRandomShortUrl = generateRandomString(newurl)
  // "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID" }
  urlDatabase[newRandomShortUrl] = {longURL: newurl, userID: req.cookies.user_id }
  res.redirect(`/urls/${newRandomShortUrl}`)
  //console.log(urlDatabase)
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies.user_id],
  }
  res.render("urls_show", templateVars)
})

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);

});


//// HOME ////
app.get("/hello", (req, res) => {
  const templateVars = {
    greeting: 'Home Page',
    user: users[req.cookies.user_id],
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
  res.redirect("/login")
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
  if (req.cookies["user_id"]) {
    urlDatabase[req.params.shortURL].longURL = newurl
    res.redirect("/urls")

  } else {
    res.redirect('/login')
  }
});


//// ERROR ////
app.get('/errors', (req, res) => {

  res.render('errors')
})




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


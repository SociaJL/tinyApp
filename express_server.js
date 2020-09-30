const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8)
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



app.get("/", (req, res) => {
  res.send("Hello There!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase 
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]
  }
  res.render("urls_show", templateVars)
})

app.get("/hello", (req, res) => {
  const templateVars = { 
    greeting: 'Hello World!' 
  };
  res.render("hello_world", templateVars);
});

app.post("/urls", (req, res) => {
  //console.log(req.body)
  let newurl = req.body.longURL
  let newRandomShortUrl = generateRandomString(newurl)
  urlDatabase[newRandomShortUrl] = newurl
  console.log(urlDatabase)
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);

});

app.get("/login", (req, res) => {
  res.cookie("username")
  res.redirect("/urls")
})

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
  console.log("req.params:", req.params)
  // console.log("req.body", req.body)
})


app.post("/urls/:shortURL/update", (req, res) => {
  //console.log(req.params)
  let newurl = req.body.longURL
  urlDatabase[req.params.shortURL] = newurl
  res.redirect("/urls")
  //console.log(urlDatabase)
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


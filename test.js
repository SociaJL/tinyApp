const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
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

console.log(checkEmail("user@ex1ample.com", users))

// step by step!

const getUserById = (userDB, ID) => {
  for (let user in userDB) {
    if (userDB[user].id === ID) {
      return userDB[user];
    }
  }
};

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID" }
};


const getURLForUser = (urlDatabase, user_id) => {
let result = {}
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === user_id) {
      result[url] = urlDatabase[url]
    }
  }
  return result; 
}

console.log(getURLForUser(urlDatabase, "userRandomID"))

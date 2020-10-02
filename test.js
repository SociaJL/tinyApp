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

console.log(getUserById(users, ))
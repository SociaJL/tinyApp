const { assert } = require('chai');

const { checkEmail } = require('../helpers.js');

const testUsers = {
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
};

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": {longURL: "http://www.google.com", userID: "user2RandomID" }
};

describe('checkEmail', function() {
  it('should return a user with valid email', function() {
    const user = checkEmail("user@example.com", testUsers)
    assert.equal(true, user)
  });
  it('should return a user with valid email', function() {
    const user = checkEmail("user@examdddple.com", testUsers)
    assert.equal(false, user)

    });
});


const getURLForUser = (urlDatabase, user_id) => {
  let result = {}
    for (const url in urlDatabase) {
      if (urlDatabase[url].userID === user_id) {
        result[url] = urlDatabase[url]
      }
    }
    return result; 
  }

  describe('getURLForUser', function() {
    it('should return the URLs created by the user', function() {
      const userUrls = getURLForUser(urlDatabase, "userRandomID")
      const expectedResult = { b2xVn2: { longURL: 'http://www.lighthouselabs.ca', userID: 'userRandomID' }}
      assert.deepEqual(userUrls, expectedResult)

    })
  })
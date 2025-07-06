## About this Room Split App and how it works

- used express to buld rest apis
- use express router to build routes
- used app.use to catch all roures
- used express.json to catch all coming data flow in json format
- implementing /signup path with this conditions as check point:

  - first validate all the info coming from req.body
  - and hash the password before saving it to db
  - used bcryt package for this
  - after saving the user into DB then create jwt token and send res as cookies
  - used cookie parser lib to implement this feature
  - what ever the methods are re-usable and in relation with user we will create and attach them with user model by using user.
    methods

- implemeted /login api with

  - first check the body received by user
  - then check the user is exist in db or not
  - if not throw an
  - check for password provided by user is same as that saved in DB or not
  - if user is user is there and password validated then send the cookies

- implement userMiddlware
  - to verify wether we got verified user or not
  - verify cookie
  - once cookies verified then send the data
  - and also assign logged in user to user Model

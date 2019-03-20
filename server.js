const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

//IMPORTING THE HANDLER FUNCTIONS
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true
    }
  });

const app = express();

app.use(bodyParser.json());
app.use(cors());

//ROOT ENDPOINT
app.get('/', (req, res) => {res.send(db.users);})

//SIGNIN END POINT
app.post('/signin', signin.handleSignIn (db, bcrypt))

//REGISTER ENDPOINT
app.post('/register', register.handleRegister(db, bcrypt))

//RETRIEVE PROFILE ENDPOINT
app.get('/profile/:id', profile.handleProfile(db))

//IMAGE COUNT UPDATE
app.put('/image', image.handleImage(db))

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})

/* WHAT WE WANT TO HAVE

/                   --> ROOT ROUTE res = this is working
/signing            --> SIGNIN ROUTE, POST request = success/fail
/register           --> REGISTER ROUTE, POST request = return user
/profile/:userId    --> GET request = return user
/image count        --> PUT updates score --> returns update user

*/
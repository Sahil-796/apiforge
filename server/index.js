const express = require('express');
const app = express();
const port = 3000;
const cors  = require('cors')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const session = require('express-session')
const passport = require('passport')
require('dotenv').config()


const corsOptions = {
  origin: [
    'https://bfc56k0q-5173.inc1.devtunnels.ms',
    'http://localhost:5173',
    'https://apiforge-orpin.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));




app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(()=> console.log("MongoDB connected"))
  .catch(err=> console.log(err))
  
app.set('trust proxy', 1)
app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI}),
  cookie: {
    maxAge: 1000*60*60*24*7, 
  httpOnly: true,
  secure: true, //change to true in prod - cip
  sameSite: 'none'
}
}))

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')

app.get('/', (req,res)=> res.json('Hello developer !'))

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const data = require('./routes/me');
app.use('/api/', data);  //   api/me

const create = require('./routes/create');
app.use('/api/create', create);

const customEndpoints = require('./routes/customEndpoints');
app.use('/apiforge', customEndpoints);

const aiRoutes = require('./routes/ai');
app.use('/api', aiRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
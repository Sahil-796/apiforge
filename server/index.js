const express = require('express');
const app = express();
const port = 3000;
const cors  = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
require('./config/passport')

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParse: true,
  useUnifiedTopology: true
}).then(()=> console.log("MongoDB connected"))
  .catch(err=> console.log(err)) 
  
  
app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitiated: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI}),
  cookie: {
  maxAge: 1000*60*60*24*7, 
  httpOnly: true,
  secure: false //change in prod
}
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req,res)=> res.send('Hello developer !'))

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
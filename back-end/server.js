const express = require('express')
const connectDB = require('./db/Connection')
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5052
const app = express()

const otpRoutes = require('./routes/user-routes/GenerateOtp')
const  loginVerify = require('./routes/user-routes/GenerateOtp');
const fetchUser = require('./routes/user-routes/FetchData')
const courses = require('./routes/user-routes/Course')

app.use(cors()); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }))

connectDB()

app.use('/otp', otpRoutes);
app.use('/verify', loginVerify);
app.use('/current', fetchUser)
app.use('/course', fetchUser)
app.use('/course', courses)
app.use('/user', courses)
app.use('/api', courses)
app.use('/save', courses)
app.use('/progress', courses)
app.use('/assessment', courses);
app.use('/courses', courses);

app.listen(port, () => {
    console.log(`Server started at ${port}`); 
  });
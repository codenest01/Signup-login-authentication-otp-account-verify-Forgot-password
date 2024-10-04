var createError = require('http-errors');
var express = require('express');
var expressValidator  = require('express-validator')
const rateLimit = require('express-rate-limit');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/data-base');
const cors = require('cors');
var signupRouter = require('./routes/userLogins/signup');
var loginRouter = require('./routes/userLogins/login');
var resetPassword = require('./routes/reset-Password/resetpassword')
var userSchema = require("./models/User")
var productRouter = require('./routes//private/productRouter');
const passwordCompareRoute = require('./routes/passwordUtils'); ///check password
var ensureAuthenticated = require('./middleware/auth')


var userData = require('./routes/private/user-data')

var verifyRoute = require('./routes/verify-accounts/verify')

var verifyCode = require("./routes/verify-accounts/verify-code")

var tempAuthenticaated = require('./middleware/account-verify')
var resetPasswordMiddleware = require('./middleware/resetPasswordMiddleware')
const sendOtpRoute = require('./routes/reset-Password/ResetPass-send-otp');
const verifyOtpRoute = require('./routes/private/verify-otp');

var app = express();
connectDB()
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');





const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 134, // Limit each IP to 5 requests per window
  message: 'Too many OTP requests from this IP, please try again later.',
});


app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', otpLimiter);
app.use('/auth' , ensureAuthenticated);
app.use('/auth' , tempAuthenticaated);
app.use('/auth' , resetPasswordMiddleware);

app.use('/', signupRouter);
app.use('/', loginRouter)
app.use('/', productRouter);

//Verify user Otp on Account verification
app.use('/',verifyCode );

//verify user account and send an email
app.use('/', verifyRoute);

//reset user password
app.use('/api' , resetPassword)

//Send Otp For reset password
app.use('/', sendOtpRoute); 

//Verify Otp for reset password
app.use('/', verifyOtpRoute); 


app.use('/api', passwordCompareRoute);///check password

app.use('/api' , userData)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

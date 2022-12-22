import express from 'express'
import mongoose from 'mongoose'
import signatureRoute from './route/signature.js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function (req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
app.use(signatureRoute)

const PORT = process.env.PORT || 3000

mongoose
  .connect(
    'mongodb+srv://Solana:1234567890@solana.wgjpc7n.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port:${PORT}`)),
  )
  .catch((error) => console.log(error.message))

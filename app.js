const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_data");
const express = require("express");

const app = express();

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

app.use((req,res,next) =>{
  console.log(req.body)
  next()
})

app.use("/", adminRoutes); 
app.use("/", userRoutes);



app.listen(8080, () => {
  console.log("server runing on http://localhost:8080/");
  console.log("admin panal http://localhost:8080/admin");
});

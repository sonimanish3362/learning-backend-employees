const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/database");

const app = express();

const PORT = process.env.PORT || 5000;

const employeeRoutes = require("./routes/employeeRoutes");
const authRouters = require("./routes/authRoutes"); 

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}));

app.use("/employees", employeeRoutes);
app.use("/auth" , authRouters)

app.listen(PORT, () => {
    console.log(`Server is running on port-test ${PORT}`);
})

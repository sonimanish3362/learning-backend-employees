const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getEmployees, createEmployee , updateEmployee , deleteEmployee} = require("../controllers/employeeController");

router.get("/" ,authMiddleware , getEmployees);
router.post("/" , upload.single("image") ,authMiddleware , createEmployee);
router.put("/:id" , upload.single("image") ,authMiddleware , updateEmployee);
router.delete("/:id" ,authMiddleware , deleteEmployee);


module.exports = router;
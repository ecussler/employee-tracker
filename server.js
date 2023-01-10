// Packages needed to run the application. 
const express = require('express'); 
const inquirer = require('inquirer'); 
const mysql = require('mysql2'); 
const connection = require('./config/connection'); 
inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer)); 

// const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database

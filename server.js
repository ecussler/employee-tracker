// Packages needed to run the application. 
const express = require('express'); 
const inquirer = require('inquirer'); 
const mysql = require('mysql2'); 
// const connection = require('./config/connection'); 
inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer)); 

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const connection = mysql.createConnection(
    // process.env.DB_NAME, 
    // process.env.DB_USER, 
    // process.env.DB_PASSWORD,
    {
        host: 'localhost', 
        user: 'root', 
        password: '', 
        database: 'employee_db'
    }, 
    console.log('Connected to the employee_db database.')
); 

const prompts = [
    {
        type: 'list', 
        name: 'options', 
        message: 'What would you like to do?', 
        choices: [
            'View All Departments', 
            'View All Roles', 
            'View All Employees', 
            'Add a Department', 
            'Add a Role', 
            'Add an Employee', 
            'Update an Employee Role'
        ]
    }
]



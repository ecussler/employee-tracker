const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer'); 

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);


db.query('SELECT * FROM department', function (err, results){
    console.table(resluts); 
})



function init() {
 inquirer.prompt([
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
 ])
    .then((response) => {
        const [...choices] = response; 

        if (choices === 'View All Departments') {
            viewAllDepartments();
        } else if (choices === 'View All Roles') {
            viewAllRoles(); 
        } else if (choices === 'View All Employees') {
            viewAllEmployees();
        } else if (choices === 'Add a Department') {
            addDepartment();
        } else if (choices === 'Add a Role') {
            addRole(); 
        } else if (choices === 'Add an Employee') {
            addEmployee();
        } else if (choices === 'Update an Employee Role') {
            updateRole();
        }
});


// Show all departments
function viewAllDepartments() {
    db.query('SELECT * FROM department', (err, result) =>
    err ? console.log(err) : console.table(result)
    )
}

// Show all roles
function viewAllRoles() {
    const query = `SELECT * FROM roles
                   JOIN department ON roles.department_id = department.id`;
    db.query(query, (err, result) =>
    err ? console.log(err) : console.table(result)
    )
}

// Show all employees
function viewAllEmployees()

// Add department
function addDepartment()

// Add role
function addRole()

// Add employee
function addEmployee()

// Update employee
updateRole()

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// init();
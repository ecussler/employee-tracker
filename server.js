const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer'); 

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
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

// Function to initialize inquirer
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
        console.log(response); 
        const selected = response.options
        if (selected === 'View All Departments') {
            viewAllDepartments();
        }
        else if (selected === 'View All Roles') {
            viewAllRoles();
            
         } else if (selected === 'View All Employees') {
             viewAllEmployees();
         } else if (selected === 'Add a Department') {
             addDepartment();
         } else if (selected === 'Add a Role') {
             addRole(); 
         } else if (selected === 'Add an Employee') {
             addEmployee();
         } else if (selected === 'Update an Employee Role') {
             updateRole();
         }
     })      
    }


// Show all departments
function viewAllDepartments() {
    db.promise().query('SELECT * FROM department') 
    .then((result) => console.table(result[0]))
    .then(() => init()); 
}



// Show all roles
function viewAllRoles() {
    db.promise().query(`SELECT * FROM roles JOIN department ON roles.department_id = department.id`) 
    .then((result) => console.table(result[0]))
    .then(() => init());
}



// Show all employees
function viewAllEmployees() {

    db.promise().query(`SELECT * FROM employee JOIN roles ON employee.role_id = roles.id`) 
    .then((result) => console.table(result[0]))
    .then(() => init());
}


// Add department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input', 
            name: 'newDeptName', 
            message: 'What is the name if your new department?', 
        }
    ])
    .then((response) => {
        const query = `INSERT INTO department (department_name)
                       VALUES ("${response.newDeptName}")`; 
        db.promise().query(query)
        .then(() =>  console.log('Department added successfully!'))
        .then(() => init()); 
    })
}



// Add role
function addRole() {
    db.query('SELECT * FROM department', (err, result) => {

        inquirer.prompt([
            {
                type: 'input', 
                name: 'newRoleName', 
                message: 'What is the name if your new role?', 
            }, 
            {
                type: 'input', 
                name: 'salary', 
                message: 'What is the salary? Please do not enter dollar signs or commas.',
                default: '100000'
            }, 
            {
                type: 'list', 
                name: 'roleDept', 
                message: 'What department does this role fall under? Please enter a number.',
                choices: result.map(({ id, department_name }) => ({ name: department_name, value:id }))
            }
        ])
        .then((response) => {
            const query = `INSERT INTO roles (title, salary, department_id)
                           VALUES ("${response.newRoleName}", ${response.salary}, ${response.roleDept})`; 
            db.promise().query(query)
            .then(() =>  console.log('Role added successfully!'))
            .then( () => init()); 
        })
    })
}


function addEmployee() {
    const employees =  db.promise().query('SELECT * FROM employee');
    const roles =  db.promise().query('SELECT * FROM roles');
    Promise.all([employees, roles]).then((values) => {


    inquirer.prompt([
        {
            type: 'input', 
            name: 'firstName', 
            message: 'What is the first name of your new employee?', 
        }, 
        {
            type: 'input', 
            name: 'lastName', 
            message: 'What is the last name of your new employee?',
        }, 
        {
            type: 'list', 
            name: 'employeeRole', 
            message: 'What is the role of your new employee?',
            choices: values[1][0].map(({ id, title }) => ({ name: title, value:id }))
        },
        {
            type: 'list', 
            name: 'manager', 
            message: 'Does your employee have a manager?',
            choices: values[0][0].map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value:id }))

        }
    ])
        .then((response) => {
            console.log(response); 
            const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                           VALUES ('${response.firstName}', '${response.lastName}', ${response.employeeRole}, ${response.manager || null})`; 

            db.promise().query(query)
            .then(() =>  console.log('Employee added successfully!'))
            .then( () => init()); 
        })
    })
}


// Update employee role
function updateRole() {
    const employees =  db.promise().query('SELECT * FROM employee');
    const roles =  db.promise().query('SELECT * FROM roles');
    Promise.all([employees, roles]).then((values) => {
        
        inquirer.prompt([
            {
                type: 'list', 
                name: 'employeeName', 
                message: 'Which employee would you like to update?', 
                choices: values[0][0].map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value:id }))
            }, 
            {
                type: 'list', 
                name: 'employeeRole', 
                message: 'What is the new role of your new employee?',
                choices: values[1][0].map(({ id, title }) => ({ name: title, value:id }))
            }
        ])
            .then((response) => {
                const query = `UPDATE employee SET role_id = "${response.employeeRole}"
                           WHERE id = ${response.employeeName}`; 

            db.promise().query(query)
            .then(() =>  console.log('Employee updated successfully!'))
            .then( () => init()); 
            })
    })
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

init()
// Packages needed to run the application. 
const fs = require('fs'); 
const inquirer = require('inquirer'); 
inquirer.registerPrompt("loop", require("inquirer-loop")(inquirer)); 
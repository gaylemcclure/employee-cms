require("dotenv").config();
const { Pool } = require("pg");
const inquirer = require("inquirer");
const SelectData = require("./utils/selectData");
const CreateData = require('./utils/createData');
const UpdateData = require('./utils/updateData')
;
const pool = new Pool(
  {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
  }
  // console.log("Connected to the company_db database")
);

pool.connect();

//List of main questions
const choices = [
  {
    name: "View departments",
    value: "view_dept",
  },
  {
    name: "View roles",
    value: "view_roles",
  },
  {
    name: "View employees",
    value: "view_emp",
  },
  {
    name: "Add a department",
    value: "add_dept",
  },
  {
    name: "Add a role",
    value: "add_role",
  },
  {
    name: "Add an employee",
    value: "add_emp",
  },
  {
    name: "Update an employee role",
    value: "update_role",
  },
  {
    name: "Exit",
    value: "exit",
  },
];

//List of add employee inputs
const employeeInputs = [{
  type: 'input',
  name: 'first_name',
  message: "What's the employees first name?",
},
{
  type: 'input',
  name: 'last_name',
  message: "What's the employees last name?",
},
{
  type: 'input',
  name: 'title',
  message: "What's the employees job title?",
},
{
  type: 'input',
  name: 'manager',
  message: "Who is the employees manager?",
}
]

//List of add department inputs
const departmentInputs = [{
  type: 'input',
  name: 'dept_name',
  message: "What's the department name?",

}]

//List of add role inputs

const roleInputs = [{
  type: 'input',
  name: 'role_name',
  message: "What's the role name",
},
{
  type: 'input',
  name: 'salary',
  message: "What's the salary for this role?",
},
{
  type: 'input',
  name: 'department',
  message: "What's the department for this role?",
}
]



//Function to run the question prompt
const questionFunction = async () => {
  let stop = false;

  //while loop to make sure it runs on repeat
  while (!stop) {
    //async response to wait for answer
    await inquirer
      .prompt([
        {
          type: "list",
          name: "options",
          message: "What would you like to do?",
          choices: choices,
        },
      ])
      .then(async (answers) => {
        if (answers.options === "exit") {
          stop = true;
        }
        if (answers.options === "view_dept") {
          const select = new SelectData(pool);
          const data = await select.viewDepartment();
          console.table(data);
        }
        if (answers.options === "view_roles") {
          const select = new SelectData(pool);
          const data = await select.viewRoles();
          console.table(data);
        }
        if (answers.options === "view_emp") {
          const select = new SelectData(pool);
          const data = await select.viewEmployees();
          console.table(data);
        }
        if (answers.options === "add_dept") {
          await inquirer.prompt(departmentInputs)
          .then(async (answers) => {
            console.log(answers)
          })
          // const select = new SelectData(pool);
          // const data = await select.selectDepartment();
          // console.table(data);
        }
        if (answers.options === "add_role") {
          await inquirer.prompt(roleInputs)
          .then(async (answers) => {
            console.log(answers)
          })
        }
        if (answers.options === "add_emp") {
          await inquirer.prompt(employeeInputs)
          .then(async (answers) => {
            console.log(answers)
          })
        }
        if (answers.options === "update_role") {
          const select = new SelectData(pool);
          const data = await select.selectDepartment();
          console.table(data);
        }
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      });
  }
};

//Initialise the function
questionFunction();

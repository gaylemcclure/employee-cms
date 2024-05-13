require("dotenv").config();
const { Pool } = require("pg");
const inquirer = require("inquirer");
//Import the classes
const SelectData = require("./utils/selectData");
const CreateData = require("./utils/createData");
const UpdateData = require("./utils/updateData");
const DeleteData = require('./utils/deleteData');

//Create the pool instance with env variables
const pool = new Pool(
  {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
  }
  // console.log("Connected to the company_db database")
);

//Connect to the pool
pool.connect();

//List of main questions
const choices = [
  {
    name: "View all departments",
    value: "view_dept",
  },
  {
    name: "View all roles",
    value: "view_roles",
  },
  {
    name: "View all employees",
    value: "view_emp",
  },
  {
    name: "View employees by manager",
    value: "view_emp_man",
  },
  {
    name: "View employees by department",
    value: "view_emp_dept",
  },
  {
    name: "View total budget by department",
    value: "view_budget",
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
    name: "Update employee role",
    value: "update_role",
  },
  {
    name: "Update employee manager",
    value: "update_manager",
  },
  {
    name: "Delete department",
    value: "delete_dept",
  },
  {
    name: "Delete role",
    value: "delete_role",
  },
  {
    name: "Delete employee",
    value: "delete_emp",
  },
  {
    name: "Exit",
    value: "exit",
  },
];

//Main function to run the question prompt
const questionFunction = async () => {
  let stop = false;

  //while loop to make sure it runs on repeat
  while (!stop) {
    //Set the main selectors
    const select = new SelectData(pool);
    const create = new CreateData(pool);
    const deleteRow = new DeleteData(pool);

    //async response to wait for answer before asking the prompt question again
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
        //Exit option
        if (answers.options === "exit") {
          stop = true;
        }

        //To view all departments
        if (answers.options === "view_dept") {
          const data = await select.viewDepartment();
          console.table(data);
        }

        //To view all roles
        if (answers.options === "view_roles") {
          const data = await select.viewRoles();
          console.table(data);
        }

        //to view all employees
        if (answers.options === "view_emp") {
          const data = await select.viewEmployees();
          console.table(data);
        }

        //to add a new department
        if (answers.options === "add_dept") {
          await inquirer
            .prompt({
              type: "input",
              name: "dept_name",
              message: "What's the department name?",
            })
            .then(async (answer) => {
              await create.addDepartment(answer.dept_name);
            });
        }

        //To add a new role
        if (answers.options === "add_role") {
          //Get the department list via query to show in the list
          await select.viewDepartment().then(async (data) => {
            await inquirer
              .prompt([
                {
                  type: "input",
                  name: "roleName",
                  message: "What's the role name?",
                },
                {
                  type: "input",
                  name: "salary",
                  message: "What's the salary for this role?",
                },
                {
                  type: "list",
                  name: "deptName",
                  message: "Select the department for this role",
                  choices: data,
                },
              ])
              .then(async (answer) => {
                // await select.viewDepartment().then(async (data) => {
                //call the create role query
                const { roleName, salary, department } = answer;
                await create.addRole(roleName, salary, department);
                // });
              });
          });
        }

        //Add a new employee
        if (answers.options === "add_emp") {
          //Get the role and employee data to show in the list prompts
          let roles;
          let employees;
          await select.addEmployeesRole().then((data) => (roles = data));
          await select
            .addEmployee()
            .then((data) => (employees = data))
            .then(async () => {
              //Init the question prompts
              await inquirer
                .prompt([
                  {
                    type: "input",
                    name: "firstName",
                    message: "What's the employees first name?",
                  },
                  {
                    type: "input",
                    name: "lastName",
                    message: "What's the employees last name?",
                  },
                  {
                    type: "list",
                    name: "title",
                    message: "What's the employees job title?",
                    choices: roles,
                  },
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employees manager?",
                    choices: employees,
                  },
                ])
                .then(async (answer) => {
                  //Call the add employee function
                  const { firstName, lastName, title, manager } = answer;
                  await create.addEmployee(firstName, lastName, title, manager);
                });
            });
        }
        //Update an employees role
        if (answers.options === "update_role") {
          let roles;
          let employees;
          //Get the list of roles from db
          await select.addEmployeesRole().then((data) => (roles = data));
          //Get the list of employees from db
          await select
            .addEmployee()
            .then((data) => (employees = data))
            .then(async () => {
              await inquirer
                .prompt([
                  {
                    type: "list",
                    name: "employee",
                    message: "Which employee would you like to update?",
                    choices: employees,
                  },
                  {
                    type: "list",
                    name: "role",
                    message:
                      "Which role would you like to assign to this employee?",
                    choices: roles,
                  },
                ])
                .then(async (answer) => {
                  const { employee, role } = answer;
                  //Call the update employee function
                  const update = new UpdateData(pool, employee);
                  await update.updateEmployeeRole(role);
                });
            });
        }

        //Extra options
        //View a table of employees by manager
        if (answers.options === "view_emp_man") {
          await select.viewManagers().then(async (data) => {
            await inquirer
              .prompt({
                type: "list",
                name: "manager",
                message: "Select the manager to view by?",
                choices: data,
              })
              .then(async (answer) => {
                await select
                  .viewByManager(answer.manager)
                  .then(async (data) => {
                    console.table(data);
                  });
              });
          });
        }

        //View a table of employees by department
        if (answers.options === "view_emp_dept") {
          await select.viewDepartmentsId().then(async (data) => {
            await inquirer
              .prompt({
                type: "list",
                name: "department",
                message: "Select the department to view employees for?",
                choices: data,
              })
              .then(async (answer) => {
                await select
                  .viewByDepartment(answer.department)
                  .then(async (data) => {
                    console.table(data);
                  });
              });
          });
        }

        //View the total budget by department
        if (answers.options === "view_budget") {
          await select.viewDepartmentsId().then(async (data) => {
            await inquirer
              .prompt({
                type: "list",
                name: "department",
                message: "Select the department to view the total budget for?",
                choices: data,
              })
              .then(async (answer) => {
                await select.viewBudget(answer.department);
              });
          });
        }

        //Update an employees manager
        if (answers.options === "update_manager") {
          let managers;
          let employees = [];
          //Get the list of employees
          await select
            .viewEmployees()
            .then((data) =>
              data.map((data) =>
                employees.push({
                  name: `${data.first_name} ${data.last_name}`,
                  value: data.id,
                })
              )
            );
          //Get the list of managers
          await select
            .viewManagers()
            .then((data) => (managers = data))
            .then(async () => {
              //Question prompts
              await inquirer
                .prompt([
                  {
                    type: "list",
                    name: "employee",
                    message: "Which employee would you like to update?",
                    choices: employees,
                  },
                  {
                    type: "list",
                    name: "role",
                    message:
                      "Which manager would you like to assign to this employee?",
                    choices: managers,
                  },
                ])
                .then(async (answer) => {
                  const { employee, role } = answer;
                  //Create a new update class instance
                  const update = new UpdateData(pool, employee);
                  //call the update manager function in Update class
                  await update.updateEmployeeManager(role);
                });
            });
        }
        //Delete a department
        if (answers.options === "delete_dept") {
          await select.viewDepartmentsId().then(async (data) => {
            await inquirer
              .prompt({
                type: "list",
                name: "department",
                message: "Select the department to delete?",
                choices: data,
              })
              .then(async (answer) => {
                await deleteRow.deleteDepartment(answer.department);
              });
          });
        }

        //Delete a role
        if (answers.options === "delete_role") {
          await select.addEmployeesRole().then(async (data) => {
            await inquirer
              .prompt({
                type: "list",
                name: "role",
                message: "Select the role to delete?",
                choices: data,
              })
              .then(async (answer) => {
                await deleteRow.deleteRole(answer.role);
              });
          });
        }

        //Delete an employee
        if (answers.options === "delete_emp") {
          await select.addEmployee().then(async (data) => {
            data.shift();
            await inquirer
              .prompt({
                type: "list",
                name: "employee",
                message: "Select the employee to delete?",
                choices: data,
              })
              .then(async (answer) => {
                await deleteRow.deleteEmployee(answer.employee);
              });
          });

        }
      })
      //Error handling
      .catch((error) => {
        if (error.isTtyError) {
          console.error("Can't render prompt in current environment")
        } else {
          console.error("Unknown error")

        }
      });
  }
};

//Initialise the main function
questionFunction();

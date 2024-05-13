class SelectData {
  constructor(pool) {
    this.pool = pool;
  }

  //Function to view all department data
  async viewDepartment() {
    const res = await this.pool.query(`SELECT * FROM department`);
    return res.rows;
  }

  //Function to view all role data
  async viewRoles() {
    const res = await this.pool.query(`SELECT * FROM role`);
    return res.rows;
  }

  //Function to view all employee data
  async viewEmployees() {
    const res = await this.pool.query(`SELECT * FROM employee`);
    return res.rows;
  }

  //Get data for the add employee prompt - manager question
  async addEmployee() {
    const res = await this.pool.query(
      `SELECT id, first_name, last_name FROM employee`
    );
    let data = [];
    let employees = res.rows;
    //Create array of objects
    employees.map((emp) => {
      data.push({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      });
    });
    data.unshift({ name: "none", value: null });
    return data;
  }

  //Get role data for the employee prompt & turn into array
  async addEmployeesRole() {
    const res = await this.pool.query(`SELECT id, title FROM role`);
    let data = [];
    let roles = res.rows;
    //create array of objects for inquirer prompt
    roles.map((role) => {
      data.push({
        name: role.title,
        value: role.id,
      });
    });
    return data;
  }

  //Get department data into array for inquirer prompt
  async viewDepartmentsId() {
    const res = await this.pool.query(`SELECT * FROM department`);
    let data = [];
    let depts = res.rows;
    //create array of objects for inquirer prompt
    depts.map((dept) => {
      data.push({
        name: dept.name,
        value: dept.id,
      });
    });
    return data;
  }

  //Function to view all managers (employees where manager_id === null)
  async viewManagers() {
    const res = await this.pool.query(
      `SELECT * FROM employee WHERE manager_id IS NULL`
    );
    let data = [];
    let emps = res.rows;
    //Create object array for inquirer prompt
    emps.map((emp) => {
      data.push({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      });
    });
    return data;
  }

  //Function to view all the employees that have the same selected manager
  async viewByManager(answer) {
    const res = await this.pool.query(
      `SELECT * FROM employee WHERE manager_id = $1`,
      [answer]
    );
    return res.rows;
  }

  //Function to view all the employees within a selected department
  async viewByDepartment(answer) {
    const res = await this.pool.query(
      `SELECT id FROM role WHERE department_id = $1`,
      [answer]
    );
    const result = res.rows;
    let text = `SELECT * FROM employee WHERE`;
    //Create the query based on multiple paramaters
    for (let i = 0; i < result.length; i++) {
      if (i === result.length - 1) {
        text = text.concat(` role_id = ${result[i].id}`);
      } else {
        text = text.concat(` role_id = ${result[i].id} OR`);
      }
    }
    const empRes = await this.pool.query(text);
    return empRes.rows;
  }

  //Function to get the number of employees in each department role, and calculate the total department salary
  async viewBudget(answer) {
    const res = await this.pool.query(
      `SELECT * FROM role WHERE department_id = $1`,
      [answer]
    );
    const result = res.rows;
    const roles = [];
    let text = `SELECT * FROM employee WHERE`;
    for (let i = 0; i < result.length; i++) {
      roles.push(result[i]);
      //Create the query with multiple paramaters
      if (i === result.length - 1) {
        text = text.concat(` role_id = ${result[i].id}`);
      } else {
        text = text.concat(` role_id = ${result[i].id} OR`);
      }
    }
    const empRes = await this.pool.query(text);
    let totalBudget = 0;
    roles.map((role) => {
    //Get the amount of employees with the same job role (in a selected department)
      let totalEmployees = empRes.rows.filter((emp) => emp.role_id === role.id);
      totalBudget = totalBudget + totalEmployees.length * role.salary;
    });

    console.log(`The total budget for this department is $${totalBudget}`);
  }
}

module.exports = SelectData;

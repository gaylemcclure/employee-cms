class CreateData {
  constructor(pool) {
    this.pool = pool;
  }

  //Function to add a new department
  async addDepartment(department) {
    await this.pool.query(`INSERT INTO department(name) VALUES($1)`, [
      department,
    ]);
    console.log(`New department '${department}' has been created.`);
  }

  //Function to add a new role
  async addRole(role, salary, department) {
    const findDept = await this.pool.query(
      `SELECT * FROM department WHERE name = $1`,
      [department]
    );
    const departmentId = findDept.rows[0].id;
    await this.pool.query(
      `INSERT INTO role(title, salary, department_id) VALUES($1, $2, $3)`,
      [role, salary, departmentId]
    );
    console.log(`New role '${role}' has been created.`);
  }

  //Function to add a new employee
  async addEmployee(firstName, lastName, title, manager) {
    await this.pool.query(
      `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES($1, $2, $3, $4)`,
      [firstName, lastName, title, manager]
    );
    console.log(`New employee '${firstName} ${lastName}' has been created.`);
  }
}

module.exports = CreateData;

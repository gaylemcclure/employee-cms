class UpdateData {
  constructor(pool, employee) {
    this.pool = pool;
    this.employee = employee;
  }

  //Function to update an employees record with a new role_id
  async updateEmployeeRole(role) {
    await this.pool.query(`UPDATE employee SET role_id = $1 WHERE id = $2`, [
      role,
      this.employee,
    ]);
    console.log(`Employee has been updated.`);
  }

  //Function to update an employees record with a new manager_id
  async updateEmployeeManager(manager) {
    await this.pool.query(`UPDATE employee SET manager_id = $1 WHERE id = $2`, [
      manager,
      this.employee,
    ]);
    console.log(`Employee's manager has been updated.`);
  }

}

module.exports = UpdateData;

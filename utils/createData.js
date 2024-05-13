class CreateDepartment {
  constructor(pool) {
    this.pool = pool;
  }
  async addDepartment() {
    const res = await this.pool.query(`INSERT INTO department VALUES`);
    return res.rows;
  }
}

class CreateRole {
  constructor(pool) {
    this.pool = pool;
  }
  async addRole() {
    const res = await this.pool.query(`INSERT INTO role VALUES`);
    return res.rows;
  }
}

class CreateEmployee {
  constructor(pool) {
    this.pool = pool;
  }
  async addEmployee() {
    const res = await this.pool.query(`INSERT INTO employee VALUES`);
    return res.rows;
  }
}

module.exports = { CreateDepartment, CreateEmployee, CreateRole };

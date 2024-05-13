

class UpdateData {
    constructor(pool) {
        this.pool = pool
    }
    async viewDepartment() {
        const res = await this.pool.query(`SELECT * FROM department`);
        return res.rows
    }
    async viewRoles() {
        const res = await this.pool.query(`SELECT * FROM role`);
        return res.rows
    }
    async viewEmployees() {
        const res = await this.pool.query(`SELECT * FROM employee`);
        return res.rows
    }
}

module.exports = UpdateData;
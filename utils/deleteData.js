class DeleteData {
    constructor(pool) {
        this.pool = pool
    }
    async deleteDepartment() {
        const res = await this.pool.query(`SELECT * FROM department`);
        return res.rows
    }
    async deleteRole() {
        const res = await this.pool.query(`SELECT * FROM role`);
        return res.rows
    }
    async deleteEmployee() {
        const res = await this.pool.query(`SELECT * FROM employee`);
        return res.rows
    }

}

module.exports = DeleteData;
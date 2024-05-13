class DeleteData {
    constructor(pool) {
        this.pool = pool
    }
    async deleteDepartment(department) {
        await this.pool.query(`DELETE FROM department WHERE id = $1`, [department]);
        console.log("Department has been deleted")
    }
    async deleteRole(role) {
        await this.pool.query(`DELETE FROM role WHERE id = $1`, [role]);
        console.log("Role has been deleted")
    }
    async deleteEmployee(employee) {
        await this.pool.query(`DELETE FROM employee WHERE id = $1`, [employee]);
        console.log("Employee has been deleted")
    }

}

module.exports = DeleteData;
const DatabaseManager = require('./db.js');

class userTable extends DatabaseManager{
    constructor(dbpool){
        super(dbpool);
    }

    async findUserById(userId, password){
        const query = `SELECT userid, name, admin, board_id FROM USER WHERE userid = ? AND password = ?`;
        const result = await this.query(query, userId, password);

        return result;
    }

    async getUserData(){
        const query = `SELECT userid, name, CASE WHEN admin > 0 THEN '관리자' ELSE '사용자' END AS auth FROM USER;`;
        const result = await this.query(query);

        return result;
    }

    async updateUserAuth(auth, users){
        const query = `UPDATE USER SET admin=${auth} WHERE userid IN (${users})`;
        const result = await this.query(query);

        return result;
    }
}

module.exports = userTable;
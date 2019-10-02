const mysql = require('mysql2/promise');

class DatabaseManager{
    constructor(dbpool){
        this.dbpool = mysql.createPool(dbpool);
    }

    async connect(){
        return this.dbpool.getConnection(async conn => conn);
    }

    async query(query, ...args){
        try{
            const connection = await this.connect().then(conn => conn);
            try{
                const [rows] = await connection.query(query, args);
                connection.release();
                return rows;
            }catch(err){
                console.log('query error');
                connection.release();
                return false;
            }
        }catch(err){
            console.log('DB error');
            return false;
        }
    }

    async findUserById(userId, password){
        const query = `SELECT userid, name, admin FROM USER WHERE userid = ? AND password = ?`;
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

module.exports = DatabaseManager;
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
}

module.exports = DatabaseManager;
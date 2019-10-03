const DatabaseManager = require('./db.js');

const PUBLIC_ACCESS_AUTH = 0;
const PRIVATE_ACCESS_AUTH = 1;

class boardTable extends DatabaseManager{
    constructor(dbpool){
        super(dbpool);
    }

    async getUserCards(userId){
        const query = `SELECT BOARD.* FROM BOARD LEFT JOIN USER ON BOARD.board_id=USER.board_id WHERE userid = ?`;
        const result = await this.query(query, userId);

        return result;
    }

    async checkBoardAuth(boardId, userId){
        const query = `SELECT access_state FROM BOARD_LIST WHERE board_id=?`;
        const result = await this.query(query, boardId);
        
        if(result[0].access_state === PUBLIC_ACCESS_AUTH){
            return true;
        }else if(result[0].access_state === PRIVATE_ACCESS_AUTH){
            const query = `SELECT access_auth FROM BOARD_AUTH WHERE board_id=? AND userid=?`;
            const result = await this.query(query, boardId, userId);
            
            return result[0];
        }else{
            return false;
        }
    }

    async getOtherUserCards(boardId){
        const query = `SELECT * FROM BOARD WHERE board_id= ?`;
        const result = await this.query(query, boardId);

        return result;
    }

    async updateCard(cardNum, content){
        const query = `UPDATE BOARD SET content=? WHERE card_id=?`;
        const result = await this.query(query, content, cardNum);

        return result;
    }

    async deleteCard(cardNum){
        const query = `DELETE FROM BOARD WHERE card_id=?`
        const result = await this.query(query, cardNum);

        return result;
    }
}

module.exports = boardTable;
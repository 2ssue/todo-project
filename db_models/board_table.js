const DatabaseManager = require('./db.js');

class boardTable extends DatabaseManager{
    constructor(dbpool){
        super(dbpool);
    }

    async getUserCards(boardId){
        const query = `SELECT card_id, column_id, content, prev_card_id, file_src FROM BOARD WHERE board_id=?`;
        const result = await this.query(query, boardId);

        return result;
    }

    async getColumns(boardId){
        const query = `SELECT column_id, name FROM COLUMNS WHERE board_id=?`;
        const result = await this.query(query, boardId);

        return result;
    }

    async checkBoardAuth(boardId, userId){
        const query = `SELECT l.access_state, a.userid, a.access_auth FROM BOARD_LIST l LEFT JOIN BOARD_AUTH a ON l.board_id=a.board_id WHERE l.board_id=? AND a.userid=?`
        const results = await this.query(query, boardId, userId);
        
        if(results[0]){
            return results[0].access_auth;
        }else{
            return false;
        }
    }

    async updateCardContent(cardNum, content){
        const query = `UPDATE BOARD SET content=? WHERE card_id=?`;
        const result = await this.query(query, content, cardNum);

        return result;
    }

    async updateCardState(cardNum, state, prevCard){
        const query = `UPDATE BOARD SET column_id=?, prev_card_id=${prevCard} WHERE card_id=?`;
        const result = await this.query(query, state, cardNum);

        return result;
    }

    async updateColumn(name, columnId){
        const query = `UPDATE COLUMNS SET name=? WHERE column_id=?`;
        const result = await this.query(query, name, columnId);

        return result;
    }

    async deleteCard(cardNum){
        const query = `DELETE FROM BOARD WHERE card_id=?`
        const result = await this.query(query, cardNum);

        return result;
    }

    async addCard(boardId, content, file_src, columnIndex){
        const query = `INSERT INTO BOARD (board_id, column_id, content, file_src) VALUES(?,'${boardId}${columnIndex}',?,?)`;
        const result = await this.query(query, boardId, content, file_src);

        return result;
    }

    async addLog(boardId, cardContent, userId, action, from, to){
        const query = `INSERT INTO BOARD_LOG (board_id, card, userid, action, prev, at) VALUES (?,?,?,?,?,?)`;
        const result = await this.query(query, boardId, cardContent, userId, action, from, to);

        return result;
    }

    async addBoard(boardId){
        const query = `INSERT INTO BOARD_LIST (board_id) VALUES (?)`;
        const result = await this.query(query, boardId);

        return result;
    }

    async addColumnTable(boardId){
        const query = 
        `INSERT INTO COLUMNS (column_id, board_id, name) VALUES 
        ('${boardId}0', '${boardId}', 'TODO'), 
        ('${boardId}1', '${boardId}', 'DOING'), 
        ('${boardId}2', '${boardId}', 'DONE')`
        const result = await this.query(query);

        return result;
    }

    async initBoardData(boardId){
        let result = await this.addBoard(boardId);
        
        if(result.affectedRows){
           result = await this.addColumnTable(boardId); 
        }

        return result;
    }
}

module.exports = boardTable;
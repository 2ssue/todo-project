const express = require('express');
const router = express.Router();
const DatabaseManager = require('../nodejs/board_table.js');
const auth = require('../nodejs/auth.js');
require('dotenv').config();

const userDB = new DatabaseManager({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_USERPASS,
    database: process.env.DB_DATABASE
});

router.get('/:boardId', auth.isLogined, async function(req, res, next){
   const parseUrl = req.url.split('/');
   const boardId = parseUrl.pop();

   if(boardId === req.user['board_id']){
       const cards = await userDB.getUserCards(req.user.userid);
       res.send(cards);
   }else{ //템플릿을 쏴줘야함
        const result = await userDB.checkBoardAuth(boardId, req.user.userid);

        if(result){
            const cards = await userDB.getOtherUserCards(boardId);
            res.send(cards);
        }else{
            res.render('error', {
                message: `😰함께 볼 수 없는 페이지입니다`,
                error: {
                    status: `Error Code 401`,
                    stack: ``
                }
            });
        }
   }
});

module.exports = router;
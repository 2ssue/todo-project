const express = require('express');
const router = express.Router();
const DatabaseManager = require('../nodejs/board_table.js');
const auth = require('../nodejs/auth.js');
require('dotenv').config();

const boardDB = new DatabaseManager({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN,
    password: process.env.DB_ADMINPASS,
    database: process.env.DB_DATABASE
});

router.get('/:boardId', auth.isLogined, async function(req, res, next){
   const parseUrl = req.url.split('/');
   const boardId = parseUrl.pop();

   if(boardId === req.user['board_id']){
       const cards = await boardDB.getUserCards(req.user.userid);
       req.user['board_auth'] = 'w';
       res.send(cards);
   }else{ //템플릿을 쏴줘야함
        const result = await boardDB.checkBoardAuth(boardId, req.user.userid);

        if(result){
            const cards = await boardDB.getOtherUserCards(boardId);
            req.user['board_auth'] = result['access_auth']; //권한 값에 따라 변경
            res.send(cards);
        }else{
            res.render('error', {
                message: `😰함께 볼 수 없는 보드입니다`,
                error: {
                    status: `Error Code 401`,
                    stack: ``
                }
            });
        }
   }
});

router.post('/update/card/:cardNum', auth.canUpdate, async function(req, res, next){
    const parseUrl = req.url.split('/');
    const cardNum = parseUrl.pop();

    const result = await boardDB.updateCardContent(cardNum, req.body.content);
    
    if(result.changedRows){
        res.send(JSON.stringify({
            result: 'success'
        }));
    }else{
        res.send(JSON.stringify({
            result: 'fail'
        }));
    }
});

module.exports = router;
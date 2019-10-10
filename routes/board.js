const express = require('express');
const router = express.Router();
const DatabaseManager = require('../db_models/board_table.js');
const auth = require('../middleware/auth.js');
require('dotenv').config();

const boardDB = new DatabaseManager({
    host: process.env.DB_HOST,
    user: process.env.DB_ADMIN,
    password: process.env.DB_ADMINPASS,
    database: process.env.DB_DATABASE
});

router.use(auth.isLogined);

router.get('/:boardId/columns', async function(req, res, next){
    const boardId = req.url.split('/')[1];

    if(req.user['board_auth'].split('/')[0] === boardId){
        const columns = await boardDB.getColumns(boardId);
        res.send(columns);
    }else{
        const result = await boardDB.checkBoardAuth(boardId, req.user.userid);
        if(result){
            const columns = await boardDB.getColumns(boardId);
            res.send(columns);
        }else{
            next({
                message: `😰함께 볼 수 없는 보드입니다`,
                status: 401
            });
        }
    }
})

router.get('/:boardId/cards', async function(req, res, next){
    const boardId = req.url.split('/')[1];
    
    if(req.user['board_auth'].split('/')[0] === boardId){
        const cards = await boardDB.getUserCards(boardId);
        res.send(cards);
    }else{
        next({
            message: `😰함께 볼 수 없는 보드입니다`,
            status: 401
        });
    }
});

router.get('/:boardId', async function(req, res, next){
    const boardId = req.url.split('/').pop();

    if(boardId === req.user.userid){
       req.user['board_auth'] = `${boardId}/w`;
    }else{
       const auth = await boardDB.checkBoardAuth(boardId, req.user.userid);
       if(auth){
           req.user['board_auth'] = `${boardId}/${auth}`;
       }else{
            next({
                message: `😰함께 볼 수 없는 보드입니다`,
                status: 401
            });
            return;
       }
    }

    res.render('board', {
        title: 'TODO LIST',
        link: '/logout',
        linktext: '로그아웃',
        user: `${req.user.name}님`
    });
});

router.post('/:boardId/update/card/:cardNum', auth.canUpdate, async function(req, res, next){
    const parseUrl = req.url.split('/');
    const cardNum = parseUrl.pop();
    const boardId = parseUrl[1];

    const result = await boardDB.updateCardContent(cardNum, req.body.content);
    
    if(result.changedRows){
        boardDB.addLog(boardId, req.body.content, req.user.userid, 'update', '', '');
        res.send(JSON.stringify({
            result: 'success'
        }));
    }else{
        res.send(JSON.stringify({
            result: 'fail'
        }));
    }
});

router.post('/:boardId/update/card/state/:cardNum', auth.canUpdate, async function(req, res, next){
    const parseUrl = req.url.split('/');
    const cardNum = parseUrl.pop();
    const boardId = parseUrl[1];

    const result = await boardDB.updateCardState(cardNum, `${boardId}${req.body.moveColumnIndex}`, req.body.prevCard);

    if(result.changedRows){
        boardDB.addLog(boardId, req.body.content, req.user.userid, 'moved', req.body.prevState, req.body.moveState);
        res.send(JSON.stringify({
            result: 'success'
        }));
    }else{
        res.send(JSON.stringify({
            result: 'fail'
        }));
    }
})

router.post('/:boardId/delete/card/:cardNum', auth.canUpdate, async function(req, res, next){
    const parseUrl = req.url.split('/');
    const cardNum = parseUrl.pop();
    const boardId = parseUrl[1];

    const result = await boardDB.deleteCard(cardNum);

    if(result.affectedRows){
        boardDB.addLog(boardId, req.body.content, req.user.userid, 'delete', '', '');
        res.send(JSON.stringify({
            result: 'success'
        }));
    }else{
        res.send(JSON.stringify({
            result: 'fail'
        }));
    }
});

router.post('/:boardId/add/card', auth.canUpdate, async function(req, res, next){
    const parseUrl = req.url.split('/');
    const boardId = parseUrl[1];
    const body = req.body;
    const result = await boardDB.addCard(boardId, body.content, body['file_src']='', body.columnIndex);

    if(result.affectedRows){
        boardDB.addLog(boardId, body.content, req.user.userid, 'add', '', body.columnName);
        res.send(JSON.stringify({
            result: 'success'
        }));
    }else{
        res.send(JSON.stringify({
            result: 'fail'
        }));
    }
});

router.get('/:boardId/log', auth.canUpdate, async function(req, res, next){
    const parseUrl = req.url.split('/');
    const boardId = parseUrl[1];
    const result = await boardDB.query(`SELECT * FROM BOARD_LOG WHERE board_id='${boardId}'`);

    res.send(result);
})

module.exports = router;
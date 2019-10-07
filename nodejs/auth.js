const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const DatabaseManager = require('./user_table.js');
require('dotenv').config();

const setPassport = () => {
    passport.use(new LocalStrategy({
        usernameField: 'userid',
        session: true,
        passReqToCallback: false
    },
        async function(username, password, done){
            const userDB = new DatabaseManager({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_USERPASS,
                database: process.env.DB_DATABASE
            });

            const user = await userDB.findUserById(username, password);

            if(user[0]){
                return done(null, user[0]);
            }else if(!user){
                return done('error', null);
            }else{
                return done(null, false, {message: '아이디나 비밀번호를 다시 확인해주세요'});
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

const isAdmin = (req, res, next) => {
    if(req.user && req.user.admin){
        next();
    }else if(req.user){
        res.redirect('/');
    }else{
        next({
            title: `ERROR`,
            link: `/`,
            link_text: '홈으로',
            message: '😅접근 권한이 없습니다',
            status: 401
        });
    }
}

const isLogined = (req, res, next) => {
    if(req.user){
        next();
    }else{
        next({
            title: `ERROR`,
            link: `/`,
            link_text: '홈으로',
            message: `😰로그인이 필요합니다`,
            status: 401,
            stack: ``
        });
    }
}

const canUpdate = (req, res, next) => {
    if(req.user && req.user['board_auth'] === 'w'){
        next();
    }else{
        next({
            title: `ERROR`,
            link: `/`,
            link_text: '홈으로',
            message: '😅접근 권한이 없습니다',
            status: 401
        });
    }
}

module.exports = {
    setPassport, isAdmin, isLogined, canUpdate
}
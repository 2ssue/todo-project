const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const DatabaseManager = require('../nodejs/db.js');
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
    if(req.user.admin){
        next();
    }else{
        res.redirect('/');
    }
}

module.exports = {
    setPassport, isAdmin
}
# Todo List WebPage Project

<a href="../../wiki">
<img alt="project-management" src="https://img.shields.io/badge/api--document-wiki-informational" target=
"_blank" />
</a>

## [🏠 PUBLISH PAGE](http://106.10.46.87/board/olsujdng)

## Install
```bash
$ npm install
```

## Usage
```bash
# Note
#
# You have to make .env file before start.
# This project don't inform database information. checkout `.env.dev`
$ npm start
```

## Project Structure
This project's structure is based on [express generator](https://expressjs.com/ko/starter/generator.html)

```bash
.
├── app.js
├── bin
│   └── www
├── db_models               # database Models (User DB, Todo Board DB)
├── middleware
│   └── auth.js             # check user authority middleware
├── public
│   ├── javascripts         
│   │   ├── model           
│   │   ├── util            
│   │   ├── view            # render by javascript views
│   │   └── ...
│   └── stylesheets
├── routes                  # server routing 
└── views                   # pug
```

### Database
![database_schema](https://user-images.githubusercontent.com/42017052/66389294-05864d80-ea03-11e9-8647-950327f47be4.png)

## Tech
module name|description|
---|---|
[Express](https://expressjs.com/)|Fast, unopinionated, minimalist web framework for Node.js|
[mysql2](https://www.npmjs.com/package/mysql2)|MySQL client for Node.js with focus on performance. Supports prepared statements, non-utf8 encodings, binary log protocol, compression, ssl|
[passport](https://www.npmjs.com/package/passport)|Passport is Express-compatible authentication middleware for Node.js.|
[express-session](https://www.npmjs.com/package/express-session)|express-session is the middleware required to manage sessions in the Express framework.|
[dotenv](https://www.npmjs.com/package/dotenv)|Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.|

## Author
Sujeong Lee
- Github: [@2ssue](https://github.com/2ssue)
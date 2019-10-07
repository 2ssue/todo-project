# Todo List WebPage Project

🏠 PUBLISH PAGE NOT YET

## Install
```bash
$ npm install
```

## Usage
```bash
# You have to make env file before start.
# This project don't inform database information. checkout `.env.dev`
$ npm start
```

## Project Structure
```
.
├─bin
├─nodejs                # serverside javascript
│  ├─auth.js            # authenticate user 
│  ├─board_table.js     # database manager associate with board tables (extends db.js)
│  ├─user_table.js      # database manager associate with user tables (extends db.js)
│  └─db.js              
├─public                # front static file
│  ├─images
│  ├─javascripts
│  └─stylesheets
├─routes
└─views
```
### Database
![database_schema](https://user-images.githubusercontent.com/42017052/66306129-d6f16f80-e93b-11e9-971f-45c076d5ec89.png)

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
- Github: @2ssue
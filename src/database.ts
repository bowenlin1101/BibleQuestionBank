import {Database} from "sqlite3"

function initQuestions() {
    return Promise.resolve(new Database('./SQLDatabase'))
    .then((db: Database) => {
        return new Promise<Database>((resolve, reject) => {
            db.serialize(() => {
                db.run('CREATE TABLE IF NOT EXISTS questions (questionid INTEGER PRIMARY KEY, question TEXT UNIQUE);', (error:Error) => {
                    if (error) console.log(error)
                    else resolve(db);
                })
            })
        })
    })
}

function initArchives() {
    return Promise.resolve(new Database('./SQLDatabase'))
    .then((db: Database) => {
        return new Promise<Database>((resolve, reject) => {
            db.serialize(() => {
                db.run('CREATE TABLE IF NOT EXISTS archives (questionid INTEGER PRIMARY KEY, question TEXT UNIQUE, summary TEXT);', (error:Error) => {
                    if (error) console.log("SQLError")
                    else resolve(db);
                })
            })
        })
    })
}

function initUnfinished() {
    return Promise.resolve(new Database('./SQLDatabase'))
    .then((db: Database) => {
        return new Promise<Database>((resolve, reject) => {
            db.serialize(() => {
                db.run('CREATE TABLE IF NOT EXISTS unfinished (index INTEGER PRIMARY KEY, question TEXT UNIQUE);', (error:Error) => {
                    if (error) console.log("SQLError")
                    else resolve(db);
                })
            })
        })
    })
}

export default {initQuestions: initQuestions,initArchives:initArchives,initUnfinished:initUnfinished}
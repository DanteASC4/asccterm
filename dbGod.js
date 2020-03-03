const bcrypt = require('bcryptjs')
var fs = require('fs');
const dbF = process.env.PATH_TO_DB;
var colors = require('colors/safe')
var flagCount = 0;
const flag = (info) => {
    flagCount++;
    console.log(`${colors.cyan("DB_Flag num:" + flagCount)}\n${[...info]}`)
}

module.exports = new class Dbmaster {
    constructor(){
        if(!fs.existsSync(dbF)){
            this.db = require('./dbinit');
            this.createTables();
        }else {
            this.db = require('./dbinit');
        }

        this.addOneEntry();
        // this.attempt('bob').then(result => {
        //     console.log(result)
        // }).catch(e => console.error(e))
    }

    createTables(){
        this.db.exec(`CREATE TABLE answers ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'password' TEXT NOT NULL, 'reward' TEXT NOT NULL, 'correct_count' INTEGER DEFAULT 0, 'incorrect_count' INTEGER DEFAULT 0);`);
    }

    /**
     * adds one entry to the database
     *
     * @return  {void}  returns nothing
     */
    addOneEntry(){
        var doOnce = true;
        if(doOnce){

            // flag(['Adding'])
            // this.addEntry('bob', 'https://www.reddit.com')
            // .then(res => {
            //     flag(['Add enrty then method ', res])
            // }).catch(e => console.error(e))

            doOnce = false;
        }
    }


    addEntry(p, r){
        flag(['Add entry 1 ', p, r]);
        const self = this;
        const sql = `INSERT INTO answers(password, reward) VALUES(?, ?) `
        return new Promise((res, rej) => {
            bcrypt.genSalt(10, function(err, salt){
                if(err) return rej(err);
                flag(['Add enrty 2, inside gensalt ', salt])
                bcrypt.hash(p, salt, function(hasherr, hash){
                    if(hasherr) return rej(hasherr);
                    flag(['Add entry 3 hash ', hash])
                    self.db.run(sql, [hash, r], function(dberr){
                        if(dberr) return rej(dberr);
                        flag(['Add entry 4 db '])
                        return res(true);
                    })
                })
            })
        })
    }

    attempt(p){
        const sql = `SELECT id, password FROM answers;`;
        return new Promise((rez, rej) => {
            const valids = [];
            let tempRow;
            this.db.each(sql, [], (err, row)=>{
                if(err) return rej(err);
                let valid;
                try {
                    valid = bcrypt.compareSync(p, row.password);
                } catch (error) {
                    console.error(error);
                }
                flag(['l79, checking validity ', valid])
                valids.push(valid);
                tempRow = row;
            }, (reserr, n) =>{
                flag(['l83, in callback bit', valids])
                if(reserr) return rej(reserr);
                if(valids.includes(true)){
                    return rez([true, tempRow]);
                }
                else if(valids.includes(false)) {
                    return rez([false, tempRow]);
                }
            })
        })
    }
}
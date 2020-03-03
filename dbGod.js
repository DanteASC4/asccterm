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

    }

    createTables(){
        this.db.exec(`CREATE TABLE answers ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'password' TEXT NOT NULL, 'reward' TEXT NOT NULL, 'correct_count' INTEGER DEFAULT 0, 'incorrect_count' INTEGER DEFAULT 0);`);
    }

    /**
     * Helper method for addEntry method, runs add entry once
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

    /**
     * gets the current number of correct attempts
     *
     * @param   {number}    entry_id  which entry's correct attempts to retrieve
     *
     * @return  {number}    number of correct attempts
     */
    getCorrectCount(entry_id){
        const sql = `SELECT correct_count FROM answers WHERE id = ?;`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [entry_id], (err, row) => {
                if(err) return reject(err);
                return resolve(row.correct_count)
            })
        });
    }

    /**
     * incremebts correct account
     *
     * @param   {number}  id  id of entry to update.
     *
     * @return  {bool}    true if successfully updates, or error object if it exists.
     */
    async incrementCorrect(id){
        const sql = `UPDATE answers SET correct_count = ? WHERE id = ?;`;
        let currentCount = await this.getCorrectCount(id);
        console.log(`Current count: ${colors.underline.green(currentCount)}`);
        return new Promise((res, rej) => {
            this.db.run(sql, [currentCount++, id], function(err) {
                if(err) rej(err);
                console.log(`Row(s) updated: ${this.changes}`);
            })
        });
    }


    /**
     * gets the current number of incorrect attempts
     *
     * @param   {number}    entry_id  which entry's incorrect attempts to retrieve
     *
     * @return  {number}    number of incorrect attempts
     */
    getIncorrectCount(entry_id){
        const sql = `SELECT incorrect_count FROM answers WHERE id = ?;`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [entry_id], (err, row) => {
                if(err) return reject(err);
                return resolve(row.incorrect_count)
            })
        });
    }

    /**
     * incremebts incorrect account
     *
     * @param   {number}  id  id of entry to update.
     *
     * @return  {bool}    true if successfully updates, or error object if it exists.
     */
    async incrementIncorrect(id){
        const sql = `UPDATE answers SET incorrect_count = ? WHERE id = ?;`;
        let currentCount = await this.getIncorrectCount(id);
        console.log(`Current count: ${colors.underline.green(currentCount)}`);
        return new Promise((res, rej) => {
            this.db.run(sql, [currentCount++, id], function(err) {
                if(err) return rej(err);
                console.log(`Row(s) updated: ${this.changes}`);
                return res(true)
            })
        });
    }


    /**
     * Function to add an entry to the database
     *
     * @param   {string}  p  Password string to be hashed and added to db
     * @param   {string}  r  Reward string to be added to db
     *
     * @return  {void}     returns nothing
     */
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

    /**
     * login attempt method
     *
     * @param   {string}  p  password string to check if valid
     *
     * @return  {bool}     returns either true or false depending on if the password is valid, if error returns the error object
     */
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
                console.log(tempRow);
                if(valids.includes(true)){
                    this.incrementCorrect(tempRow.id);
                    return rez([true, tempRow]);
                }
                else if(valids.includes(false)) {
                    this.incrementIncorrect(tempRow.id)
                    return rez([false, tempRow]);
                }
            })
        })
    }
}
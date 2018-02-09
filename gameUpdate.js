"use latest";
const https = require('https')
const MongoClient = require('mongodb').MongoClient;

const parseGameStart = string => {
    const reg = /([A-Za-z]+)\ at ([A-Za-z]+).*/
    const matches = string.match(reg);

    return {
        updateType: "gameStart",
        teams: [
            matches[1],
            matches[2],
        ],
    };
};

const parseGameFinal = string => {
    const reg = /Final(?:\/OT)?\:\ ([A-Za-z]+)\ ([0-9]+)\ ([A-Za-z]+)\ ([0-9]+).*/;
    const matches = string.match(reg);

    return {
        updateType: "final",
        teams: [
            matches[1],
            matches[3],
        ],
        score: {
            [matches[1]]: matches[2],
            [matches[3]]: matches[4],
        }
    };
};

const gameUpdate = (ctx, done) => {

    const data = ctx.body_raw;
    const { type } = ctx.query;
    const gameData = type === "final" ? 
        parseGameFinal(data) : parseGameStart(data);
    
    MongoClient.connect(ctx.data.MONGO_URL, (err, db) => {
        if(err) return done(err);
        db.collection("games").insertOne(gameData);
        done(null,"Done");
    });
}


module.exports = gameUpdate;

"use latest";
const https = require('https')
const MongoClient = require('mongodb').MongoClient;

const loadGames = async (ctx) => {
    let games = [];
};

const listGames = (ctx, done) => {
    MongoClient.connect(ctx.data.MONGO_URL, (err, db) => {
        if(err) return done(err);
        const cursor = db.collection("games").find().toArray( 
            (err, results) => {
                if(err) return done(err);
                done(null,results);
        });
    });
}


module.exports = listGames;

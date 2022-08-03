
import { MongoClient } from "mongodb";
import * as fs from "fs/promises";

// mongo db client
// poolingのため一応グローバルにしとく
let client;
// db info
let dbInfo = {};

async function init(path) {
    const data = await fs.readFile(path, { encoding: "utf-8" }).then(data => JSON.parse(data));
    const { url, db, collection } = data;
    client = new MongoClient(url);
    dbInfo["db"] = db;
    dbInfo["collection"] = collection;
}

/**
 * Uploads info to mongoDB.
 * info:{
 *   "genre":string,
 *   "assetsDir":string,
 *   "title":string,
 *   "summary":string,
 *   "thumb":string,
 *   "md":string,
 * }
 */
async function insertContent(info) {
    await client.connect();
    const { db: dbName, collection: colName } = dbInfo;
    const db = client.db(dbName);
    const col = db.collection(colName);
    info["posted"] = new Date().toLocaleString({ timeZone: "Asia/Tokyo" });
    const ret = col.insertOne(info);

    //just to make sure connetion is closed after inserting.
    ret.finally(() => {
        console.log("closing!");
        client.close();
    });
    return ret;
}

// Find docs by `_id` descending,from mongoDB.
// Number of docs will be limited by `limit` parameter.
async function findDocs(limit) {
    await client.connect();
    const { db: dbName, collection: colName } = dbInfo;
    const db = client.db(dbName);
    const col = db.collection(colName);
    const ret = col.find().sort({ _id: -1 }).limit(limit).toArray();
    return ret.then(() => ret).finally(() => {
        console.log("closing!");
        client.close()
    });
}

export {
    client, dbInfo, init, insertContent, findDocs,
};
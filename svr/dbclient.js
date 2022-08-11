
import { MongoClient, ObjectId } from "mongodb";
import * as fs from "fs/promises";

// mongo db client
// poolingのため一応グローバルにしとく
let client;
// db info
let dbInfo = {};

async function init(path) {
    const data = await fs.readFile(path, { encoding: "utf-8" }).then(data => JSON.parse(data));
    const { url } = data;
    client = new MongoClient(url);
    dbInfo = data;
}

/**
 * Uploads info to mongoDB. Inserts to `assets` collection.
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
    const col = await getCollection(dbInfo["colAssets"]);
    info["posted"] = localTime();
    const ret = col.insertOne(info);

    //just to make sure connetion is closed after inserting.
    return ret.finally(() => client.close());

}

// Find docs by `_id` descending,from mongoDB.
// Number of docs will be limited by `limit` parameter.
async function findBlogDocs(limit) {
    const col = await getCollection(dbInfo["colAssets"]);
    const ret = col.find().sort({ _id: -1 }).limit(limit).toArray();
    return ret.then(ret => ret).finally(() => client.close());
}

// update likes and dislikes
async function updateImpression(docId, likeCnt, dislikeCnt) {
    const col = await getCollection(dbInfo["colAssets"]);
    const ret = col.updateOne({ _id: ObjectId(docId) }, { $inc: { likes: likeCnt, dislikes: dislikeCnt } });
    return ret.finally(() => client.close());
}

// insert comment to `comment` collection.
async function insertComment(name, comment, repId) {
    const col = await getCollection(dbInfo["colComment"]);
    const postTime = localTime();
    repId = repId || null;
    const maxNo = await col.count();
    const nextNo = maxNo + 1;
    const doc = {
        no: nextNo,
        posted: postTime,
        name: name,
        comment: comment,
        repId: repId,
    }
    const ret = col.insertOne(doc);
    return ret.finally(() => client.close());
}

async function findCommentDocs(limit) {
    //await client.connect();
    const col = await getCollection(dbInfo["colComment"]);
    const ret = col.find().sort({ no: -1 }).limit(limit).toArray();
    return ret.then(ret => ret).finally(() => client.close());
}

// *****************************************
// helper functions
// *****************************************

// don't forget to call client.close() after CRUD operation!
async function getCollection(collectionName) {
    await client.connect();
    const dbName = dbInfo["db"];
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return collection;
}

function localTime() {
    return new Date().toLocaleString({ timeZone: "Asia/Tokyo" });
}


export {
    client, dbInfo, init, insertContent,
    findBlogDocs, updateImpression, insertComment,
    findCommentDocs,
};
import express from "express";
import * as fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import * as mongo from "./svr/dbclient.js";
import { route as admin } from "./route/admin.js";

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await mongo.init("./svr/dbinfo.json");

const STATUS = {
    OK: 0, NG: 1,
};

// blog contents 
app.use(express.static("blogs"));
// client react contents
app.use(express.static(path.join("client/build")));
// use `admin` route.
app.use("/admin", admin);

app.use(express.json());

async function findBlog(dir, blogName) {
    const blogPath = path.join(__dirname, "blogs", dir, blogName);
    try {
        const content = await fs.readFile(blogPath, { encoding: "utf-8" });
        return { "status": STATUS.OK, "content": content };
    } catch (err) {
        console.log(err);
        return { "status": STATUS.NG, "content": "file not found" }
    }

};

app.get("/", (req, res) => {
    const fpath = path.join(__dirname, "client/build", "index.html");
    res.sendFile(fpath)
});

// fetching .md data from server.
app.get("/blog/:dir", async (req, res) => {
    const { dir } = req.params;
    const { page } = req.query;
    if (!page || !dir) {
        return res.status(404).send(`request url is invalid:${req.url}`);
    }
    try {
        const resData = await findBlog(dir, page);
        return res.status(200).json(resData);
    } catch (err) {
        return res.status(500).json(null);
    }
});

// fetching blog info from `blog` db -`assets` collection on mongoDB
app.get("/bloglist", async (req, res) => {
    const list = await mongo.findBlogDocs(15);
    res.json(list);
});

// update likes and dislikes to `blog` db - `assets` collection on mongoDB
app.post("/impress", (req, res) => {
    const { docId, like, dislike } = req.body;
    if (docId === undefined || like === undefined || dislike === undefined) {
        console.log(`/impress: could not update mongo doc. docId:${docId},like:${like},dislike:${dislike}`);
        res.end();
        return;
    }
    mongo.updateImpression(docId, like, dislike);
    res.end();
});

// insert new comment to `blog` db - `comments` collection on mongoDB
app.post("/comment", (req, res) => {
    const { name, comment } = req.body;
    if (name === undefined || comment === undefined) {
        console.log(`/comment could not insert to db. name:${name} comment:${comment}`);
        res.end();
        return;
    }
    mongo.insertComment(name, comment, null).finally(() => res.end());
    // res.end();
});

// get comments from `blog` db - `comments` collection on mongoDB
app.get("/comment-list", async (req, res) => {
    const data = await mongo.findCommentDocs(30);
    return res.json(data);
});

// get update md file
app.get("/updates", async (req, res) => {
    const fpath = path.join(__dirname, "updates", "README.md");
    try {
        const data = await fs.readFile(fpath, { encoding: "utf-8" })
        res.json({ content: data });
    } catch (err) {
        console.log(err);
        res.status(500).send("Can't find requested file!");
    }
});

app.listen(port, () => {
    console.log(`listening on port:${port}`);
});

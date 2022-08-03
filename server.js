import express from "express";
import * as fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATUS = {
    OK: 0, NG: 1,
};

// blog contents 
app.use(express.static("blogs"));
// client react contents
app.use(express.static(path.join("client/build")));

/*
async function findBlog(blogName) {
    const blogPath = path.join(__dirname, "blogs", blogName)
    try {
        const content = await fs.readFile(blogPath, { encoding: "utf-8" });
        return { "status": STATUS.OK, "content": content };
    } catch (err) {
        return { "status": STATUS.NG, "content": "file not found" }
    }

};
*/

async function findBlog(dir, blogName) {
    const blogPath = path.join(__dirname, "blogs", dir, blogName);
    try {
        const content = await fs.readFile(blogPath, { encoding: "utf-8" });
        return { "status": STATUS.OK, "content": content };
    } catch (err) {
        return { "status": STATUS.NG, "content": "file not found" }
    }

};


app.get("/", (req, res) => {
    console.log("root");
    const fpath = path.join(__dirname, "client/build", "index.html");
    res.sendFile(fpath)
});

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

/*
app.get("/blog", async (req, res) => {

    const { page } = req.query;

    if (!page) {
        return res.status(404).json(null);
    }

    try {
        const resData = await findBlog(page);
        return res.status(200).json(resData);
    } catch (err) {
        return res.status(500).json(null);
    }

});
*/

app.listen(port, () => {
    console.log(`listening on port:${port}`);
});

import express from "express";
import { validationResult } from "express-validator";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import { readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { insertContent, deleteManyAssets } from "../svr/dbclient.js";
import { validateUpload } from "../svr/validate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const node_exec_path = path.resolve();
const routePath = path.join(node_exec_path, "admin_client");

const route = express.Router();
// node の実行パスが起点になるので注意!
route.use(express.static("admin_client", { index: false }));

route.use(express.urlencoded({ extended: true }));
route.use(fileUpload());

route.get("/", (req, res) => {
    const html = path.join(routePath, "index.html");
    res.sendFile(html);
});

// 構築中。サーバ側のフォルダを削除する。いらないかも
// 修正用に上書きする機能を作った方が良い。
route.get("/delete-post", (req, res) => {
    const html = path.join(routePath, "deletePost.html");
    res.sendFile(html);
});

route.get("/conf", async (req, res) => {
    const root = path.resolve();
    const confFile = path.join(root, "route", "conf.json");
    const raw = await readFile(confFile, { encoding: "utf-8" });
    const data = await JSON.parse(raw);
    res.send(data);
});

route.post("/content", validateUpload, async (req, res) => {
    //[reminder]
    //req.body => non-file inputs
    //req.files => upload files.
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ message: err.array() });
    }
    //root directory to upload images.
    const root = "blogs";
    // ! urlencoded. NOT json. @interface:{"genre":string,"assetsDir":string,"title":string,"summary":string,"thumb":string,"md":string},
    // express-validatorでescapeすると"/"が&#x2F;に置換されるので、元に戻す。
    const assetsDir = req.body.assetsDir.replace(/&#x2F;/g, "/");

    const targDir = `${root}/${assetsDir}`;
    const force = req.body.force === "true";
    const isExists = existsSync(targDir);

    // 上書き禁止モードで、既にフォルダが存在する場合はエラー
    if (!force && isExists) {
        return res.status(500).send(`${targDir} already exists!`);
    }

    // make directory 既に存在する場合は作成しない。
    if (!isExists) {
        try {
            await mkdir(targDir);
        } catch (err) {
            console.log(err);
            res.status(500).send(`failed to mkdir:${targDir}`);
            return;
        }
    }

    // upload files to server.
    const status = upload(req, targDir);
    if (!status.ok()) {
        res.status(500).send(status.msg);
        return;
    }

    // finally, insert info to MongoDB
    // 上書き（同じフォルダ名が存在している）の場合、同じassetsDirのドキュメントがassetsコレクションに存在するので、削除する。
    if (isExists) {
        try {
            await deleteManyAssets({ assetsDir: assetsDir });
        } catch (err) {
            console.log(err);
            res.status(500).send(`failed to delete document from assets collection. filter-> assetsDir:${assetsDir}`);
            return;
        }
    }

    const infoJson = {
        "genre": req.body.genre,
        "assetsDir": req.body.assetsDir,
        "title": req.body.title,
        "summary": req.body.summary,
        "thumb": req.body.thumb,
        "md": req.body.md,
        "likes": 0,
        "dislikes": 0,
    };

    try {
        insertContent(infoJson);
    } catch (e) {
        console.log(e);
        res.status(500).send("Could not insert data to mongoDB");
        return;
    }

    res.status(200).send(status.msg);
});

/**
 * @param {0:ok,1:error} code 
 * @param {message to send back to client} msg 
 * @returns Status;
 */
export function Status(code, msg) {
    this.status = code;
    this.msg = msg;
}
Status.prototype.ok = function () {
    return this.status === 0;
};


/**
 * Upload files to server storage.
 * @param {express.Request} req 
 * @param {[string] Directory to save assests.} dir 
 * @returns Status
 */
export function upload(req, dir) {
    if (!req) {
        return new Status(1, "req is undefied");
    }

    if (!req.files) {
        return new Status(1, "no files uploaded");
    }

    let files = req.files.uploads;

    if (!files) {
        return new Status(1, "req.files.uploads is undefined");
    }
    if (!Array.isArray(files)) {
        files = [files];
    }

    try {
        for (const file of files) {
            const name = file.name;
            file.mv(`${dir}/${name}`);
        }
    } catch (err) {
        console.log(err);
        return new Status(1, "something went wrong");
    }
    return new Status(0, "upload succeeded!");
}

export { route };
import express from "express";
import fileupload from "express-fileupload";
import { fileURLToPath } from "url";
import path from "path";
import { makeFolder, zipFiles } from "./cropper_src/helper.js";
import { validateCropperUpload } from "../svr/validate.js";
import { validationResult } from "express-validator"
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const node_exec_path = path.resolve()
const routePath = path.join(node_exec_path, "content", "cropper")

const route = express.Router();
route.use(express.static("content/cropper", { index: false }));
route.use(express.urlencoded({ extended: true }));
route.use(fileupload());

route.get("/", (req, res) => {
    const html = path.join(routePath, "index.html");
    return res.sendFile(html);
});

// req.body -> {"ratio":string,"resize":string,"width":string}
// req.files -> file|file[]
route.post("/upload", validateCropperUpload, async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ message: err.array() });
    }
    const { ratio, resize, width } = req.body;
    if (!(req.files && req.files.pics)) {
        return res.status(400).send("You need to upload image(s).")
    }

    let files = req.files.pics;
    if (!Array.isArray(files)) {
        files = [files];
    }

    const data = await makeFolder();

    if (data === 1) {
        return res.status(500).send(data.msg);
    }

    //画像を保存するフォルダ名
    const targDir = data.msg;

    const proms = [];
    for (const file of files) {
        // 画像データ　-> file.data
        // フルパスで画像を保存。
        const fpath = path.join(targDir, file.name);
        const prom = new Promise((res, rej) => {
            file.mv(fpath);
            res("done");
        });
        proms.push(prom);
    }

    // 保存が全て成功したら圧縮処理。
    Promise.all(proms)
        .then(async vals => {
            try {
                await zipFiles(targDir, ratio, resize, width);
                const dlfile = targDir + ".zip";
                try {
                    return res.status(200).download(dlfile);
                } catch (err) {
                    return res.status(500).send("Something went wrong..Try later");
                }
            } catch (err) {
                return res.status(500).send("Something went wrong..Try later.")
            }
        })
        .catch(e => res.status(500).send("Something went wrog..Try later."));
});

export { route };
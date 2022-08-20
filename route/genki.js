import path from "path";
import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { api } from "./genki_src/api.js";
import { swapSide } from "./genki_src/apihelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const route = express.Router();
const svrSrc = "genki_src";

function defaultResolve(thisResponse, apiResponse) {
    if (apiResponse) {
        return thisResponse.json(apiResponse);
    } else {
        return thisResponse.json(null);
    }
}

route.use(express.json());

route.use(express.static("content/genkidama", { index: false }));

route.get("/", (req, res) => {
    const nodePath = path.resolve();
    const routePath = path.join(nodePath, "content", "genkidama");
    const html = path.join(routePath, "index.html");
    res.sendFile(html);
});

route.get("/story", (req, res) => {
    const dir = path.join(__dirname, svrSrc, "story");
    const proms = [];
    fs.readdir(dir, (err, data) => {
        if (err) throw err;
        for (const file of data) {
            if (file.startsWith("story") && file.endsWith(".json")) {
                /**retrieve index from filename. filename ex ->story1.json */
                const index = parseInt(file.slice(-6, -5));
                const filepath = path.join(dir, file);
                const prom = new Promise((resolve, reject) => {
                    const content = fs.promises.readFile(filepath, "utf8");
                    content.then(_data => {
                        const stories = JSON.parse(_data).map(elem => elem["msg"]);
                        resolve({ index: index, stories: stories });
                    });
                });
                proms.push(prom);
            }
        }
        Promise.all(proms)
            .then(stories => res.json(stories))
            .catch(err => {
                console.log(err);
            });
    });
});

route.get("/ticker", (req, res) => {
    api("ticker")
        .then(apires => defaultResolve(res, apires))
        .catch(err => console.log(err))
});

route.get("/valuation", (req, res) => {
    api("margin")
        .then(apires => defaultResolve(res, apires))
        .catch(e => console.log(e));
});

route.get("/positions", (req, res) => {
    const params = req.query;
    api("positions", { "params": params, "keys": ["list"] })
        .then(apires => defaultResolve(res, apires))
        .catch(e => console.log(e));
});


route.post("/exec", (req, res) => {
    const { pair, side, amt, pwd } = req.body;

    /**some check? */

    /**open */
    api("order", {
        body: {
            "symbol": pair,
            "side": side,
            "executionType": "MARKET",
            "size": amt
        }
    })
        .then((orderId) => {
            if (orderId) {
                const opt = { params: { "orderId": orderId }, keys: ["list"] };
                api("executions", opt)
                    .then(data => {
                        //正常
                        const id = data[0]["positionId"];
                        let params;
                        if (id) {
                            params = { "positionId": id }
                        } else {
                            params = null;
                        }
                        return res.json(params);
                    })
                    .catch(err => {
                        //建玉ID取得失敗
                        console.trace(err);
                        return res.json(null);
                    });
            } else {
                return res.json(null);
            }
        })
        .catch(err => {
            console.trace(err)
            res.json({ "status": NOT_OK, "msg": "取引に失敗しました。時間をおいて試してください。" });
        });
});

route.post("/close", (req, res) => {
    //"pair":symbol,"side":side,"amt":size,"id":id
    const { pair, side, amt, id } = req.body;
    const body = {
        "symbol": pair,
        "side": swapSide(side),
        "executionType": "MARKET",
        "settlePosition": [{
            "positionId": id,
            "size": amt
        }]
    };
    api("close", { body: body })
        .then(data => {
            if (data)
                res.json({ "message": "SUCCESS! Thank you!", "orderId": data })
            else
                res.json(null);
        })
        .catch(err => console.trace(err));
});


export { route };
import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { mkdir } from "fs";
import { fileURLToPath } from "url";
import { execPath } from "process";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//このスクリプトのパスを起点に画像格納フォルダを指定
const IMG_FOLDER = path.join(__dirname, "images");
// pythonスクリプトのフルパス
const PYSCRIPT = path.join(__dirname, "py", "main.py");

function formatDigit(num) {
    if (num < 10) {
        return '0' + num.toString();
    }
    return num.toString();
}

function formattedDate() {
    const d = new Date();
    const year = d.getFullYear().toString();
    const month = formatDigit(d.getMonth() + 1);
    const date = formatDigit(d.getDate());
    const hour = formatDigit(d.getHours());
    const min = formatDigit(d.getMinutes());
    const sec = formatDigit(d.getSeconds());
    return year + month + date + "_" + hour + min + sec;
}

export async function makeFolder() {
    const folname = formattedDate();
    const targDir = path.join(IMG_FOLDER, folname);
    try {
        await fs.mkdir(targDir);
        return { status: 0, msg: targDir };
    } catch (err) {
        return { status: 1, msg: `failed to make folder :${targDir}` };
    }
}

// call makeFolder beforehand.
export function zipFiles(targDir, ratio, resize, width) {
    // python scriptをcommand line arguments付きで呼び出す
    const pycmd = process.env.NODE_ENV === "production" ? "python3" : "python";
    const py = spawn(pycmd, [PYSCRIPT, targDir, ratio, resize, width]);
    // pythonの出力があればnodeのコンソールに出力
    py.stdout.on("data", data => console.log(data.toString()));

    // python処理が終わった時にresolveするプロミス。spawnを同期するため。
    const p = new Promise((res, rej) => {
        py.on("close", data => {
            res(data);
        })
    });
    return p;
}



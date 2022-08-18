
/*DESCRIPTION
ZEN-Blog-Systemは1.サーバの配置　2.パス情報等のDB登録を自動化する
画面でサーバの保存先を指定し、mdファイルや画像データをアップロードする。
画面の入力値はDBに登録され、Reactで使う。
*/

const imageExtension = [
    "jpg", "JPG", "jpeg", "JPEG", "png", "PNG",
    "gif", "GIF", "tif", "TIF", "tiff", "TIFF",
];

// 選択可能なジャンルをプルダウンにセット。
// デフォルトパスを項目にセット
// アップロードファイルからサムネを選べる処理を選択
function init(conf) {
    const { defaultPath, genre } = conf;
    setDefaultPath(defaultPath);
    setGenre(genre);
    setGetFilenameEvent();
    setSubmitEvent(defaultPath);
    //setThumb(savePath);
};

function checkThumbnailName() {
    const thumbNode = document.querySelector(".thumb");
    const thumbVal = thumbNode.value;
    const filesNode = document.querySelector(".upload");
    const files = filesNode.files;
    // サムネ無しの場合はエラーにしない
    if (thumbVal.length === 0) {
        return true;
    }

    // 画像の拡張子でなかったらエラー。
    let ext = thumbVal.split(".");
    if (ext.length === 1) {
        // 長さ１の時は"."が存在しない場合なのでエラー
        alert(`${ext} に拡張子がついていません！`)
        return false;
    }
    ext = ext.slice(-1)[0];
    if (!imageExtension.includes(ext)) {
        alert(`${ext}　は画像の拡張子ではありません！`);
        return false;
    }

    for (const file of files) {
        if (file.name === thumbVal) {
            return true;
        }
    }
    alert("サムネのファイル名がアップロードファイルの中にありません！");
    return false;
}

function checkDoesMdExists() {
    const fnode = document.querySelector(".upload");
    const files = fnode.files;
    for (const file of Array.from(files)) {
        if (file.name.slice(-3) === ".md") {
            //ok なら隠しformに値をセット
            setMdFilename(file.name);
            return true;
        }
    }
    return false;
}

function checkSaveDir(root) {
    const inputDir = document.querySelector(".assetsDir").value;
    if (root === inputDir) {
        alert("保存先のフォルダが初期値のままです。フォルダを入力してください！");
        return false; // ok-> true cancel -> false
    }
    return true;
}

function setMdFilename(name) {
    const node = document.querySelector(".md--filename");
    node.value = name;
}

function setSubmitEvent(savePath) {
    const sub = document.querySelector(".form");
    sub.addEventListener("submit", e => {
        // サムネがアップロードファイルの中に含まれない場合submitしない
        if (!checkThumbnailName()) {
            e.preventDefault();
            return false;
        }
        // .mdファイルが無い場合はsubmitしない。
        if (!checkDoesMdExists()) {
            alert(".mdファイルがアップロードされてません！");
            e.preventDefault();
            return false;
        }
        // 保存先のフォルダが入力されているか
        if (!checkSaveDir(savePath)) {
            e.preventDefault();
            return false;
        }
        // No Errors here! Resoures will be submitted automatically.
        // set md filename to a hidden form field.
    });
}

function removeBySelector(selector) {
    const nodes = document.querySelectorAll(selector);
    Array.from(nodes).forEach(node => node.remove());
}

// アップロードに選択したファイル名をボタンとして表示。
// クリックするとサムネに自動セット
function setGetFilenameEvent() {
    const node = document.querySelector(".upload--details");
    const className = "btn--filename";
    node.addEventListener("click", e => {
        removeBySelector("." + className);
        const filesNode = document.querySelector(".upload");
        const files = filesNode.files;
        const ul = document.createElement("ul");
        for (const file of files) {
            const btn = document.createElement("button");
            btn.className = className;
            btn.addEventListener("click", e => {
                e.preventDefault();
                setThumb(file.name);
            });
            btn.textContent = file.name;
            ul.appendChild(btn);
        }
        const parent = document.querySelector(".section--uploads")
        parent.appendChild(ul);
    });
}

// デフォルトパスをセット
function setDefaultPath(path) {
    const node = document.querySelector(".assetsDir");
    node.value = path;
}

// ジャンルのプルダウンをセット
function setGenre(genreList) {
    const sel = document.querySelector(".genre");
    sel.value = genreList[0];
    for (const genre of genreList) {
        const node = document.createElement("option");
        node.value = genre;
        node.textContent = genre;
        sel.appendChild(node);
    }
}

// サムネのファイル名をセット
function setThumb(fname) {
    const node = document.querySelector(".thumb");
    node.value = fname;
}

// サーバからデフォルトパスやジャンル等の基礎情報をfetch
window.addEventListener("load", e => {
    fetch("/admin/conf")
        .then(res => res.json())
        .then(data => {
            init(data);
        })
        .catch(err => console.log(err));
});
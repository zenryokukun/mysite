import { useState, useEffect } from "react";
import { compiler } from "markdown-to-jsx";

// 初回のみサーバからデータ取得してグローバル変数に入れとく。
// 2回目以降はここから取得。
let jsx: JSX.Element;

function Updates() {
  const [content, setContent] = useState(jsx);
  useEffect(() => {
    if (jsx) return; //2回目以降はjsxから展開するのでリターン
    fetch("/updates")
      .then(raw => raw.json())
      .then(data => {
        const toJsx = compiler(data.content, { wrapper: null });
        setContent(toJsx);
        jsx = toJsx;
      })
      .catch(err => console.log(err));
  }, []);
  return <article className="updates__wrapper">{jsx}</article>
}

export default Updates;
import React from "react";

function Production() {
  /*
   const submitForm = (e: React.MouseEvent<HTMLElement>, dir: string) => {
     e.preventDefault();
     const form: HTMLFormElement | null = document.querySelector(".hidden__form");
     if (!form) return;
     form.action = dir;
     form.submit();
   };
 */
  return (
    <div className="production__container">
      {/*<form action="" method="post" className="hidden__form" target="_blank"></form>*/}
      <div className="product__wrapper">
        <div className="product__content">
          <div className="product__img__wrapper--genki">
          </div>
          {/*
          <h1 className="product__title">
            <a className="product__link" href="#!" onClick={(e) => submitForm(e, "/genkidama")}>元気玉</a>
          </h1>
           */}

          <h1 className="product__title">
            <a className="product__link" href="/genkidama">元気玉</a>
          </h1>

          <p className="product__description">
            仮想通貨取引所。たとえ見た目はしょぼくても、私の知りうる全てを注ぎ込みました。
            まさにブリーディングでカッティングなエッジ、正真正銘のフラッグシップなのであります。
            私をお金持ちにしてください。
          </p>
        </div>
      </div>
      <div className="product__wrapper">
        <div className="product__content">
          <div className="product__img__wrapper--mario">
          </div>
          <h1 className="product__title">
            <a className="product__link" href="/mario">MARIMO</a>
          </h1>
          <p className="product__description">
            マリモがノコノコやクリボーをつぶしてコインを取るだけのゲーム。PCオンリーです。
          </p>
        </div>
      </div>
      <div className="product__wrapper">
        <div className="product__content">
          <div className="product__img__wrapper--cropper">
          </div>
          <h1 className="product__title">
            <a className="product__link" href="/cropper">スマホ画像切取君</a>
          </h1>

          <p className="product__description">
            スマホの縦長画像を9:16,2:3,3:2,1:1いずれかのアスペクト比で適当に切り取ってくれます。
          </p>
        </div>
      </div>
    </div>
  );
}

export default Production;
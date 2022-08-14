import React from "react";
//@ts-ignore
import Image from "./Image.tsx";
// @ts-ignore
import { Cname, Text } from "./intefaces.ts";

const texts = [
  `気が付けば、会社に勤めて10年以上。長い間組織の意思の基に行動し、
    自らの考えや感性は希薄になってきたように感じます。
    組織視点の効率性や合理性より、人としての正しさを追及すべきではないのか？
    そう思いつつ漫然と日々を過ごし、いつの間にか自分が良く分からなくなってしまいました。
    `
  ,
  `
    普段自分が行っていること、ふと思ったことを人に伝える機会がありませんので、文明の力を借りて、ここに記していきたいと思います。
    初めは就職してから今にいたるまでの旅行記を中心に展開します。趣味はプログラムを作ることですので、出来が悪くてもなるべく
    形に残るよう、ここにリンクを貼っていきます。Homeは電波が飛んでいますが、案外気さくな人間なので気軽に絡んでください。
    `
];

class About extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="about">
        <Image src="hakata.JPG" alt="torii in hakata" cname="about__wrapper__content about__image" />
        <div className="about__wrapper__content about__text" >
          <h1 className="about__text__title">自己紹介</h1>
          <TextContent cname="about__text--content" text={texts[0]} />
        </div>
        <Image src="hakodate.JPG" alt="torii in hakodate" cname="about__wrapper__content about__image" />
        <div className="about__wrapper__content about__text" >
          <h1 className="about__text__title">目的</h1>
          <TextContent cname="about__text--content" text={texts[1]} />
        </div>
        <Image src="yashima.JPG" alt="torii in kagawa" cname="about__wrapper__content about__image" />
        <div className="about__wrapper__content about__text" >
          <h1 className="about__text__title">好き</h1>
          <ul>
            <li>生姜、ミョウガ、九条葱、柚子胡椒</li>
            <li>駅そば・うどん</li>
            <li>電車、神社仏閣、田舎駅
            </li>
            <li>野鳥</li>
          </ul>
        </div>
      </div>
    );
  }
}

class TextContent extends React.Component<Cname & Text> {
  render(): React.ReactNode {
    const { cname, text } = this.props;
    return <div className={cname}>{text}</div>
  }
}

export default About;
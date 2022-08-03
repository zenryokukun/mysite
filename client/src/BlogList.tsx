import React from "react";
import BlogContent from "./BlogContent";
import { None, Mode, URL } from "./interfaces";

interface ResData {
  title: string,
  summary: string, //summary of content
  thumb: string, //thumbnail image path,
  when: string, //date of post.
  url: string // link to md file.
}

interface DerivedFunc {
  derivedFunc: (mode: number, url: string) => void
}

type dfunc = (mode: number, url: string) => void;

const res: ResData[] = [
  { url: "/blog/201102_1?page=page2.md", summary: "Hello,world.I Traveled Kyushu for the first time in my life. It was in Feburuary of 2011. It was super fun and exciting and I had a absolute blast there. People were kind, and food was great. Also, the ocean and mountains in Nagasaki was beautiful. Not to mention the fascinating history. In fact, Kyushu has one of the longest history in Japan. There are a lot of volcanoes,too.", thumb: "thumb.jpg", when: "2022-07-27", title: "初めての九州" },
  // { url: "/blog?page=page1.md", summary: "あいうえおかきくけこ", thumb: "hakata-station.jpg", when: "2022-07-26", title: "テスト" },
  // { url: "/blog?page=page3.md", summary: "あいうえおかきくけこ", thumb: "", when: "2022-07-26", title: "" },
  // { url: "", summary: "あいうえおかきくけこ", thumb: "", when: "2022-07-26", title: "" },
  // { url: "", summary: "あいうえおかきくけこ", thumb: "", when: "2022-07-26", title: "" },
  // { url: "", summary: "あいうえおかきくけこ", thumb: "", when: "2022-07-26", title: "" },
];

const BLOG_MODE = {
  LIST: 0, CONTENT: 1,
};

class BlogList extends React.Component<None, Mode & URL> {

  constructor(props: None) {
    super(props);
    this.state = { mode: BLOG_MODE.LIST, url: "" };
  }

  readClick = (mode: number, url: string) => {
    this.setState({ mode: mode, url: url });
  }

  backClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.setState({ mode: BLOG_MODE.LIST, url: "" });
  }

  render(): React.ReactNode {
    /*TODO
      Add `fetch` to get the actual blog list.
    */
    const { mode, url } = this.state;
    return (
      mode === BLOG_MODE.LIST ?
        <div className="blog__section">
          <div className="blog__list" >
            {res.map((data, i) => <BlogLink {...data} derivedFunc={this.readClick} key={i} />)}
          </div >
        </div> :
        <BlogContent url={url} derivedFunc={this.backClick} />
    );
  }
}

class BlogLink extends React.Component<ResData & DerivedFunc> {

  clicked = (url: string, fn: dfunc) => {
    if (url.length === 0) {
      return;
    }
    fn(BLOG_MODE.CONTENT, url);
  }

  render(): React.ReactNode {
    const { when, summary, title, url, derivedFunc } = this.props;
    const thumb = this.props.thumb ? this.props.thumb : "zen_logo.png";
    const thumbClassName = this.props.thumb ? "blog__link__img" : "blog__link__img--logo";

    return (
      <div className="blog__link__wrapper">
        <div className="blog__link__img__wrapper">
          <img className={thumbClassName} src={thumb} alt="thumbnail" />
        </div>
        <h3 className="blog__link__when">{when}</h3>
        <div className="blog__link__desc">
          <h2 className="blog__link__title">{title}</h2>
          <p className="blog__link__summary">{summary}</p>
        </div>
        <button className="blog__link__read" onClick={() => this.clicked(url, derivedFunc)}>Read</button>
      </div>
    );
  }
}

export default BlogList;
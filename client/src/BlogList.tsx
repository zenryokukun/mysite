import React from "react";
import BlogContent from "./BlogContent";
import { None, Mode, URL } from "./interfaces";
/*
interface ResData {
  title: string,
  summary: string, //summary of content
  thumb: string, //thumbnail image path,
  when: string, //date of post.
  url: string // link to md file.
}
*/
interface DbData {
  _id: object,
  genre: string,
  assetsDir: string,
  title: string,
  summary: string,
  thumb: string,
  md: string,
  posted: string,
}

interface DerivedFunc {
  derivedFunc: (mode: number, url: string) => void
}

type dfunc = (mode: number, url: string) => void;
/*
const res: ResData[] = [
  { url: "/blog/201102_1?page=page2.md", summary: "Hello,world.I Traveled Kyushu for the first time in my life. It was in Feburuary of 2011. It was super fun and exciting and I had a absolute blast there. People were kind, and food was great. Also, the ocean and mountains in Nagasaki was beautiful. Not to mention the fascinating history. In fact, Kyushu has one of the longest history in Japan. There are a lot of volcanoes,too.", thumb: "thumb.jpg", when: "2022-07-27", title: "初めての九州" },
  // { url: "/blog?page=page1.md", summary: "あいうえおかきくけこ", thumb: "hakata-station.jpg", when: "2022-07-26", title: "テスト" },
  // { url: "/blog?page=page3.md", summary: "あいうえおかきくけこ", thumb: "", when: "2022-07-26", title: "" },
  // { url: "", summary: "あいうえおかきくけこ", thumb: "", when: "2022-07-26", title: "" },
  // { url: "", summary: "あいうえおかきくけこ", thumb: "", when: "2022-07-26", title: "" },
  // { url: "", summary: "あいうえおかきくけこ", thumb: "", when: "2022-07-26", title: "" },
];
*/

const BLOG_MODE = {
  LIST: 0, CONTENT: 1, LOAD: 2,
};

class BlogList extends React.Component<None, Mode & URL> {

  dbdata: DbData[]

  constructor(props: None) {
    super(props);
    this.state = { mode: BLOG_MODE.LOAD, url: "" };
    this.dbdata = [];
    this.getBlogInfo();
  }

  readClick = (mode: number, url: string) => {
    this.setState({ mode: mode, url: url });
  }

  backClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.setState({ mode: BLOG_MODE.LIST, url: "" });
  }

  async getBlogInfo() {
    try {
      const raw = await fetch("/bloglist");
      this.dbdata = await raw.json();
      // ****** TODO ******
      // setState to render Load Failed Component, when this.dbdata.length === 0.
      this.setState({ mode: BLOG_MODE.LIST, url: "" });

    } catch (e) {
      // ****** TODO ******
      // setState to render Load Failed Component
      console.log(e);
      return;
    }
  }

  render(): React.ReactNode {
    /*TODO
      - Add `fetch` to get the actual blog list.
      - Add `Loading` Component
      - Add `Load Failed` Component
    */
    const { mode, url } = this.state;
    const dbdata = this.dbdata;

    return (
      mode === BLOG_MODE.LIST ?
        <div className="blog__section">
          <div className="blog__list" >
            {dbdata.map((data, i) => <BlogLink {...data} derivedFunc={this.readClick} key={i} />)}
          </div >
        </div>
        : mode === BLOG_MODE.CONTENT ?
          <BlogContent url={url} derivedFunc={this.backClick} />
          : <div>LOADING...</div>
    );
  }
}

class BlogLink extends React.Component<DbData & DerivedFunc>{

  apiEndPoint: string = "/blog"
  queryParam: string = "page"

  clicked = (url: string, fn: dfunc) => {
    if (url.length === 0) {
      return;
    }
    fn(BLOG_MODE.CONTENT, url);
  }

  render(): React.ReactNode {
    const { posted, summary, title, assetsDir, derivedFunc, md } = this.props;
    const thumb = this.props.thumb ? this.props.thumb : "zen_logo.png";
    const thumbClassName = this.props.thumb ? "blog__link__img" : "blog__link__img--logo";
    const query = `${this.apiEndPoint}/${assetsDir}?${this.queryParam}=${md}`;
    console.log(query);
    return (
      <div className="blog__link__wrapper">
        <div className="blog__link__img__wrapper">
          <img className={thumbClassName} src={thumb} alt="thumbnail" />
        </div>
        <h3 className="blog__link__when">{posted}</h3>
        <div className="blog__link__desc">
          <h2 className="blog__link__title">{title}</h2>
          <p className="blog__link__summary">{summary}</p>
        </div>
        <button className="blog__link__read" onClick={() => this.clicked(query, derivedFunc)}>Read</button>
      </div>
    );
  }
}

export default BlogList;
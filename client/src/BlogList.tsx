import React from "react";
import BlogContent from "./BlogContent";
import { None, Mode, URL } from "./interfaces";
import Loader from "./Loader";

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

const BLOG_MODE = {
  LIST: 0, CONTENT: 1, LOAD: 2,
};

// 毎回DBから取得するのを防止するため、グローバル変数にしておく。
// BlogListのfieldにするとレンダー時に初期化されてしまい、毎回DBに取りに行くので、、、
let dbLoaded = false;
let dbData: DbData[]

class BlogList extends React.Component<None, Mode & URL> {

  constructor(props: None) {
    super(props);
    const mode = dbData ? BLOG_MODE.LIST : BLOG_MODE.LOAD;
    this.state = { mode: mode, url: "" };

    if (!dbLoaded) {
      this.getBlogInfo();
      dbLoaded = true;
    }
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
      dbData = await raw.json();
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

    return (
      mode === BLOG_MODE.LIST ?
        <div className="blog__section">
          <div className="blog__list" >
            {dbData.map((data, i) => <BlogLink {...data} derivedFunc={this.readClick} key={i} />)}
          </div >
        </div>
        : mode === BLOG_MODE.CONTENT ?
          <BlogContent url={url} derivedFunc={this.backClick} />
          : <Loader text="ナウ、ローディン．．．"></Loader>
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
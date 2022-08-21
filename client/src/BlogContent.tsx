import React from "react";
//@ts-ignore;
import { URL } from "./interfaces.tsx";
import { compiler } from "markdown-to-jsx";
import { StockIcon } from "./Icon";
import { ICON } from "./constants";
import Loader from "./Loader";
import Likes from "./Likes";

interface Content {
  content: string,
}

interface Counts {
  likes: number,
  dislikes: number,
}

interface Dfunc {
  derivedFunc: (e: React.MouseEvent<HTMLElement>) => void,
}

// blog content you get from the BlogList link.
class BlogContent extends React.Component<URL & Dfunc & Counts, Content> {

  // loaded: boolean

  //URL contains a link of `.md` file.
  constructor(props: URL) {
    super(props);
    // this.loaded = false;
    this.state = { content: "" };
    this.loadPage(props.url);
  }

  async loadPage(url: string) {
    try {
      const res: Response = await fetch(url);
      if (!res.ok) {
        console.log("res not ok!")
        return;
      }

      const data = await res.json();
      // this.loaded = true;
      this.setState({ content: data.content });
    } catch (e) {
      console.log(e)
    }
  }

  render(): React.ReactNode {
    const elems = compiler(this.state.content, { wrapper: "article" });
    const { docId, derivedFunc, likes, dislikes, localUpdate } = this.props;
    // const { loaded } = this;
    const loaded = this.state.content.length > 0
    if (loaded) {
      return (
        <>
          {elems}
          <a href={ICON.BACK.LINK} className="back__icon" onClick={derivedFunc}><StockIcon cname={ICON.BACK.STYLE} /></a>
          <Likes docId={docId} likes={likes} dislikes={dislikes} localUpdate={localUpdate}></Likes>
        </>
      );
    } else {
      return <Loader text="ナウ、ローディン．．．"></Loader>
    }
  }
}


export default BlogContent;
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

interface Dfunc {
  derivedFunc: (e: React.MouseEvent<HTMLElement>) => void,
}

// blog content you get from the BlogList link.
class BlogContent extends React.Component<URL & Dfunc, Content> {

  loaded: boolean

  //URL contains a link of `.md` file.
  constructor(props: URL) {
    super(props);
    this.loaded = false;
    this.state = { content: "" };
    this.loadPage(props.url);
  }

  async loadPage(url: string) {
    const res: Response = await fetch(url);
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    this.loaded = true;
    this.setState({ content: data.content });
  }

  render(): React.ReactNode {
    const elems = compiler(this.state.content, { wrapper: "article" });
    const { derivedFunc } = this.props;
    const { loaded } = this;
    if (loaded) {
      return (
        <>
          {elems}
          <a href={ICON.BACK.LINK} className="back__icon" onClick={derivedFunc}><StockIcon cname={ICON.BACK.STYLE} /></a>
          <Likes></Likes>
        </>
      );
    } else {
      return <Loader text="ナウ、ローディン．．．"></Loader>
    }
  }
}

// Posted comments.
class Comments extends React.Component {
  render(): React.ReactNode {
    return <div></div>
  }
}

// Form to post a comment.
class CommentForm extends React.Component {
  render(): React.ReactNode {
    return (
      <form action="/post-comment" method="post" encType="application/x-www-form-urlencoded">
        <div>
          <label for="name">
            <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label for="comment">
            <textarea name="comment" cols={30} rows={10}></textarea>
          </label>
        </div>
      </form >
    );
  }
}

export default BlogContent;
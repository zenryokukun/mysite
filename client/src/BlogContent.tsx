import React from "react";
//@ts-ignore;
import { URL } from "./interfaces.tsx";
import { compiler } from "markdown-to-jsx";
import { StockIcon } from "./Icon";
import { ICON } from "./constants";

interface Content {
  content: string,
}

interface Dfunc {
  derivedFunc: (e: React.MouseEvent<HTMLElement>) => void,
}

// List of blog links.
// UNDER CONSTRUCTION!!!!
/*
class BlogList extends React.Component<URL> {
  constructor(props: URL) {
    super(props);
    this.state = { data: [] };
    this.loadList(props.url);
  }

  async loadList(url: string) {
    const res: Response = await fetch(url);
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    this.setState({ data: data });
  }

  render(): React.ReactNode {
    return <></>
  }
}
*/

// blog content you get from the BlogList link.
class BlogContent extends React.Component<URL & Dfunc, Content> {

  //URL contains a link of `.md` file.
  constructor(props: URL) {
    super(props);
    this.state = { content: "" };
    this.loadPage(props.url);
  }

  async loadPage(url: string) {
    const res: Response = await fetch(url);
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    this.setState({ content: data.content });
  }

  render(): React.ReactNode {
    const elems = compiler(this.state.content, { wrapper: "article" });
    const { derivedFunc } = this.props;
    return (
      <>
        {elems}
        <a href={ICON.BACK.LINK} className="back__icon" onClick={derivedFunc}><StockIcon cname={ICON.BACK.STYLE} /></a>
      </>
    );
  }
}

/*
function MdImage(children: any, ...props: any[]) {
  // @ts-ignore;
  const { src, title, alt, className } = props;
  return (
    <div className={className}>
      <img src={src} alt={alt} title={title} />
    </div>
  );
}
*/
export default BlogContent;
import React from "react";
import ReactDOM from "react-dom/client";
// @ts-ignore
import Menu from "./Menu.tsx";
//@ts-ignore
import { Home, TopMessage } from "./Home.tsx";
// @ts-ignore
import { Mode, None } from "./interfaces.ts";
//@ts-ignore
import Footer from "./Footer.tsx";
//@ts-ignore
import About from "./About.tsx";

import { MODE } from "./constants.js";
import BlockList from "./BlogList";

class App extends React.Component<None, Mode> {

  constructor(props: Mode) {
    super(props);
    this.state = { mode: MODE.HOME };
  }

  menuClicked = (e: React.MouseEvent<HTMLElement>, mode: number): void => {
    this.setState({ mode: mode });
  };

  render(): React.ReactNode {
    const { mode } = this.state;
    return (
      <div>
        <Menu click={this.menuClicked} />
        <Content mode={mode} />
        <Footer />
      </div>
    );
  }
}


class Content extends React.Component<Mode, None> {

  render(): React.ReactNode {
    const { mode } = this.props;
    return (
      <div className="content">
        {mode === MODE.HOME && <><TopMessage /><Home /></>}
        {/*
        mode === MODE.BLOG && <BlogContent url="/blog?page=page2.md" />
        */}
        {mode === MODE.BLOG && <BlockList />}
        {mode === MODE.ABOUT && <About />}
        {mode === MODE.CONTACT && <div>CONTACT</div>}
      </div>
    );
    /*
    if (mode === MODE.HOME) {
      return <div className="content"><TopMessage /><Home /></div>;
    }
    if (mode === MODE.BLOG) {
      return <h1>HELLO IT'S A TEST BLOG!</h1>
    }
    */
  }
}


/*entry point */
function main(): void {
  const _root = document.getElementById("root");
  if (!_root) {
    throw new Error(`Your root was not found:${_root}`);
  }
  const root = ReactDOM.createRoot(_root);
  root.render(<App />)
}

main();
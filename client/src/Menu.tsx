import React from "react";
import "./index.css";
//@ts-ignore
import { ClickEventIndex, PMenuHam, PMenuItem } from "./interfaces";
import { MODE } from "./constants.js";


interface DerivedEvent {
  derived: (e: React.MouseEvent<HTMLElement>, i: number) => void,
}


class Menu extends React.Component<ClickEventIndex> {

  closeMenuOnMobile() {
    const items = document.querySelectorAll(".menu__item--spread");
    if (items.length > 0) {
      Array.from(items).forEach(elem => elem.className = "menu__item");
    }
  }

  clicked = function (this: Menu, e: React.MouseEvent<HTMLElement>, i: number): void {
    const sel = document.querySelector<HTMLLIElement>(".menu__item--active");
    this.closeMenuOnMobile();
    if (!sel) return;
    sel.className = "menu__item";
    e.currentTarget.className = "menu__item--active";
  }.bind(this)

  hamClicked(e: React.MouseEvent<HTMLElement>) {
    const mitem = document.querySelectorAll(".menu__item");
    //const aitem = document.querySelector(".menu__item--active");
    if (!mitem) return;
    const items = Array.from(mitem);
    items.forEach(elem => {
      const cname = elem.className;
      if (cname === "menu__item") {
        elem.className += " menu__item--spread";
      }
    });
  }

  render(): React.ReactNode {
    return (
      <div className="menu">
        <ol className="menu__container">
          <MenuItem cname="menu__item--active" id={MODE.HOME} text="home" click={this.clicked} derived={this.props.click} />
          <MenuItem cname="menu__item" id={MODE.BLOG} text="blog" click={this.clicked} derived={this.props.click} />
          <MenuItem cname="menu__item" id={MODE.ABOUT} text="about" click={this.clicked} derived={this.props.click} />
          <MenuItem cname="menu__item" id={MODE.BOARD} text="board" click={this.clicked} derived={this.props.click} />
          <MenuHam cname="menu__item--ham" id={4} click={this.hamClicked} />
        </ol>
      </div>
    );
  }
}


class MenuItem extends React.Component<PMenuItem & DerivedEvent> {

  handleClick(e: React.MouseEvent<HTMLElement>, i: number) {
    this.props.click(e, i);
    this.props.derived(e, i);
  }

  render(): React.ReactNode {
    const { cname, text, id } = this.props;
    return <li className={cname} onClick={(e) => this.handleClick(e, id)}>{text}</li>
  }
}


class MenuHam extends React.Component<PMenuHam> {
  render(): React.ReactNode {
    const { cname, click } = this.props;
    return (
      <li className={cname} onClick={(e) => click(e)}>
        {/*from "font-awesome" web service */}
        <i className="fa fa-bars"></i>
      </li>
    );
  }
}

export default Menu;

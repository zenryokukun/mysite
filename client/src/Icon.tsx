
import React from "react";
import { Cname } from "./interfaces";

interface Cnames extends Cname {
  pname: string,
  link: string,
}

//Icon wrapped in anchor tag.
class Icon extends React.Component<Cnames> {
  render(): React.ReactNode {
    const { pname, cname, link } = this.props;
    return (
      <a className={pname} href={link}>
        <i className={cname}></i>
      </a>
    );
  }
}

//Raw Icon
class StockIcon extends React.Component<Cname> {
  render(): React.ReactNode {
    const { cname } = this.props;
    return <i className={cname}></i>;
  }
}

export default Icon;
export { StockIcon };
import React from "react";
import { Text } from "./interfaces";
import "./loader.css";

class Loader extends React.Component<Text> {
    render(): React.ReactNode {
        const { text } = this.props;
        return (
            <div className="loader-wrapper">
                <div className="loader-message">{text}</div>
            </div>
        );
    }
}

export default Loader;
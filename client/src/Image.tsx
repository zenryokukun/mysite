import React from "react";
// @ts-ignore
import { Src, Cname } from "./interfaces.ts";

// Returns plain img tag
class Image extends React.Component<Src & Cname> {
    render(): React.ReactNode {
        const { src, alt, cname } = this.props;
        return <img className={cname} src={src} alt={alt} />
    }
}

// Returns img tag wrapped in div.
// className will be set to div
class ImageWrapper extends React.Component<Src & Cname> {
    render(): React.ReactNode {
        const { src, alt, cname } = this.props;
        return (
            <div className={cname}>
                <img src={src} alt={alt} />
            </div>
        );
    }
}

export default Image;
export { ImageWrapper };
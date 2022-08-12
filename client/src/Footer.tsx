import React from "react";
import { ICON } from "./constants";
import Icon from "./Icon";

class Footer extends React.Component {

  render(): React.ReactNode {
    return (
      <div className="footer">
        <div className="footer__message">Brought to you by Zenryokukun, with love.</div>
        <div className="footer__content">
          <AboutFooter />
          <IconFooter />
          <MapFooter />
        </div>
      </div>
    );
  }
}

class AboutFooter extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="footer__content__about">
        <div className="about__title">
          ABOUT
        </div>
        <div className="about__message">
          <div>ありとあらゆる集団からはじき出される不適合者。</div>
          <div>同じ境遇の人に、少しでも憩いの場を。</div>
        </div>
      </div>
    );
  }
}

class MapFooter extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="footer__content__map">
        <div className="map__company">
          <div className="icon__wrapper"><Icon pname="icon--default-color" cname={ICON.MAP.STYLE} link={ICON.MAP.LINK} /></div>
          <span >Unemployed Inc.</span>
        </div>
        <div className="map__address">The Greater Metropolitan Tokyo,JP.</div>
      </div>
    );
  }
}

class IconFooter extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="footer__content__icon">
        <div className="icon__message">Feel free to follow me.</div>
        <div className="icon__wrapper"><Icon pname="icon--default-color" cname={ICON.TWITTER.STYLE} link={ICON.TWITTER.LINK} /></div>
        <div className="icon__wrapper"><Icon pname="icon--default-color" cname={ICON.INSTAGRAM.STYLE} link={ICON.INSTAGRAM.LINK} /></div>
        <div className="icon__wrapper"><Icon pname="icon--default-color" cname={ICON.GITHUB.STYLE} link={ICON.GITHUB.LINK} /></div>
      </div>
    );
  }
}

export default Footer;
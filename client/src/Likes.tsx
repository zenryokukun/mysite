import React from "react";

type Event = React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>;

interface Counts {
  docId: object,
  likes: number,
  dislikes: number,
}

interface Impr {
  wrapCname: string,
  iconWrapCname: string,
  iconCname: string,
  countCname: string,
  count: number,
  clicked: (e: Event) => void,
}

interface LikeState {
  like: { clicked: boolean, count: number },
  dislike: { clicked: boolean, count: number },
}

class Likes extends React.Component<Counts, LikeState> {

  constructor(props: Counts) {
    super(props);
    const { likes, dislikes } = this.props;
    this.state = {
      like: { clicked: false, count: likes },
      dislike: { clicked: false, count: dislikes },
    };
  }

  clickLike = (e: Event) => {
    //need this to prevent `click` on mobile devices.
    e.preventDefault();
    const { like, dislike } = this.state;
    // dislikeが押されていれば何もせずにリターン
    if (dislike.clicked) return;
    // likeが押されていたらundo
    if (like.clicked) {
      this.setState((state, props) => {
        const current = state.like.count;
        return { like: { clicked: false, count: current - 1 } };
      });
      return;
    }
    // like　更新
    this.setState((state, props) => {
      const current = state.like.count;
      return { like: { clicked: true, count: current + 1 } }
    });
  }

  clickDislike = (e: Event) => {
    //need this to prevent `click` on mobile devices.
    e.preventDefault();
    const { like, dislike } = this.state;
    // likeが押されていれば何もせずにリターン
    if (like.clicked) return;
    // dislikeが押されていたらundo
    if (dislike.clicked) {
      this.setState((state, props) => {
        const current = state.dislike.count;
        return { dislike: { clicked: false, count: current - 1 } };
      });
      return;
    }
    // dislike　更新
    this.setState((state, props) => {
      const current = state.dislike.count;
      return { dislike: { clicked: true, count: current + 1 } }
    });
  }

  componentWillUnmount() {
    const addLike = this.state.like.clicked ? 1 : 0;
    const addDislike = this.state.dislike.clicked ? 1 : 0;
    const data = { docId: this.props.docId, like: addLike, dislike: addDislike };
    fetch("/impress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  render(): React.ReactNode {
    const lcnt = this.state.like.count;
    const dcnt = this.state.dislike.count;
    const lcl = this.state.like.clicked;
    const dcl = this.state.dislike.clicked;

    return (
      <>
        <div className="likes__message">
          👍最後までありがとうございます。👍
        </div>
        <div className="likes__wrapper">
          <Impression
            wrapCname="likes--like__wrapper"
            iconWrapCname="like__icon__wrapper"
            iconCname={lcl ? "fa-solid fa-thumbs-up fa-2x like__fixed" : "fa-solid fa-thumbs-up fa-2x like-icon"}
            countCname="likes--like__count"
            count={lcnt}
            clicked={this.clickLike}
          />
          <Impression
            wrapCname="likes--dislike__wrapper"
            iconWrapCname="dislike__icon__wrapper"
            iconCname={dcl ? "fa-solid fa-thumbs-down fa-2x dislike__fixed" : "fa-solid fa-thumbs-down fa-2x dislike-icon"}
            countCname="likes--dislike__count"
            count={dcnt}
            clicked={this.clickDislike}
          />
        </div>
      </>
    );
  }
}

class Impression extends React.Component<Impr> {

  render(): React.ReactNode {
    const { wrapCname, iconWrapCname, iconCname, countCname, clicked, count } = this.props;
    return (
      <div className={wrapCname}>
        <span className={iconWrapCname} onClick={clicked} onTouchEnd={clicked}><i className={iconCname}></i></span>
        <span className={countCname}>{count}</span>
      </div>
    );
  }
}

export default Likes;
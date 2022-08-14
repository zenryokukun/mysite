// 掲示板
import React from "react";
import { Cname } from "./interfaces";
import Loader from "./Loader";

interface Show {
  postClick: () => void,
}

interface ModalP {
  submitclick: (name: string, comment: string) => Promise<any> | undefined,
  closeClick: () => void,
}

interface CommentData {
  no: number,
  name: string,
  comment: string,
  repId: object,
  posted: string,
}

class Board extends React.Component<{}, { mode: number, loaded: boolean, comments: CommentData[] }> {

  mode_hide = 0
  mode_show = 1
  // comments: CommentData[]

  constructor(props: {}) {
    super(props);
    // this.comments = [];
    this.state = {
      mode: this.mode_hide,
      loaded: false,
      comments: [],
    };
    this.loadComments();
  }

  async loadComments() {
    try {
      const raw = await fetch("/comment-list");
      const data = await raw.json();
      if (!data) return;
      // this.comments = data;
      this.setState({ loaded: true, comments: data, mode: this.mode_hide });
    } catch (e) {
      console.log(e);
      return;
    }
  }

  // `Post Comment` button
  postClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" }); // scroll top
    this.setState({ mode: this.mode_show });
  }

  // `Post` button on modal
  submitClick = (name: string, comment: string) => {
    if (name.length === 0 || comment.length === 0) return;

    const data = {
      name: name,
      comment: comment,
    };

    // let json = JSON.stringify(data);
    // json = json.replace(/\\n/g, "\\n");
    return fetch("/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          this.loadComments()
        } else {
          alert("入力値が不正です。多分名前長すぎ。20文字以内くらいでお願いします。");
        }
      })
      .catch(e => console.log(e));
    //.then(() => this.setState({ mode: this.mode_hide }));

    // this.setState({ mode: this.mode_hide })
  }
  // `X Close` button on modal
  closeClick = () => this.setState({ mode: this.mode_hide })

  render(): React.ReactNode {
    const { mode, loaded } = this.state;
    const cname = mode === this.mode_hide ? "modal modal__hide" : "modal modal__show";
    const comments = this.state.comments;

    if (loaded) {
      return (
        <>
          <Modal cname={cname} submitclick={this.submitClick} closeClick={this.closeClick} />
          <div className="board__wrapper">
            <div className="board__message">気軽に感想、批評、要望、何でも書いてください。レッツ、レスポンシブ・バトル。</div>
            {comments.map((comment, i) => <Comment key={i} {...comment} />)}
            <Post postClick={this.postClick} />
          </div>
        </>
      );
    }
    return <Loader text="ナウ、ローディン．．．" />
  }
}

class Comment extends React.Component<CommentData> {
  render(): React.ReactNode {
    const { no, name, comment, posted } = this.props;
    return (
      <div className="comment__wrapper">
        <div className="comment__no"><div>{no}</div></div>
        <div className="comment__content__container">
          <div className="comment__up__container">
            <div className="comment__name">{name}</div>
            <div className="comment__posted">{posted}</div>
          </div>
          <div className="comment__text">{comment}</div>
        </div>
      </div>
    );
  }
}

class Modal extends React.Component<Cname & ModalP, { submit: boolean }> {

  constructor(props: Cname & ModalP) {
    super(props);
    this.state = { submit: false };
  }

  click = (fn: (name: string, comment: string) => Promise<any> | undefined) => {
    const nameNode: HTMLInputElement | null = document.querySelector(".modal__name__text");
    const commentNode: HTMLTextAreaElement | null = document.querySelector(".modal__comment__text");
    if (nameNode === null || commentNode === null) return;
    const name = nameNode.value;
    const comment = commentNode.value
    if (name.length === 0 || comment.length === 0) {
      alert("NameとCommentは両方入力必須です")
      return;
    }
    const prom = fn(name, comment);
    this.setState({ submit: true });
    if (!prom) return;
    prom.then(() => {
      this.setState({ submit: false });
    });
  }

  render(): React.ReactNode {
    const { cname, closeClick, submitclick } = this.props;
    const { submit } = this.state;
    return (
      <>
        {submit && <Lock />}
        <div className={cname}>
          <div className="modal__wrapper">
            <div className="modal__name">
              <div className="modal__name__label">Name</div>
              <input className="modal__name__text" type="text" />
            </div>
            <div className="modal__comment">
              <div className="modal__comment__label">Comment</div>
              <textarea className="modal__comment__text"></textarea>
            </div>
            <div className="modal__button__wrapper">
              <div tabIndex={1} className="modal__post__button" onClick={(e) => this.click(submitclick)}>Post</div>
              <div tabIndex={2} className="modal__close__button" onClick={closeClick}>X Close</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

class Post extends React.Component<Show> {
  render(): React.ReactNode {
    const { postClick } = this.props;
    return <div className="post__button" onClick={postClick}>Post Comment</div>;
  }
}

// Lock modal
class Lock extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="lock__modal ">
        <Loader text="ナウ、アップローディン．．．" />
      </div>
    );
  }
}

export default Board;

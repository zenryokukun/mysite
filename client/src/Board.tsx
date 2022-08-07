// 掲示板
import React from "react";
import { Cname } from "./interfaces";
import Loader from "./Loader";

interface Show {
  postClick: () => void,
}

interface ModalP {
  submitclick: (name: string, comment: string) => void
  closeClick: () => void
}

interface Comment {
  name: string,
  message: string,
  repId: object,
}

class Board extends React.Component<{}, { mode: number, loaded: boolean }> {

  mode_hide = 0
  mode_show = 1
  comments: Comment[]

  constructor(props: {}) {
    super(props);
    this.comments = [];
    this.state = { mode: this.mode_hide, loaded: true };
    this.loadComments();
  }

  async loadComments() {
    try {
      const raw = await fetch("/comment-list");
      const data = await raw.json();
      if (!data) return;
      this.comments = data;
      this.setState({ loaded: true });
    } catch (e) {
      console.log(e);
      return;
    }
  }

  // `Post Comment` button
  postClick = () => this.setState({ mode: this.mode_show })

  // `Post` button on modal
  submitClick = (name: string, comment: string) => {
    if (name.length === 0 || comment.length === 0) return;

    const data = {
      name: name,
      comment: comment,
    };

    fetch("/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    this.setState({ mode: this.mode_hide })
  }
  // `X Close` button on modal
  closeClick = () => this.setState({ mode: this.mode_hide })

  render(): React.ReactNode {
    const { mode, loaded } = this.state;
    const cname = mode === this.mode_hide ? "modal modal__hide" : "modal modal__show";
    if (loaded) {
      return (
        <>
          <Modal cname={cname} submitclick={this.submitClick} closeClick={this.closeClick} />
          <div className="board__wrapper"><Post postClick={this.postClick} /></div>
        </>
      );
    }
    return <Loader text="ナウ、ローディン．．．" />
  }
}

class Modal extends React.Component<Cname & ModalP> {

  click = (fn: (name: string, comment: string) => void) => {
    const nameNode: HTMLInputElement | null = document.querySelector(".modal__name__text");
    const commentNode: HTMLTextAreaElement | null = document.querySelector(".modal__comment__text");
    if (nameNode === null || commentNode === null) return;
    const name = nameNode.value;
    const comment = commentNode.value
    if (name.length === 0 || comment.length === 0) {
      alert("NameとCommentは両方入力必須です")
      return;
    }
    fn(name, comment);
  }

  render(): React.ReactNode {
    const { cname, closeClick, submitclick } = this.props;
    return (
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
            <div className="modal__post__button" onClick={(e) => this.click(submitclick)}>Post</div>
            <div className="modal__close__button" onClick={closeClick}>X Close</div>
          </div>
        </div>
      </div>
    );
  }
}

class Post extends React.Component<Show> {

  render(): React.ReactNode {
    const { postClick } = this.props;
    return <div className="post__button" onClick={postClick}>Post Comment</div>;
  }
}

export default Board;

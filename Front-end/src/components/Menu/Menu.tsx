import { Component } from 'react';
import styles from './Menu.module.scss';

export default class Menu extends Component<any, {commentText: any}>
{
  constructor(props) {
    super(props)
    this.state = {
      commentText : '',
    }
  }

  submitComment() {
    if(this.state.commentText === '')  {return;}
    fetch(this.props.apiURL + 'Comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "observe": "response",
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      },
      body: JSON.stringify({
        comment: this.state.commentText,
      })
    }).then(res => res.json())
    .then(res => {
      window.location.reload();
    });
  }


  render() {
    return (
    <div className={styles.Menu + " bg-dark"}>
        <div className={styles.pageTitle + " shadow bg-dark border"}>
          <h1 className='text-light'>
              Bienvenido al sistema de ABM hecho con Spring boot y React!
          </h1>
        </div>

        <div className={styles.commentsSection}>
          <h3 className={'text-white ' + styles.titleComment}>¿Que opina de la página?</h3>
          <textarea className={'form-control '+ styles.commentArea} placeholder='Escribe un comentario' 
          onChange={(e) => this.setState({commentText: e.target.value})}>

          </textarea>
          <button className={'btn btn-primary ' + styles.commentButton} onClick={() => this.submitComment()}>Enviar</button>
        </div>
    </div>
    );
  }
}
import { Component } from 'react';
import styles from './Menu.module.scss';

export default class Menu extends Component<any, any>
{
  constructor(props) {
    super(props)
    this.state = {
      commentText : '',
      comments: [],
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

  componentDidMount()
  {
    this.getComments();
  }

  getComments()
  {
    if(sessionStorage.getItem('m') === null || sessionStorage.getItem('m') === undefined ||
      sessionStorage.getItem('y') === null || sessionStorage.getItem('y') === undefined || 
      sessionStorage.getItem('SSID') === null || sessionStorage.getItem('SSID') === undefined)
    {
      return;
    }
    fetch(this.props.apiURL + 'Comments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "observe": "response",
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      },
    }).then(res => res.json())
    .then(res => {

      let commentsArray = res;
      for (let i = 0; i < commentsArray.length; i++){
          const date = new Date(commentsArray[i].fecha_carga);
          const now = new Date();
          const diff = now.getTime() - date.getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
          const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 30 * 12));
          if (years > 0){
            commentsArray[i].fecha_diff = years + ' years ago';
          }
          else if (months > 0){
            commentsArray[i].fecha_diff = months + ' months ago';
          }
          else if (days > 0){
            commentsArray[i].fecha_diff = days + ' days ago';
          }
          else{
            commentsArray[i].fecha_diff = 'today';
          }
      }

      this.setState({comments: commentsArray});
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
        {
          this.state.comments.map((comment, index) => {
            return (
              <div className="text-white" key={comment.id_comment}>
                  <div className={styles.comment}>
              
                    <div className={styles.profileimage}>
                      <img className={styles.profileimageimg} src="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png">
                    </img>

                    </div>
                    <div className= {styles.usercomment}>
                      <h6>{ comment.comment }</h6>
                    </div>
                    <h6 className= {styles.fechaDiff}>{ comment.fecha_diff }</h6>
                  </div>
              </div>
            );
          }
        )
        }
    </div>
    );
  }
}
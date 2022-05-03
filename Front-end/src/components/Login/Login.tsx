import { Component } from 'react';
import styles from './Login.module.scss';


export default class Login extends Component<any,any>
{
  constructor(props:any)
  {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: 0
    }
  }



  login()
  {
    fetch(this.props.apiURL + "authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Observe: "body"
      },
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password,
      }),
    }).then(res => {
      return res.json();
    }).then(res => {
      let token = res.token;
      if(res.token !== null)
      {
        fetch(this.props.apiURL + "users/" + this.state.email, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Observe: "body",
            Authorization: "Bearer " + token
          },
        }).then(res => {
          return res.json();
        }).then(res => {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("SSID", res.id_usuario);
          sessionStorage.setItem("m", res.usuario);
          sessionStorage.setItem("y", res.pass);
          window.location.href = "/";
        })
      }
      else
      {
        this.setState({error: 1});
      }
    });
    
  }

  render()
  {
    return(
      <div className={styles.Login}>
        <h1 className={styles.title + ' text-white'}> Iniciar sesión </h1>
        <div className="wrapper fadeInDown">
            <div id="formContent">
            {
              this.state.error === 1 ?
              <div className="alert alert-danger errorLabel" role="alert">
                  Ususario o contraseña incorrectos!
              </div>
              : null
            }
            <input type="text" id="login" className="fadeIn second" name="login" placeholder="Usuario" 
            value={this.state.email} onChange={(e) => this.setState({email: e.target.value})}/>

            <input type="password" id="password" className="fadeIn third" name="login" placeholder="Contraseña" 
            value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>

            <input type="submit" className="fadeIn fourth" value="Iniciar sesión" onClick={() => this.login()}/>
            </div>
        </div>
      </div>
    )
  }
}
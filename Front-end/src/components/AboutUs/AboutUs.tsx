import React, { Component } from 'react';
import styles from './AboutUs.module.scss';


export default class AboutUs extends Component<any,any>
{
  constructor(props:any)
  {
    super(props);
    this.state = {

    }
  }

  render()
  {
    return(
      <div className={styles.AboutUs}>
        <h1 className='text-white'> Sobre nosotros </h1>
      </div>
    )
  }
}


import React, { Component } from 'react';
import styles from './ABMClientes.module.scss';
import { Button, Modal, Table } from 'react-bootstrap';

export default class ABMClientes extends Component 
{
  clientes: any;
  constructor (props) {
    super(props)
    this.state = { clientes: null,
    localidades: null
   }
  }
  

  componentDidMount() {
    fetch('https://springbootangular11crud.herokuapp.com/api/Clientes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(response => response.json())
      .then(data => {
        this.setState({ clientes: data });
        localStorage.setItem('clientes', JSON.stringify(data));

        fetch('https://springbootangular11crud.herokuapp.com/api/Localidades', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        })
        .then(response => response.json())
        .then(data => {
          this.setState({ localidades: data });
          localStorage.setItem('localidades', JSON.stringify(data));
        })
      }).catch((err) => {
    }).finally(() => {
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.parentToChild !== prevProps.parentToChild)
    {
      let clientesOld = this.props.parentToChild !== null && this.props.parentToChild !== undefined 
      && this.props.parentToChild !== "" ?
      JSON.parse(localStorage.getItem('clientes'))
      .filter(cliente => cliente.razon_social.toLowerCase().includes(this.props.parentToChild.toLowerCase()) ||
      cliente.localidad.toLowerCase().includes(this.props.parentToChild.toLowerCase()) ||
      cliente.telefono.toLowerCase().includes(this.props.parentToChild.toString().toLowerCase()) ||
      cliente.id_cliente.toString().includes(this.props.parentToChild.toString().toLowerCase())) :
      JSON.parse(localStorage.getItem('clientes'));
      
      this.setState({ clientes: clientesOld });
    }
  }

  handleSubmit(cliente): void
  {
    fetch('https://springbootangular11crud.herokuapp.com/api/Clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      },
      body: JSON.stringify(cliente)
    }
    ).then(response => response.json())
      .then(data => {
        this.componentDidMount();
        this.setState({ show: false });
      }
      ).catch((err) => {
    }
    ).finally(() => {
    });
  }

  handleModify(cliente): void
  {
    fetch('https://springbootangular11crud.herokuapp.com/api/Clientes/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      },
      body: JSON.stringify(cliente)
    }).then(response => response.json())
      .then(data => {
        this.componentDidMount();
        this.setState({ showModalModificar: false });
      }
      ).catch((err) => {
    }
    ).finally(() => {
    });
  }

  handleDelete(id): void
  {
    fetch('https://springbootangular11crud.herokuapp.com/api/Clientes/' + id.id_cliente, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(response => response.json())
      .then(data => {
        this.componentDidMount();
        this.setState({ ModalBorrarClientes: false });
      }
      ).catch((err) => {
      }
      ).finally(() => {
      });
  }

  render()
  {
    if (this.state.clientes === null || this.state.localidades === null) {
      return <div>Loading...</div>;
    }else
    {
      return (
        <div className={styles.MyComponent}>
        <div className={styles.pageTitle + " shadow bg-light border"}>
          <h1> ABM de Clientes  </h1>
        </div>
        <div className='shadow'>
        <ModalCargarClientes localidades={this.state.localidades} show={this.state.show} onHide={() => this.setState({ show: false })}
        handleShow = {() => this.setState({ show: true })} onClick = {() => this.setState({ show: false })}
        onsubmit = {(cliente) => this.handleSubmit(cliente)}/>

        {this.state.showModalModificar ?
        <ModalModifyClientes 
                      showModalModificar={this.state.showModalModificar} 

                      onHide={() => this.setState({ showModalModificar: false })}

                      handleShowModificar = {() => this.setState({ showModalModificar: true })}
                        
                      onClick = {() => this.setState({ showModalModificar: false } )}
                      
                      cliente={this.state.selectedCliente}

                      localidades={this.state.localidades}

                      seletedLocalidad={this.state.selectedLocalidad}

                      onsubmit = {(cliente) => this.handleModify(cliente)}
        />
        : ''
        }
        {
          this.state.ModalBorrarClientes ?
          <ModalBorrarClientes

          showModalBorrar={this.state.ModalBorrarClientes}
          onHide={() => this.setState({ ModalBorrarClientes: false })}
          handleShowBorrarClientes={() => this.setState({ ModalBorrarClientes: true })}
          onClick={() => this.setState({ ModalBorrarClientes: false })}
          cliente={this.state.selectedCliente}
          onsubmit={(cliente) => this.handleDelete(cliente)}
          />
        
        : ''
        }

        <Table striped bordered hover className={styles.tableComponentStyle}>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Localidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
              this.state.clientes.map(cliente => (
              <tr key={cliente.id_cliente}>
                <td>{cliente.id_cliente}</td>
                <td>{cliente.razon_social}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.localidad}</td>
                <td>
                  <Button variant="primary" onClick={() => this.setState({ showModalModificar: true, selectedCliente: cliente,
                  selectedLocalidad: cliente.localidad })}>
                    Modificar
                  </Button>

                  <Button variant="danger" onClick={() => this.setState({ ModalBorrarClientes: true, selectedCliente: cliente })}
                  className={styles.eliminarBtn}>
                    Borrar
                  </Button>
                </td>
              </tr>
            ))
            }
        </tbody>
      </Table>
      </div>
        
      </div>
      );
    }
    
  }

}


class ModalCargarClientes extends Component {
  constructor (props) {
    super(props)
    this.state = { clientes: null,
    localidades: null
   }
  }

  selectedLocalidad: any;
  
  render() {
      return (
          <>
             <Button variant="primary" onClick={this.props.handleShow} className={styles.cargarClientesBtn}>
              Cargar cliente
            </Button>
              <Modal show={this.props.show} onHide={this.props.handleClose} >

                  <Modal.Header>
                      <Modal.Title>
                          Cargar clientes
                      </Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                      <form>
                          <div className="form-group mt-2 mb-2">
                              <label>Nombre</label>
                              <input type="text" className="form-control" placeholder="Nombre" name='nombredecliente' id='nombredecliente'/>
                          </div>
                          <div className="form-group mt-2 mb-2">
                              <label>Teléfono</label>
                              <input type="text" className="form-control" placeholder="Teléfono" name='telefonodecliente' id='telefonodecliente'/>
                          </div>
                          <div className="form-group mt-2 mb-2">
                              <label>Localidad</label>
                              <select className="form-control" 
                              name='localidaddecliente' id='localidaddecliente' onChange={(e) => this.selectedLocalidad = e.target.value} defaultValue="seleccione">
                                <option value="seleccione" disabled>Seleccione una localidad</option>
                                  {
                                      this.props.localidades.map(localidad => (
                                          <option key={localidad.cp} value={localidad.cp}>{localidad.localidad}</option>
                                      ))
                                  }
                              </select>
                          </div>
                      </form>

                  </Modal.Body>

                  <Modal.Footer>
                      <Button variant="secondary" onClick={() => this.props.onClick({  })} >Cancelar</Button>
                      <Button variant="primary" onClick={() =>  this.props.onsubmit({
                          razon_social: document.getElementById('nombredecliente').value,
                          telefono: document.getElementById('telefonodecliente').value,
                          cp: this.selectedLocalidad
                      })}>
                          Cargar
                      </Button>
                  </Modal.Footer>
              </Modal>
          </>
      )
  };


}

class ModalModifyClientes extends Component {
  constructor (props) {
    super(props)
    this.state = { clientes: null,
      localidades: null
     }
  }

  selectedLocalidad: any = this.props.cliente.cp !== null && this.props.cliente.cp !== undefined
  ? this.props.cliente.cp : '';
  nombredecliente: any = this.props.cliente.razon_social !== null && this.props.cliente.razon_social !== undefined
  ? this.props.cliente.razon_social : '';
  telefonodecliente: any = this.props.cliente.telefono !== null && this.props.cliente.telefono !== undefined
  ? this.props.cliente.telefono : '';
  
  render() {
      return (
          <>
              <Modal show={this.props.showModalModificar} onHide={this.props.handleCloseModificar} >

                  <Modal.Header>
                      <Modal.Title>
                          Modificar clientes
                      </Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                      <form>
                          <div className="form-group mt-2 mb-2">
                              <label>Nombre</label>
                              <input type="text" className="form-control" placeholder="Nombre" name='nombredecliente' id='nombredecliente' 
                              defaultValue={this.props.cliente.razon_social} onChange={(e) => this.nombredecliente = e.target.value}/>
                          </div>
                          <div className="form-group mt-2 mb-2">
                              <label>Teléfono</label>
                              <input type="text" className="form-control" placeholder="Teléfono" name='telefonodecliente' id='telefonodecliente' 
                              defaultValue={this.props.cliente.telefono} onChange={(e) => this.telefonodecliente = e.target.value}/>
                          </div>
                          <div className="form-group mt-2 mb-2">
                              <label>Localidad</label>
                              <select className="form-control" 
                              name='localidaddecliente' id='localidaddecliente' onChange={(e) => this.selectedLocalidad = e.target.value} defaultValue={this.props.cliente.cp}>
                                <option value="seleccione" disabled>Seleccione una localidad</option
                                >
                                  {
                                      this.props.localidades.map(localidad => (
                                          <option key={localidad.cp} value={localidad.cp}>{localidad.localidad}</option>
                                      ))
                                  }
                              </select>
                          </div>
                      </form>

                  </Modal.Body>

                  <Modal.Footer>
                      <Button variant="secondary" onClick={() => this.props.onClick({  })} >Cancelar</Button>
                      <Button variant="primary" onClick={() =>  this.props.onsubmit({
                          id_cliente: this.props.cliente.id_cliente,
                          razon_social: this.nombredecliente,
                          telefono: this.telefonodecliente,
                          cp: this.selectedLocalidad
                      })}>
                          Modificar
                      </Button>
                  </Modal.Footer>
              </Modal>
          </>
      )
  };
}
 

class ModalBorrarClientes extends Component {
  constructor (props) {
    super(props)
    this.state = { clientes: null,
      localidades: null
     }
  }

  render() {
      return (
          <>
              <Modal show={this.props.showModalBorrar} onHide={this.props.handleCloseBorrar} >

                  <Modal.Header>
                      <Modal.Title>
                          Borrar clientes
                      </Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                      <h3>Seguro que quiere borrar el cliente?</h3>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={() => this.props.onClick({  })} >Cancelar</Button>
                      <Button variant="danger" onClick={() =>  this.props.onsubmit({
                          id_cliente: this.props.cliente.id_cliente
                      })}>
                          Borrar
                      </Button>
                  </Modal.Footer>
              </Modal>
          </>
      )
  };
}

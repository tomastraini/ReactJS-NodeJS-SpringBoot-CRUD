import React, { Component } from 'react';
import styles from './ABMClientes.module.scss';
import { Button, Modal, Table } from 'react-bootstrap';

export default class ABMClientes extends Component<any, {clientes: any, localidades: any,parentToChild: any, show: any, showModalModificar: any, selectedCliente: any, ModalBorrarClientes: any, selectedLocalidad: any}>
{
  constructor(props) {
    super(props)
    this.state = {
      clientes: null,
      localidades: null,
      parentToChild: null,
      show: null,
      showModalModificar: null,
      selectedCliente: null,
      ModalBorrarClientes: null,
      selectedLocalidad: null
    }
  }

  apiURL = this.props.apiURL;

  componentDidMount() {
    fetch(this.apiURL + 'Clientes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    }).then(response => response.json())
      .then(data => {
        this.setState({ clientes: data });
        localStorage.setItem('clientes', JSON.stringify(data));

        fetch(this.apiURL + 'Localidades', {
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
    if (this.props.parentToChild !== prevProps.parentToChild) {
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

  handleSubmit(cliente): void {
    fetch(this.apiURL + 'Clientes', {
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

  handleModify(cliente): void {
    fetch(this.apiURL + 'Clientes/', {
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

  handleDelete(id): void {
    fetch(this.apiURL + 'Clientes/' + id.id_cliente, {
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

  render() {
    if (this.state.clientes === null || this.state.localidades === null) {
      return (
        <div className={styles.MyComponentLoading + ' bg-dark'}>
          <div className="d-flex justify-content-center loadingIcon mt-5">
            <div className="spinner-border text-danger" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={this.state.clientes.length >= 8 ? styles.MyComponent : styles.MyComponentEmpty}>
          <div className={styles.pageTitle + " shadow bg-dark border"}>
            <h1 className='text-light'> ABM de Clientes  </h1>
          </div>
          <div className='shadow bg-dark '>
            <ModalCargarClientes localidades={this.state.localidades} show={this.state.show} onHide={() => this.setState({ show: false })}
              handleShow={() => this.setState({ show: true })} onClick={() => this.setState({ show: false })}
              onsubmit={(cliente) => this.handleSubmit(cliente)} 
              />

            {this.state.showModalModificar ?
              <ModalModifyClientes
                showModalModificar={this.state.showModalModificar}

                onHide={() => this.setState({ showModalModificar: false })}

                handleShowModificar={() => this.setState({ showModalModificar: true })}

                onClick={() => this.setState({ showModalModificar: false })}

                cliente={this.state.selectedCliente}

                localidades={this.state.localidades}

                seletedLocalidad={this.state.selectedLocalidad}

                onsubmit={(cliente) => this.handleModify(cliente)}/>
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
                  onsubmit={(cliente) => this.handleDelete(cliente)}/>
                : ''
            }

            <Table striped bordered hover className={styles.tableComponentStyle}>
              <thead>
                <tr >
                  <th className='text-white'>#</th>
                  <th className='text-white'>Nombre</th>
                  <th className='text-white'>Teléfono</th>
                  <th className='text-white'>Localidad</th>
                  <th className='text-white'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.clientes.map(cliente => (
                    <tr key={cliente.id_cliente}>
                      <td className='text-white'>{cliente.id_cliente}</td>
                      <td className='text-white'>{cliente.razon_social}</td>
                      <td className='text-white'>{cliente.telefono}</td>
                      <td className='text-white'>{cliente.localidad}</td>
                      <td>
                        <Button variant="primary" onClick={() => this.setState({
                          showModalModificar: true, selectedCliente: cliente,
                          selectedLocalidad: cliente.localidad
                        })}>
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

class ModalCargarClientes extends Component<any, { clientes: null, localidades: null }>
{
  constructor(props) {
    super(props)
    this.state = {
      clientes: null,
      localidades: null
    }
  }
  selectedNombre: any;
  selectedTelefono: any;
  selectedLocalidad: any;

  render() {
    return (
      <>

        <Button variant="primary" onClick={this.props.handleShow} className={styles.cargarClientesBtn}>
          Cargar cliente
        </Button>

        <Modal show={this.props.show} onHide={this.props.handleClose} backdrop={true} >

          <Modal.Header  className='bg-dark'>
            <Modal.Title  className='text-white'>
              Cargar clientes
            </Modal.Title>
          </Modal.Header>

          <Modal.Body  className='bg-dark'>
            <form>
              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Nombre</label>
                <input type="text" className="form-control" placeholder="Nombre" name='nombredecliente' id='nombredecliente'
                  onChange={(e) => this.selectedNombre = e.target.value} />
              </div>
              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Teléfono</label>
                <input type="text" className="form-control" placeholder="Teléfono" name='telefonodecliente' id='telefonodecliente'
                  onChange={(e) => this.selectedTelefono = e.target.value} />
              </div>
              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Localidad</label>
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

          <Modal.Footer className='bg-dark'>
            <Button variant="secondary" onClick={() => this.props.onClick({})} >Cancelar</Button>
            <Button variant="primary" onClick={() =>
            this.props.onsubmit({
              razon_social: this.selectedNombre,
              telefono: this.selectedTelefono,
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



class ModalModifyClientes extends Component<any, { cliente: null, localidades: null, handleCloseModificar: null, showModalModificar: null }>
{
  constructor(props) {
    super(props)
    this.state = {
      cliente: null,
      localidades: null,
      handleCloseModificar: null,
      showModalModificar: null
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
          <Modal.Header className='bg-dark'>
            <Modal.Title className='text-white'>
              Modificar clientes
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className='bg-dark'>
            <form>
              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Nombre</label>
                <input type="text" className="form-control" placeholder="Nombre" name='nombredecliente' id='nombredecliente'
                  defaultValue={this.props.cliente.razon_social} onChange={(e) => this.nombredecliente = e.target.value} />
              </div>
              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Teléfono</label>
                <input type="text" className="form-control" placeholder="Teléfono" name='telefonodecliente' id='telefonodecliente'
                  defaultValue={this.props.cliente.telefono} onChange={(e) => this.telefonodecliente = e.target.value} />
              </div>
              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Localidad</label>
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

          <Modal.Footer className='bg-dark'>
            <Button variant="secondary" onClick={() => this.props.onClick({})} >Cancelar</Button>
            <Button variant="primary" onClick={() => this.props.onsubmit({
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


class ModalBorrarClientes extends Component<any, { cliente: any }>
{
  constructor(props) {
    super(props)
    this.state = {
      cliente: null,
    }
  }

  render() {
    return (
      <>
        <Modal show={this.props.showModalBorrar} onHide={this.props.handleCloseBorrar} >

          <Modal.Header className='bg-dark'>
            <Modal.Title className='text-white'>
              Borrar clientes
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className='bg-dark'>
            <h3 className='text-white'>Seguro que quiere borrar el cliente?</h3>
          </Modal.Body>
          <Modal.Footer className='bg-dark'>
            <Button variant="secondary" onClick={() => this.props.onClick({})} >Cancelar</Button>
            <Button variant="danger" onClick={() => this.props.onsubmit({
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

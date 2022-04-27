import React, { Component, useState } from 'react';
import styles from './ABMClientes.module.scss';
import { Button, Modal, Table } from 'react-bootstrap';
import Form from 'react-bootstrap/Form'

function ModalCargarClientes() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className={styles.cargarClientesBtn}>
        Cargar cliente
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Cargar clientes</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nombre del cliente</Form.Label>
              <Form.Control type="email" placeholder="Nombre" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Form.Select aria-label="Default select example">
            <option selected>Open this select menu</option>

          </Form.Select>


          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default class ABMClientes extends Component 
{
  clientes: any;

  constructor (props) {
    super(props)
    this.state = { clientes: null }
    
  }
  

  componentDidMount() {
    fetch('https://springbootangular11crud.herokuapp.com/api/Clientes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState({ clientes: data });
      localStorage.setItem('clientes', JSON.stringify(data));
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
    });
  }
  

  render()
  {
    if (this.state.clientes === null) {
      return <div>Loading...</div>;
    }else
    {
      return (
        <div className={styles.MyComponent}>
        <h1> ABM de Clientes  </h1>
        <ModalCargarClientes />
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
                  <button className="btn btn-primary">Editar</button>
                  <button className={styles.eliminarBtn + " btn btn-danger"}>Eliminar</button>
                </td>
              </tr>
            ))
            }
        </tbody>
      </Table>
      </div>
      );
    }
    
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
}
 

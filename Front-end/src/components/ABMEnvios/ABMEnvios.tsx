import React, { Component } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import styles from './ABMEnvios.module.scss';

export default class ABMEnvios extends Component<any,any>
{
  constructor(props) {
    super(props)
    this.state = {
      envios: sessionStorage.getItem("envios") ? JSON.parse(sessionStorage.getItem("envios")) : null,
      enviosLimpio: null,
      clientes: null,
      localidades: null,
    }
  }
  apiURL = this.props.apiURL;
  apiURLEnvios = this.props.apiURLEnvios;

  componentDidMount()
  {
    fetch(this.apiURLEnvios + 'envios', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
    }).then(response => response.json()).then(data => {
              this.setState({ enviosLimpio: data });
              fetch(this.apiURL + 'Clientes', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
              }
            }).then(response => response.json())
              .then(data => {
                this.setState({ clientes: data });

                let enviosLimpio = this.state.enviosLimpio;
                let clientes = data;
                
                for (let i = 0; i < enviosLimpio.length; i++) {
                  for (let j = 0; j < clientes.length; j++) {
                    if (enviosLimpio[i].id_cliente.toString() === clientes[j].id_cliente.toString())
                    {
                      let nombreCliente = clientes[j].razon_social;
                      let telefonoCliente = clientes[j].telefono;
                      let localidadCliente = clientes[j].localidad;
                      enviosLimpio[i].razon_social = nombreCliente;
                      enviosLimpio[i].telefono = telefonoCliente;
                      enviosLimpio[i].localidad = localidadCliente;

                      if(enviosLimpio[i].fecha === undefined) {break;}
                      let fecha = enviosLimpio[i].fecha.split("T");

                      if(fecha[1] === undefined || fecha[0] === undefined) {break;}
                      let fecha2 = fecha[0].split("-");
                      let fecha3 = fecha[1].split(":");

                      if(fecha2[2] === undefined || fecha2[1] === undefined || fecha2[0] === undefined || fecha3[0] === undefined || fecha3[1] === undefined) {break;}
                      let fecha4 = fecha2[2] + "/" + fecha2[1] + "/" + fecha2[0] + " " + fecha3[0] + ":" + fecha3[1]

                      let fecha5 = new Date(fecha2[0], fecha2[1] - 1, fecha2[2], fecha3[0], fecha3[1]);

                      if(fecha5 === undefined) {break;}
                      let fecha6 = new Date();

                      let timeleft = fecha5.getTime() - fecha6.getTime();
                      let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
                      let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                      let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
                      if(days < 0)
                      {
                        enviosLimpio[i].timeleft = "Envío ya vencido";
                      }
                      else
                      {
                        enviosLimpio[i].timeleft = days + "d " + hours + "h " + minutes + "m";
                      }
                      if(enviosLimpio[i].timeleft !== null)
                      {
                        enviosLimpio[i].fecha = fecha4;
                      }
                    }
                  }
                }

                this.setState({ envios: enviosLimpio });
                localStorage.setItem('envios', JSON.stringify(this.state.envios));
                localStorage.setItem('clientes', JSON.stringify(this.state.clientes));
              })
              .catch(error => {
                console.log(error);
              }
            );
          })
          .catch(error => {
            console.log(error);
          }
        );
    fetch(this.apiURL + 'Localidades', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
    }).then(response => response.json()).then(data => {
              this.setState({ localidades: data });
              localStorage.setItem('localidades', JSON.stringify(this.state.localidades));
            }).catch(error =>
            {
            console.log(error);
            });
  }

  componentDidUpdate(prevProps) {
    if (this.props.parentToChild !== prevProps.parentToChild)
    {
      let enviosOLD = this.props.parentToChild !== null && this.props.parentToChild !== undefined
        && this.props.parentToChild !== "" ?
        JSON.parse(localStorage.getItem('envios')).filter(envio =>
            envio.razon_social.toLowerCase().includes(this.props.parentToChild.toLowerCase()) ||
            envio.localidad.toLowerCase().includes(this.props.parentToChild.toLowerCase()) ||
            envio.telefono.toLowerCase().includes(this.props.parentToChild.toString().toLowerCase()) ||
            envio.direccion.toLowerCase().includes(this.props.parentToChild.toString().toLowerCase()) ||
            envio.costo.toLowerCase().includes(this.props.parentToChild.toString().toLowerCase()) ||
            envio.timeleft.toLowerCase().includes(this.props.parentToChild.toString().toLowerCase()) ||
            envio.fecha.toString().includes(this.props.parentToChild.toString().toLowerCase())) :
        JSON.parse(localStorage.getItem('envios'));

        this.setState({ envios: enviosOLD });
    }
    
  }


  handleSubmit(event)
  {
    if(event.id_cliente === undefined || event.id_cliente === null || event.id_cliente === '')
    {
      alert('Debe seleccionar un cliente');
      return;
    }

    if(event.telefono === undefined || event.telefono === null || event.telefono === '')
    {
      alert('Debe ingresar un teléfono');
      return;
    }
    
    if(event.direccion === undefined || event.direccion === null || event.direccion === '')
    {
      alert('Debe ingresar una dirección');
      return;
    }

    if(event.costo === undefined || event.costo === null || event.costo === '')
    {
      alert('Debe ingresar un costo');
      return;
    }

    if(event.fecha === undefined || event.fecha === null || event.fecha === '')
    {
      alert('Debe ingresar una fecha');
      return;
    }


    fetch(this.apiURLEnvios + 'envios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event)
    }).then(response => response.json()).then(data => {
              this.componentDidMount();
              this.setState({ show: false });
    }).catch(error => {
        console.log(error);
    });
  }


  handleSubmitModificar(event)
  {
    fetch(this.apiURLEnvios + 'envios', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event)
    }).then(response => response.json()).then(data => {
              console.log(data);
              this.componentDidMount();
              this.setState({ showModalModificar: false });
    }).catch(error => {
        console.log(error);
    });
  }

  handleSubmitEliminar(event)
  {
    let delete_envio = {
      id_envio: event.envio.id_envio
    }
    console.log(delete_envio);
    console.log(event);
    
    
    fetch(this.apiURLEnvios + 'envios', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(delete_envio)
    }).then(response => response.json()).then(data => {
              console.log(data);
              this.componentDidMount();
              this.setState({ showModalEliminar: false });
    }).catch(error => {
        console.log(error);
    });
  }

  render()
  {
    if (this.state.envios === null) {
      return (
        <div className={styles.MyComponentLoading + ' bg-dark'}>
          <div className="d-flex justify-content-center loadingIcon mt-5">
            <div className="spinner-border text-danger" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
          </div>
        </div>
      );
    }else if(this.state.envios.length === 0)
    {
      return (

      <div className={this.state.enviosLimpio.length >= 8 ? styles.ABMEnvios : styles.ABMEnviosEmpty }>
        <div className={styles.pageTitle + " shadow bg-dark border"}>
            <h1 className='text-light'> Carga de envíos  </h1>
            <ModalCargarEnvios clientes={this.state.clientes} localidades={this.state.localidades}
            show={this.state.show} onHide={() => this.setState({ show: false })}
              handleShow={() => this.setState({ show: true })} onClick={() => this.setState({ show: false })}
              onsubmit={(cliente) => this.handleSubmit(cliente)} />
            <Table striped bordered hover className={styles.tableComponentStyle}>
              <thead className="thead-dark">
                <tr>
                  <th scope="col" className='text-white'>#</th>
                  <th scope="col" className='text-white'>Nombre del cliente</th>
                  <th scope="col" className='text-white'>Teléfono</th>
                  <th scope="col" className='text-white'>Localidad</th>
                  <th scope="col" className='text-white'>Dirección exacta</th>
                  <th scope="col" className='text-white'>Fecha de envio</th>
                  <th scope="col" className='text-white'>Faltan</th>
                  <th scope="col" className='text-white'>Costo $</th>
                  <th scope="col" className='text-white'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                
              </tbody>
            </Table>
        </div>
      </div>
      )
    }
    else {
    return (
      <div className={this.state.enviosLimpio.length >= 8 ? styles.ABMEnvios : styles.ABMEnviosEmpty }>
        <div className={styles.pageTitle + " shadow bg-dark border"}>
            <h1 className='text-light'> Carga de envíos  </h1>
            <ModalCargarEnvios clientes={this.state.clientes} localidades={this.state.localidades}
            show={this.state.show} onHide={() => this.setState({ show: false })}
              handleShow={() => this.setState({ show: true })} onClick={() => this.setState({ show: false })}
              onsubmit={(cliente) => this.handleSubmit(cliente)} />
            {
              this.state.showModalModificar ?
              <ModalModificarEnvios selectedEnvio={this.state.selectedEnvio} clientes={this.state.clientes}
              selectedCliente={this.state.selectedCliente} localidades={this.state.localidades}
              show={this.state.showModalModificar} onHide={() => this.setState({ showModalModificar: false })}
              handleShow={() => this.setState({ showModalModificar: true })} onClick={() => this.setState({ showModalModificar: false })}
              onsubmit={(cliente) => this.handleSubmitModificar(cliente)} />
              : ''
            }

            {
              this.state.showModalEliminar ?
              <ModalEliminarEnvios selectedEnvio={this.state.selectedEnvio}
              show={this.state.showModalEliminar} onHide={() => this.setState({ showModalEliminar: false })}
              handleShow={() => this.setState({ showModalEliminar: true })} onClick={() => this.setState({ showModalEliminar: false })}
              onsubmit={(cliente) => this.handleSubmitEliminar(cliente)} />
              : ''
            }

            
            <Table striped bordered hover className={styles.tableComponentStyle}>
              <thead className="thead-dark">
                <tr >
                  <th scope="col" className='text-white'>#</th>
                  <th scope="col" className='text-white'>Nombre del cliente</th>
                  <th scope="col" className='text-white'>Teléfono</th>
                  <th scope="col" className='text-white'>Localidad</th>
                  <th scope="col" className='text-white'>Dirección exacta</th>
                  <th scope="col" className='text-white'>Fecha de envio</th>
                  <th scope="col" className='text-white'>Faltan</th>
                  <th scope="col" className='text-white'>Costo $</th>
                  <th scope="col" className='text-white'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.envios.map(envio => (
                    <tr key={envio.id_envio}>
                      <td className='text-white'>{envio.id_envio}</td>
                      <td className='text-white'>{envio.razon_social}</td>
                      <td className='text-white'>{envio.telefono}</td>
                      <td className='text-white'>{envio.localidad}</td>
                      <td className='text-white'>{envio.direccion}</td>
                      <td className='text-white'>{envio.fecha}</td>
                      <td className='text-white'>{envio.timeleft}</td>
                      <td className='text-white'>{envio.costo}</td>
                      <td>

                        <Button variant="primary" onClick={() => this.setState({
                          showModalModificar: true, 
                          selectedEnvio: envio,
                          selectedCliente: envio.localidad
                        })}>
                          Modificar
                        </Button>

                        <Button variant="danger"
                        onClick={() => this.setState({ showModalEliminar: true, selectedEnvio: envio })}
                          className={styles.eliminarBtn}>
                          {
                            envio.timeleft === 'Envío finalizado' ? 'Eliminar' : 'Cancelar'
                          }
                        </Button>

                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
            
        </div>
      </div>
    )
  }
  }
}

class ModalCargarEnvios extends Component<any, any>
{
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  selectedCliente: any;
  selectedDireccion: any;
  selectedFecha: any;
  selectedTelefono: any;
  selectedPrecio: any;

  handleSelectCliente(event)
  {
    this.selectedCliente = event;
    for (let i = 0; i < this.props.clientes.length; i++) {
      if (this.props.clientes[i].id_cliente.toString() === event.toString()) {
        this.setState({ selectedLocalidad: this.props.clientes[i].localidad });
        (document.getElementById('localidaddecliente') as HTMLInputElement).value = this.props.clientes[i].localidad;
        (document.getElementById('telefonodecliente') as HTMLInputElement).value = this.props.clientes[i].telefono;
        this.selectedTelefono = this.props.clientes[i].telefono;
      }
    }
  }

  render() {
    return (
      <>

        <Button variant="primary" onClick={this.props.handleShow} className={styles.cargarClientesBtn}>
          Cargar envio
        </Button>

        <Modal show={this.props.show} onHide={this.props.handleClose} backdrop={true} >

          <Modal.Header  className='bg-dark'>
            <Modal.Title  className='text-white'>
              Cargar envio
            </Modal.Title>
          </Modal.Header>

          <Modal.Body  className='bg-dark'>
            <form>
            <div className="form-group mt-2 mb-2">
                <label className='text-white'>Cliente</label>
                <select className="form-control"
                  name='selectedCliente' id='selectedCliente' 
                  onChange={(e) => this.handleSelectCliente(e.target.value)} defaultValue="seleccione">
                  <option value="seleccione" disabled>Seleccione un cliente</option>
                  {
                    this.props.clientes.map(cliente => (
                      <option key={cliente.id_cliente} value={cliente.id_cliente}>{cliente.razon_social}</option>
                    ))
                  }
                </select>
              </div>

              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Teléfono</label>
                <input type="text" className="form-control" disabled placeholder="Teléfono" name='telefonodecliente' id='telefonodecliente' 
                 onChange={(e) => this.selectedTelefono = e.target.value}/>
              </div>

              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Localidad del cliente</label>
                <input type="text" className="form-control" disabled placeholder="Localidad del cliente"
                name='localidaddecliente' id='localidaddecliente'/>
              </div>

              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Dirección de envío</label>
                <input type="text" className="form-control" placeholder="Dirección del cliente"
                name='direcciondecliente' id='direcciondecliente' onChange={(e) => this.selectedDireccion = e.target.value}/>
              </div>

              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Costo del envío</label>
                <input type="number" className="form-control" placeholder="Costo del envío"
                name='direcciondecliente' id='direcciondecliente' onChange={(e) => this.selectedPrecio = e.target.value}/>
              </div>

              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Fecha de envío</label>
                <input type="datetime-local" className="form-control" placeholder="Fecha de envío"
                name='fechadeenvio' id='fechadeenvio' onChange={(e) => this.selectedFecha = e.target.value}/>
              </div>

            </form>

          </Modal.Body>

          <Modal.Footer className='bg-dark'>
            <Button variant="secondary" onClick={() => this.props.onClick({})} >Cancelar</Button>
            <Button variant="primary" onClick={() =>
            this.props.onsubmit({
              id_cliente: this.selectedCliente,
              telefono: this.selectedTelefono,
              fecha: this.selectedFecha,
              direccion: this.selectedDireccion,
              costo: this.selectedPrecio,
            })}>
              Cargar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  };
}


class ModalModificarEnvios extends Component<any, any>
{
  constructor(props) {
    super(props)
    this.state =
    {
      clientes: null,
      localidades: null,
      selectedEnvio: null
    }
    console.log(this.props.selectedEnvio.fecha.substring(6, 10) + "-" +
    this.props.selectedEnvio.fecha.substring(3, 5) + "-" +
    this.props.selectedEnvio.fecha.substring(0, 2) + 'T' + this.props.selectedEnvio.fecha.substring(11, 16));
    
  }

  selectedCliente = this.props.selectedEnvio.id_cliente;
  localidadCliente = this.props.selectedEnvio.localidad;
  selectedDireccion = this.props.selectedEnvio.direccion;
  selectedFecha = this.props.selectedEnvio.fecha.substring(6, 10) + "-" +
  this.props.selectedEnvio.fecha.substring(3, 5) + "-" +
  this.props.selectedEnvio.fecha.substring(0, 2) + 'T' + this.props.selectedEnvio.fecha.substring(11, 16);
  

  selectedTelefono = this.props.selectedEnvio.telefono;
  selectedPrecio = this.props.selectedEnvio.costo;


  handleSelectCliente(event)
  {
    this.selectedCliente = event;
    for (let i = 0; i < this.props.clientes.length; i++) {
      if (this.props.clientes[i].id_cliente.toString() === event.toString()) {

        this.setState({ selectedLocalidad: this.props.clientes[i].localidad });

        (document.getElementById('localidaddecliente') as HTMLInputElement).value = this.props.clientes[i].localidad;
        (document.getElementById('telefonodecliente') as HTMLInputElement).value = this.props.clientes[i].telefono;
        this.selectedTelefono = this.props.clientes[i].telefono;
      }
    }
  }

  render() {
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose} backdrop={true} >

          <Modal.Header  className='bg-dark'>
            <Modal.Title  className='text-white'>
              Cargar envio
            </Modal.Title>
          </Modal.Header>

          <Modal.Body  className='bg-dark'>
            <form>
            <div className="form-group mt-2 mb-2">
                <label className='text-white'>Cliente</label>
                <select className="form-control"
                disabled
                  name='selectedCliente' id='selectedCliente' 
                  onChange={(e) => this.handleSelectCliente(e.target.value)} defaultValue={this.selectedCliente}>
                  <option value="seleccione" disabled>Seleccione un cliente</option>
                  {
                    this.props.clientes.map(cliente => (
                      <option key={cliente.id_cliente} value={cliente.id_cliente}>{cliente.razon_social}</option>
                    ))
                  }
                </select>
              </div>

              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Teléfono</label>
                <input type="text" className="form-control" disabled placeholder="Teléfono" name='telefonodecliente' id='telefonodecliente' 
                 onChange={(e) => this.selectedTelefono = e.target.value} 
                 defaultValue={this.selectedTelefono}/>
              </div>

              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Localidad del cliente</label>
                <input type="text" className="form-control" disabled placeholder="Localidad del cliente"
                name='localidaddecliente' id='localidaddecliente' value={this.state.selectedLocalidad}
                defaultValue={this.localidadCliente}/>
              </div>

              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Dirección de envío</label>
                <input type="text" className="form-control" placeholder="Dirección del cliente"
                name='direcciondecliente' id='direcciondecliente' onChange={(e) => this.selectedDireccion = e.target.value}
                defaultValue={this.selectedDireccion}/>
              </div>

              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Costo del envío</label>
                <input type="number" className="form-control" placeholder="Costo del envío"
                name='direcciondecliente' id='direcciondecliente' onChange={(e) => this.selectedPrecio = e.target.value}
                defaultValue={this.selectedPrecio}/>
              </div>

              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Fecha de envío</label>
                <input type="datetime-local" className="form-control" placeholder="Fecha de envío"
                name='fechadeenvio' id='fechadeenvio' onChange={(e) => this.selectedFecha = e.target.value}
                defaultValue={this.selectedFecha}/>
              </div>

            </form>

          </Modal.Body>

          <Modal.Footer className='bg-dark'>
            <Button variant="secondary" onClick={() => this.props.onClick({})} >Cancelar</Button>
            <Button variant="primary" onClick={() =>
            this.props.onsubmit({
              id_envio: this.props.selectedEnvio.id_envio,
              id_cliente: this.selectedCliente,
              telefono: this.selectedTelefono,
              fecha: this.selectedFecha,
              direccion: this.selectedDireccion,
              costo: this.selectedPrecio,
            })}>
              Cargar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  };
}

class ModalEliminarEnvios extends Component<any, any>
{
  constructor(props) {
    super(props)
    this.state =
    {
      selectedEnvio: null
    }
  }


  render() {
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose} backdrop={true} >

          <Modal.Header  className='bg-dark'>
            <Modal.Title  className='text-white'>
              Eliminar envio
            </Modal.Title>
          </Modal.Header>

          <Modal.Body  className='bg-dark'>
            <form>
            <div className="form-group mt-2 mb-2">
              <div className="form-group mt-2 mb-2">
                <label className='text-white'>Seguro que quiere borrar el envío?</label>
              </div>
            </div>

            </form>

          </Modal.Body>

          <Modal.Footer className='bg-dark'>
            <Button variant="secondary" onClick={() => this.props.onClick({})} >Cancelar</Button>
            <Button variant="danger" onClick={() =>
            this.props.onsubmit({
              envio: this.props.selectedEnvio
            })}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  };
}
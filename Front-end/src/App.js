import './App.css';
import { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { Nav } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Menu from './components/Menu/Menu.tsx';
import ABMClientes from './components/ABMClientes/ABMClientes.tsx';
import ABMEnvios from './components/ABMEnvios/ABMEnvios.tsx';


let token;


function getToken(apiURL)
{
  fetch(apiURL + "authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Observe: "body"
    },
    body: JSON.stringify({
      username: "user",
      password: "123",
    }),
  }).then(res => {
    return res.json();
  }).then(res => {
    token = res.token;
    if(sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === undefined)
    {
      sessionStorage.setItem('token', token);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });

}



function App() {
  const [data, setData] = useState('');
  const changeClientes = (childdata) => {
    setData(childdata);
  }
  const apiURL = "https://springbootangular11crud.herokuapp.com/api/";

  const apiURLEnvios = "https://nodejsenviosapi.herokuapp.com/api/";

  getToken(apiURL);

  return (
    <div className="App bg-dark">
      <Navbar bg="dark" expand="lg" className='navBarExpand text-light'>
        <Container fluid>
          <Navbar.Brand href='/' className='border border-danger rounded-pill cursor-pointer text-light'>CRUD system</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className='text-light bg-dark'>
            <Nav
              className="me-auto my-2 my-lg-0 "
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <NavDropdown title="Sistemas de ABM" id="navbarScrollingDropdown">
                <NavDropdown.Item href='clientes'>ABM de clientes</NavDropdown.Item>
                <NavDropdown.Item href='envios'>ABM de envios</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link>
                Sobre nosotros
              </Nav.Link>
            </Nav>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => {
                  changeClientes(e.target.value);}}
              />
              <Button variant="outline-danger">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Menu apiURL={apiURL} />} />
            <Route path="/clientes" element={<ABMClientes parentToChild={data} apiURL={apiURL} />} />
            <Route path="/envios" element={<ABMEnvios parentToChild={data} apiURLEnvios={apiURLEnvios} apiURL={apiURL} />} />
          </Routes>
        </BrowserRouter>
        <footer className="bg-dark footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="footer-copyright text-center py-3 text-white">
                <p>© 2022 Copyright:
                  <a href="https://github.com/tomastraini"> Tomás Traini</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        </footer>
    </div>
  );
}


export default App;

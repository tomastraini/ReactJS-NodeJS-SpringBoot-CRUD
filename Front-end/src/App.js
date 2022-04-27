import './App.css';
import ABMClientes from './components/ABMClientes/ABMClientes.tsx';
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
import { useState } from 'react';


let token;

function getToken()
{
  const res = fetch("https://springbootangular11crud.herokuapp.com/api/authenticate", {
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
    sessionStorage.setItem("token", token);
  });

}

getToken();


function App() {
  const [data, setData] = useState('');
  const changeClientes = (childdata) => {
    setData(childdata);
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg" className='navBarExpand'>
        <Container fluid>
          <Navbar.Brand href='/' className='border border-danger rounded-pill cursor-pointer'>CRUD system</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <NavDropdown title="Sistemas de ABM" id="navbarScrollingDropdown" >
                <NavDropdown.Item className='text-white' href='clientes'>ABM de clientes</NavDropdown.Item>
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
        <Route path="/" element={<Menu />} />
        <Route path="/clientes" element={<ABMClientes parentToChild={data} />} />
      </Routes>
    </BrowserRouter>
      
    </div>
  );
}


export default App;

import React from 'react';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavBar({ isAdmin, handleLogout }) {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">Dosivac</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
          {isAdmin && (
            <NavDropdown title="Administrador" id="admin-dropdown">
              <NavDropdown.Item as={Link} to="/admin/productos">Administrar productos</NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
        {isAdmin && (
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;


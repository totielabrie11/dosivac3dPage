import React from 'react';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';

function NavBar({ isAdmin, user, handleLogout }) {
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
        <Nav className="ml-auto">
          {user && (
            <span style={{ marginRight: '10px' }}>
              {user.name} ({user.role})
            </span>
          )}
          <Nav.Link as={Link} to="/login">
            <FaCog style={{ fontSize: '1.5em' }} />
          </Nav.Link>
          {isAdmin && (
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;

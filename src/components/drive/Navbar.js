import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
const NavbarComp = () => {
  return (
    // <Navbar bg="light" expand="xxl">
    //   <Navbar.Brand as={Link} to="/">
    //     GDrive
    //   </Navbar.Brand>
    //   <Nav>
    //     <Nav.Link as={Link} to="/profile">
    //       Profile
    //     </Nav.Link>
    //   </Nav>
    // </Navbar>
    <Navbar bg="light" expand="sm">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          GDrive
        </Navbar.Brand>
        <Nav>
          <Nav.Link as={Link} to="/profile">
            Profile
          </Nav.Link>
        </Nav>
        {/* <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse> */}
      </Container>
    </Navbar>
  );
};

export default NavbarComp;

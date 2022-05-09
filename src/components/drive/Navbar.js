import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context";
const NavbarComp = () => {
  const { isDemo, setErrorMsg, logout, setIsDemo } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setErrorMsg("");

    try {
      await logout();
      localStorage.clear();
      setIsDemo(false);
      navigate("/login");
    } catch (error) {
      setErrorMsg(error.massage);
    }
  }
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
          {isDemo ? (
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
          )}
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

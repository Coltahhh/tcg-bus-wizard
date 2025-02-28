import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';

export default function Navigation() {
    return (
        <Navbar bg="warning" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">🏴‍☠️ TCGBusWizard</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/tournaments">Tournaments</Nav.Link>
                        <Nav.Link as={Link} to="/ranking">Ranking</Nav.Link>
                        <Nav.Link as={Link} to="/prizing">Prizing</Nav.Link>
                    </Nav>
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                            Login/Signup
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#login">Login</Dropdown.Item>
                            <Dropdown.Item href="#signup">Sign Up</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
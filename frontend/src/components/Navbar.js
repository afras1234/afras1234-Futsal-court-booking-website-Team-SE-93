import React, { useState } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

const NavigationBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // This will be connected to your auth system later

    return (
        <Navbar bg="white" expand="lg" fixed="top" className="py-3 shadow-sm">
            <Container>
                <Navbar.Brand href="#" className="d-flex align-items-center">
                    <img
                        src="/logo.png" // Add your logo file to the public folder
                        alt="FutsalHub Logo"
                        height="40"
                        className="me-2"
                    />
                    FutsalHub
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-4">
                        <Nav.Link href="#" className="me-3">Home</Nav.Link>
                        <Nav.Link href="#" className="me-3">Courts</Nav.Link>
                        <Nav.Link href="#" className="me-3">Tournaments</Nav.Link>
                        <Nav.Link href="#" className="me-3">Chat</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {isLoggedIn ? (
                            <Nav.Link href="/profile" className="d-flex align-items-center">
                                <FaUser className="me-2" />
                                Profile
                            </Nav.Link>
                        ) : (
                            <>
                                <Button variant="outline-success" className="me-3">
                                    Sign Up
                                </Button>
                                <Button variant="success">
                                    Login
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;

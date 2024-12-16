import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Navbar, Form, Row, Col, Button } from "react-bootstrap"; // Bootstrap imports
import { API_ENDPOINT } from "./API"; 

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // If token exists, user is logged in
      navigate("/dashboard"); // Redirect to dashboard
    }
  }, [navigate]);

  // Handle form submission (Login)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call API for login
      const response = await axios.post(`${API_ENDPOINT}/user/login`, {
        username,
        password,
      });

      // Store the Bearer token in localStorage
      const token = response.data.token;  // Assuming 'token' is returned in response data
      localStorage.setItem("token", token);  // Store the token for future requests
      setError("");  // Clear previous errors

      // Set login state and navigate to dashboard after delay to avoid navigation issues
      setIsLoggedIn(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);  // 500ms delay

    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <>
      <Navbar bg="success" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="home">Naga College Foundation, Inc.</Navbar.Brand>
        </Container>
      </Navbar>

      <br />
      <br />
      <br />
      <br />

      <Container>
        <Row className="justify-content-md-center">
          <Col md={4}>
            <div className="login-form">
              <div className="login-logo">
                {/* <img src={logo} width={"38%"} alt="Logo" /> */}
              </div>

              <center>
                <h5>NCFI: A Proposed Enrollment System Using Serverless Computing</h5>
              </center>

              <div className="card">
                <div className="card-body login-card-body">
                  <form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername">
                      <Form.Label>Username:</Form.Label>
                      <Form.Control
                        className="form-control-sm rounded-0"
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="formPassword">
                      <Form.Label>Password:</Form.Label>
                      <Form.Control
                        className="form-control-sm rounded-0"
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <Form.Group controlId="formButton">
                      <Button
                        variant="success"
                        className="btn btn-block btn-custom btn-flat rounded-0"
                        size="sm"
                        block="block"
                        type="submit"
                      >
                        Log in Now
                      </Button>
                    </Form.Group>
                  </form>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;

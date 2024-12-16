import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";

import { API_ENDPOINT } from "./API";

import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

import Dashboard from "./Dashboard";
import Login from "./Login";

function App() {
  return (
    <>
      <Router>
        <Row>
          <Col>
            <Routes>
            <Route path="/" element={<Login />} />
<Route path="/login" element={<Login />} />
<Route path="/dashboard" element={<Dashboard />} />

            </Routes>
          </Col>
        </Row>
      </Router>
    </>
  );
}

export default App;

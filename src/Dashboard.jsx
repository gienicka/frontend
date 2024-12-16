import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { API_ENDPOINT } from './Api';

function Dashboard() {
    const [user, setUser] = useState(null); // Current logged-in user
    const [users, setUsers] = useState([]); // List of users from the API
    const [selectedUser, setSelectedUser] = useState(null); // Selected user for the modal
    const [showModal, setShowModal] = useState(false); // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false); // Modal state for Create User
    const [showUpdateModal, setShowUpdateModal] = useState(false); // Modal state for Update User
    const [newUser, setNewUser] = useState({ fullname: '', username: '', password: '' }); // New user state
    const [editUser, setEditUser] = useState({ user_id: '', fullname: '', username: '' }); // Edit user state
    const navigate = useNavigate();

    // Fetch all users
    const getAllUsers = async (token) => {
        try {
            const response = await axios.get(`${API_ENDPOINT}/user/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (Array.isArray(response.data.users)) {
                setUsers(response.data.users);
            } else {
                console.error('Expected an array of users, but got:', response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Check if user is logged in and has a token
    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                setUser({ username: 'User', type_id: 'Admin' });
                await getAllUsers(token); // Fetch users with token
            } catch (error) {
                console.error('Error checking token:', error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        checkToken();
    }, [navigate]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Open modal to display selected user details
    const handleReadUser = (user) => {
        setSelectedUser(user); // Set the selected user
        setShowModal(true); // Show modal
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    // Open Create User Modal
    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    // Close Create User Modal
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewUser({ fullname: '', username: '', password: '' }); // Reset fields
    };

    // Open Update User Modal
    const handleOpenUpdateModal = (user) => {
        setEditUser({ user_id: user.user_id, fullname: user.fullname || user.name, username: user.username });
        setShowUpdateModal(true);
    };

    // Close Update User Modal
    const handleCloseUpdateModal = () => {
        setShowUpdateModal(false);
        setEditUser({ user_id: '', fullname: '', username: '' }); // Reset fields
    };

    // Handle input changes for creating a new user
    const handleCreateUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    // Handle input changes for updating a user
    const handleUpdateUserChange = (e) => {
        const { name, value } = e.target;
        setEditUser((prev) => ({ ...prev, [name]: value }));
    };

    // Submit new user to the API
    const handleCreateUser = async () => {
        try {
            const response = await axios.post(`${API_ENDPOINT}/user/register`, newUser);
            console.log('User created:', response.data);

            // Fetch the updated list of users
            const token = localStorage.getItem('token');
            await getAllUsers(token);

            // Close modal and reset form
            handleCloseCreateModal();
        } catch (error) {
            console.error('Error creating user:', error.response ? error.response.data : error.message);
            alert('Error creating user. Please try again.');
        }
    };

    // Submit user update to the API
    const handleUpdateUser = async () => {
        try {
            const response = await axios.post(`${API_ENDPOINT}/user/update`, editUser); // Correct endpoint for update
            console.log('User updated:', response.data);

            // Fetch the updated list of users
            const token = localStorage.getItem('token');
            await getAllUsers(token);

            // Close modal and reset form
            handleCloseUpdateModal();
        } catch (error) {
            console.error('Error updating user:', error.response ? error.response.data : error.message);
            alert('Error updating user. Please try again.');
        }
    };

    // Delete user by user_id
    const handleDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(`${API_ENDPOINT}/user/delete`, {
                data: { user_id: userId }
            });
            console.log('User deleted:', response.data);

            // Fetch the updated list of users
            const token = localStorage.getItem('token');
            await getAllUsers(token);

            alert('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error.response ? error.response.data : error.message);
            alert('Error deleting user. Please try again.');
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Navbar bg="success" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home">Naga College Foundation, Inc.</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#users">Users</Nav.Link>
                        <Nav.Link href="#departments">Departments</Nav.Link>
                        <Nav.Link href="#courses">Courses</Nav.Link>
                    </Nav>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <NavDropdown title={`User: ${user.username}`} id="basic-nav-dropdown" align="end">
                                <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
                                <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                                <NavDropdown.Item href="#" onClick={handleLogout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <h1>Users</h1>
                <Button variant="success" className="mb-3" onClick={handleOpenCreateModal}>
                    Create User
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Username</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.user_id}</td>
                                <td>{u.fullname || u.name}</td>
                                <td>{u.username}</td>
                                <td>
                                    <Button variant="primary" className="me-2" onClick={() => handleReadUser(u)}>
                                        Read
                                    </Button>
                                    <Button variant="warning" className="me-2" onClick={() => handleOpenUpdateModal(u)}>
                                        Update
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteUser(u.user_id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            {/* Modal to display selected user details */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <>
                            <p><strong>ID:</strong> {selectedUser.user_id}</p>
                            <p><strong>Full Name:</strong> {selectedUser.fullname || selectedUser.name}</p>
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal to create a new user */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter full name"
                                name="fullname"
                                value={newUser.fullname}
                                onChange={handleCreateUserChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                value={newUser.username}
                                onChange={handleCreateUserChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={newUser.password}
                                onChange={handleCreateUserChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreateModal}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleCreateUser}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal to update an existing user */}
            <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter full name"
                                name="fullname"
                                value={editUser.fullname}
                                onChange={handleUpdateUserChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                value={editUser.username}
                                onChange={handleUpdateUserChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUpdateModal}>
                        Cancel
                    </Button>
                    <Button variant="warning" onClick={handleUpdateUser}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Dashboard;

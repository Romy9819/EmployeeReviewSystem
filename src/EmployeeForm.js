import React, { useState } from 'react';
import axios from 'axios';

const EmployeeForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const employeeData = {
      name,
      email,
      username,
      role,
      password,
    };

    axios.post('/employees', employeeData)
      .then((response) => {
        console.log(response.data.message);
        // Reset form fields
        setName('');
        setEmail('');
        setUsername('');
        setRole('');
        setPassword('');
      })
      .catch((error) => {
        console.error('Error creating employee:', error);
      });
  };

  return (
    <div>
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Username:
          <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label>
          Role:
          <input type="text" value={role} onChange={(event) => setRole(event.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default EmployeeForm;

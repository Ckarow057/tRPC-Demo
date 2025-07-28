import React, { useState } from 'react';
import { trpc } from './lib/trpc';

function App() {
  const [name, setName] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  // Example of calling tRPC queries
  const handleGreeting = async () => {
    try {
      const result = await trpc.hello.query({ name: name || undefined });
      console.log(result); // Full type safety!
      alert(result.greeting);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleHealthCheck = async () => {
    try {
      const health = await trpc.healthCheck.query();
      console.log('Health:', health);
      alert(`Database is ${health.status}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      const result = await trpc.createUser.mutate({
        name: 'John Doe',
        email: 'john@example.com'
      });
      console.log('User created:', result);
      // Refresh users list
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const userList = await trpc.getUsers.query();
      setUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  return (
    <div className="App">
      <h1>tRPC + TypeScript Demo</h1>

      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleGreeting}>Say Hello</button>
      </div>

      <div>
        <button onClick={handleHealthCheck}>Check Health</button>
        <button onClick={handleCreateUser}>Create Test User</button>
        <button onClick={loadUsers}>Load Users</button>
      </div>

      <div>
        <h2>Users:</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.name} - {user.email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

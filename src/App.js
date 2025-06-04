import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    const { data } = await api.get('/items');
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    if (editingId) {
      await api.put(`/items/${editingId}`, { text });
      setEditingId(null);
    } else {
      await api.post('/items', { text });
    }

    setText('');
    fetchItems();
  };

  const editItem = (item) => {
    setText(item.text);
    setEditingId(item.id);
  };

  const deleteItem = async (id) => {
    await api.delete(`/items/${id}`);
    fetchItems();
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Flask + React CRUD</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: '1rem' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter item"
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((it) => (
          <li
            key={it.id}
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
          >
            <span>{it.text}</span>
            <span>
              <button onClick={() => editItem(it)} style={{ marginRight: '0.5rem' }}>
                Edit
              </button>
              <button onClick={() => deleteItem(it.id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
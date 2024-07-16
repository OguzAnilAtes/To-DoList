import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notes.css';  // Import the CSS file for styling

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Authorization error. Please log in again.');
      window.location.href = '/';
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await axios.get('https://localhost:7144/Note/Index', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data)) {
          setNotes(response.data);
        } else {
          console.error('API response is not an array:', response.data);
          setNotes([]);
        }
      } catch (error) {
        console.error('Authorization error:', error);
        alert('Authorization error. Please log in again.');
        window.location.href = '/';
      }
    };

    fetchNotes();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Authorization error. Please log in again.');
      window.location.href = '/';
      return;
    }

    try {
      const response = await axios.post('https://localhost:7144/Note/Add', { title, text }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNotes([...notes, response.data]); // Add the new note to the list
      setTitle('');
      setText('');
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Error adding note');
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        alert('Authorization error. Please log in again.');
        window.location.href = '/';
        return;
      }
  
      const response = await axios.delete(`https://localhost:7144/Note/Delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 204) {
        // Notu yerel state'ten kaldırın
        setNotes(notes.filter(note => note.id !== id));
      } else {
        console.error('Error deleting note:', response.statusText);
        alert('Error deleting note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note');
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Authorization error. Please log in again.');
      window.location.href = '/';
      return;
    }

    try {
      const response = await axios.put(`https://localhost:7144/Note/Update/${editNoteId}`, { title: editTitle, text: editText }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setNotes(notes.map(note => (note.id === editNoteId ? response.data : note)));
      setEditNoteId(null);
      setEditTitle('');
      setEditText('');
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Error updating note');
    }
};

  return (
    <div className="notes-container">
      <h2>My Notes</h2>
      {notes.length > 0 ? (
        notes.map(note => (
          <div key={note.id} className="note">
            {editNoteId === note.id ? (
              <form onSubmit={handleUpdateNote} className="note-form">
                <div>
                  <label>Title:</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label>Text:</label>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setEditNoteId(null)} className="btn-secondary">
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
                <button onClick={() => handleDeleteNote(note.id)} className="btn-danger">Delete</button>
                <button
                  onClick={() => {
                    setEditNoteId(note.id);
                    setEditTitle(note.title);
                    setEditText(note.text);
                  }}
                  className="btn-secondary"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))
      ) : (
        <div>No notes found.</div>
      )}
      <form onSubmit={handleAddNote} className="note-form">
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Text:</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)}></textarea>
        </div>
        <button type="submit" className="btn-primary">Add Note</button>
      </form>
    </div>
  );
};

export default Notes;

import React, { useState } from 'react';
import './NewArticles.css';

const NewArticles = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, author, content, date });
    setTitle('');
    setAuthor('');
    setContent('');
    setDate('');
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>New Article</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Author" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            required 
          />
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
          <textarea 
            placeholder="Content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
          />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default NewArticles;

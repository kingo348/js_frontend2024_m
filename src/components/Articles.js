import React, { useState, useEffect } from 'react';
import NewArticles from './NewArticles';
import './Articles.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [comment, setComment] = useState('');
  const [nickname, setNickname] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [editingArticleContent, setEditingArticleContent] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(null); 

  useEffect(() => {
    fetch('http://localhost:8000/articles')
      .then(res => res.json())
      .then(data => setArticles(data));
  }, []);

  const handleCommentSubmit = async (e, articleId) => {
    e.preventDefault();
    await fetch(`http://localhost:8000/articles/${articleId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: comment, author: nickname }),
    });
    setComment('');
    setNickname('');
    onArticlesChange();
    setIsCommentPopupOpen(null); 
  };

  const onArticlesChange = async () => {
    const response = await fetch('http://localhost:8000/articles');
    const data = await response.json();
    setArticles(data);
  };

  const handleArticleDelete = async (articleId) => {
    await fetch(`http://localhost:8000/articles/${articleId}`, {
      method: 'DELETE',
    });
    onArticlesChange();
  };

  const handleCommentDelete = async (articleId, commentId) => {
    await fetch(`http://localhost:8000/articles/${articleId}/comments/${commentId}`, {
      method: 'DELETE',
    });
    onArticlesChange();
  };

  const handleLikeArticle = async (articleId) => {
    await fetch(`http://localhost:8000/articles/${articleId}/like`, {
      method: 'PATCH',
    });
    onArticlesChange();
  };

  const handleLikeComment = async (articleId, commentId) => {
    await fetch(`http://localhost:8000/articles/${articleId}/comments/${commentId}/like`, {
      method: 'PATCH',
    });
    onArticlesChange();
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  const handleSaveComment = async (articleId, commentId) => {
    await fetch(`http://localhost:8000/articles/${articleId}/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: editingCommentContent }),
    });
    setEditingCommentId(null);
    setEditingCommentContent('');
    onArticlesChange();
  };

  const handleEditArticle = (articleId, content) => {
    setEditingArticleId(articleId);
    setEditingArticleContent(content);
  };

  const handleSaveArticle = async (articleId) => {
    await fetch(`http://localhost:8000/articles/${articleId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: editingArticleContent }),
    });
    setEditingArticleId(null);
    setEditingArticleContent('');
    onArticlesChange();
  };

  const handleNewArticleSave = async (newArticle) => {
    await fetch('http://localhost:8000/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newArticle),
    });
    onArticlesChange();
    setIsPopupOpen(false);
  };

  return (
    <div className="articles-container">
      <h1>Articles</h1>
      <button className="new-article-btn" onClick={() => setIsPopupOpen(true)}>Add New Article</button>
      <ul className="articles-list">
        {articles.map((article, index) => (
          <li key={index} className="article-item">
            <h2 className="article-title">{article.name}</h2>
            <p className="article-author"><strong>Author:</strong> {article.author}</p>
            <p className="article-date"><strong>Date:</strong> {article.date}</p>
            {editingArticleId === article._id ? (
              <textarea
                value={editingArticleContent}
                onChange={(e) => setEditingArticleContent(e.target.value)}
              />
            ) : (
              <p className="article-content">{article.content}</p>
            )}
            {editingArticleId === article._id ? (
              <button className="save-btn" onClick={() => handleSaveArticle(article._id)}>
                <i className="fas fa-check"></i>
              </button>
            ) : (
              <button className="edit-btn" onClick={() => handleEditArticle(article._id, article.content)}>
                <i className="fas fa-pencil-alt"></i>
              </button>
            )}
            <button className="delete-btn" onClick={() => handleArticleDelete(article._id)}>
              <i className="fas fa-times"></i>
            </button>
            <button className="like-btn" onClick={() => handleLikeArticle(article._id)}>
              <i className="fas fa-heart"></i> {article.likes}
            </button>
            <ul className="comments-list">
              {article.comments && article.comments.map((comment, i) => (
                <li key={i} className="comment-item">
                  <strong>{comment.author}:</strong>
                  {editingCommentId === comment._id ? (
                    <input
                      type="text"
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
                    />
                  ) : (
                    <span>{comment.content}</span>
                  )}
                  {editingCommentId === comment._id ? (
                    <button className="save-btn" onClick={() => handleSaveComment(article._id, comment._id)}>
                      <i className="fas fa-check"></i>
                    </button>
                  ) : (
                    <button className="edit-btn" onClick={() => handleEditComment(comment._id, comment.content)}>
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  )}
                  <button className="delete-btn" onClick={() => handleCommentDelete(article._id, comment._id)}>
                    <i className="fas fa-times"></i>
                  </button>
                  <button className="like-btn" onClick={() => handleLikeComment(article._id, comment._id)}>
                    <i className="fas fa-heart"></i> {comment.likes}
                  </button>
                </li>
              ))}
            </ul>
            <button className="new-comment-btn" onClick={() => setIsCommentPopupOpen(article._id)}>Add Comment</button>
            {isCommentPopupOpen === article._id && (
              <div className="popup">
                <div className="popup-content">
                  <span className="close" onClick={() => setIsCommentPopupOpen(null)}>&times;</span>
                  <form onSubmit={(e) => handleCommentSubmit(e, article._id)}>
                    <input 
                      type="text" 
                      placeholder="Nickname" 
                      value={nickname} 
                      onChange={(e) => setNickname(e.target.value)} 
                      required 
                    />
                    <textarea 
                      placeholder="Comment" 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)} 
                      required 
                    />
                    <button type="submit">Submit</button>
                  </form>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {isPopupOpen && <NewArticles onClose={() => setIsPopupOpen(false)} onSave={handleNewArticleSave} />}
    </div>
  );
};

export default Articles;

import React from 'react';
import './Articles.css';

class Articles extends React.Component {	
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
    };
  }
	
	componentDidMount() {
		fetch('http://localhost:8000/articles').then(function(res) {
			return res.json();
		}).then((data) => {
      console.log(data);
			this.setState({ articles: data});

		});
	}

	render() {
    const { articles} = this.state;
		return (

			<div className="articles-container">
        <h1>Articles</h1>
        <ul className="articles-list">
          {articles.map((article, index) => (
            <li key={index} className="article-item">
              <h2 className="article-title">{article.name}</h2>
              <p className="article-author"><strong>Author:</strong> {article.author}</p>
              <p className="article-date"><strong>Date:</strong> {article.date}</p>
              <p className="article-content">{article.content}</p>
            </li>
          ))}
        </ul>
      </div>
		);
	}
}

export default Articles;
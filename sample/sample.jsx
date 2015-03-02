/** @jsx React.DOM */
'use strict';

var React         = require('react');
var ReactPaginate = require('./../react_components');
var $             = require('jquery');

window.React = React;


var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, index) {
      return (
        <div>{comment.comment}</div>
      );
    });
    return (
      <div id="project-comments" className="commentList">
        <ul>
          {commentNodes}
        </ul>
      </div>
    );
  }
});

var App = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: 'http://localhost:3000/comments',
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({data: data.comments, pageNum: (data.meta.total_count / data.meta.limit)});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handlePageClick: function(data) {
    var selected = data.selected;
    this.setState({offset: Math.ceil((selected) * this.props.perPage)});
    this.loadCommentsFromServer();
  },
  getInitialState: function() {
    return {data: [], offset: 0};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    if (this.props.pollInterval > 0) {
      setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    }
  },
  render: function () {
    return (
      <div className="commentBox">
        <CommentList data={this.state.data} />
        <ReactPaginate previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={"..."}
                       pageNum={this.state.pageNum}
                       marginPagesDisplayed={2}
                       pageRangeDisplayed={5}
                       clickCallback={this.handlePageClick} />
      </div>
    );
  }
});

React.renderComponent(
  <App url={'http://localhost:3000/comments'}
       author={'adele'}
       perPage={10} />,
  document.getElementById('react-paginate')
);

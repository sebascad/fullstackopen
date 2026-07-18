const BlogForm = (props) => {
  return(
    <form onSubmit={props.handleCreateBlog}>
      <div>
        title
          <input
            type='text' value={props.title} name='title' onChange={props.handleBlogChange}
          />
      </div>
      <div>
        author
          <input
            type='text' value={props.author} name='author' onChange={props.handleBlogChange}
            />
      </div>
      <div>
        url
          <input
          type='text' value={props.url} name='url' onChange={props.handleBlogChange}
            />
      </div>
      <button type='submit'>send</button>
      </form>    
  )
}

export default BlogForm
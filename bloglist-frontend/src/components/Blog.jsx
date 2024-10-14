import { useRef } from "react"
import Toggleable from "./Toggleable"
import PropTypes from "prop-types"

const Blog = ({ user, blog, changeBlog, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  }
  Blog.propTypes = {
    user: PropTypes.shape({
      token: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    blog: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired
    }),
    changeBlog: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired
  }

  const blogRef = useRef()

  const showRemove = () => {
    if (blog.user && blog.user.username === user.username) {
      return <button onClick={deleteBlog}>remove</button>
    }
  }

  const addLike = async () => {

    changeBlog({
      id: blog.id
    }, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    })
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }

  return (
    <div className="blog" style={blogStyle}>
      <Toggleable buttonLabel="view" hideLabel="hide" ref={blogRef} leftToButton={`${blog.title} ${blog.author}`}>
        <div className="blogIsHidden">
          <div>{blog.url}</div>
          <div>likes {blog.likes}<button onClick={addLike}>like</button></div>
          <div>{blog.user.name}</div>
          {showRemove()}
        </div>
      </Toggleable>

    </div>
  )}

export default Blog
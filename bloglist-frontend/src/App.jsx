import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import BlogLogout from "./components/BlogLogout"
import BlogForm from "./components/BlogForm"
import blogService from "./services/blogs"
import loginService from "./services/login"
import "./index.css"
import Toggleable from "./components/Toggleable"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const bloggar = await blogService.getAll()
      const blogsSorted = bloggar.toSorted((a,b) => b.likes - a.likes)
      setBlogs(blogsSorted)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      setUser(user)

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))

      console.log("logged in with", username)
      setMessage(`logged in as ${username}`)
      setTimeout(() => setMessage(null), 5000)

      setUsername("")
      setPassword("")
    } catch (exception) {
      setErrorMessage("wrong username or password")
      setTimeout(() => {setErrorMessage(null)}, 3000)
    }
  }
  const handleLogout = async (event) => {
    window.localStorage.removeItem("loggedBlogappUser")
    setUser(null)
    setMessage("Logged out")
    setTimeout(() => setMessage(null), 2000)
  }

  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    try {
      const created = await blogService.create(blogObject)
      const createdBlogs = blogs.concat(created)
      setBlogs(createdBlogs.toSorted((a,b) => b.likes - a.likes))
      blogFormRef.current.toggleVisibility()
      setMessage(`a new blog ${created.title} by ${created.author} added`)
      setTimeout(() => setMessage(null), 5000)
    } catch (exception) {
      const errorMsg = exception.response.data.error || "Bad request"
      setErrorMessage(errorMsg)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }
  const addLike = async (id, blogObject) => {
    try {
      const added = await blogService.change(id.id, blogObject)
      const addedBlogs = blogs.map(blog => blog.id === id.id ? { ...blog, likes: added.likes } : blog)
      setBlogs(addedBlogs.toSorted((a,b) => b.likes - a.likes))
      setMessage(`a like added to blog ${added.title} with ${added.likes} likes`)
      setTimeout(() => setMessage(null), 1000)

    } catch (exception) {
      const errorMsg = exception.response.data.error || "Bad request"
      setErrorMessage(errorMsg)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }
  const deleteBlog = async id => {
    try {
      console.log("Attempting to delete blog with id:", id)
      await blogService.deleteObject(id)
      console.log("Deleted blog")
      const deletedBlogs = blogs.filter(blog => blog.id !== id)
      setBlogs(deletedBlogs.toSorted((a,b) => b.likes - a.likes))
      setMessage("Deleted blog")
      setTimeout(() => setMessage(null), 2000)
    } catch (exception) {
      const errorMsg = exception.response.data.error || "Bad request"
      setErrorMessage(errorMsg)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  return (
    <div>
      {!user && <div>
        <LoginForm handleLogin={handleLogin} message={message} errorMessage={errorMessage} username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>
      </div>}
      {user && <div>
        <BlogLogout message={message} errorMessage={errorMessage} user={user} handleLogout={handleLogout}/>
        <Toggleable buttonLabel="create new blog" hideLabel="cancel" ref={blogFormRef}>
          <BlogForm createBlog={addBlog}/>
        </Toggleable>
        {blogs.map(blog =>
          <div key={blog.id}>
            <Blog blog={blog} changeBlog={addLike} removeBlog={deleteBlog} user={user}/>
          </div>
        )}
      </div>
      }
    </div>
  )
}

export default App
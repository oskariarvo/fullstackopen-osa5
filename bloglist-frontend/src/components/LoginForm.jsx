import Notification from "./Notification"
import PropTypes from "prop-types"

const LoginForm = ({ handleLogin, message, errorMessage, username, setUsername, password, setPassword }) => {
  LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    message: PropTypes.string,
    errorMessage: PropTypes.string,
    username: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
    password: PropTypes.string.isRequired,
    setPassword: PropTypes.func.isRequired
  }


  return (
    <div>
      <h2>Login to application</h2>
      <Notification message={message} errorMessage={errorMessage}/>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)}/>
        </div>
        <div>
          password
          <input type="text" value={password} name="Password" onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )}

export default LoginForm
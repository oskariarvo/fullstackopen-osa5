import Notification from "./Notification"
import PropTypes from "prop-types"

const BlogLogout = ({ message, errorMessage, user, handleLogout }) => {
  BlogLogout.propTypes = {
    message: PropTypes.string,
    errorMessage: PropTypes.string,
    user: PropTypes.shape({
      token: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    handleLogout: PropTypes.func.isRequired
  }


  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} errorMessage={errorMessage}/>
      <p data-testid="notification" >logged in as {user.username}
        <button type="submit" onClick={handleLogout}>logout</button>
      </p>
    </div>
  )}

export default BlogLogout
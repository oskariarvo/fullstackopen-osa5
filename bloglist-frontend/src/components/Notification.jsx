const Notification = ({ message, errorMessage }) => {
  if (!message && !errorMessage) {
    return null
  }
  if (message) {
    return <div className={"positive"}>{message}</div>

  } if (errorMessage) {
    return <div className={"negative"}>{errorMessage}</div>
  }
}

export default Notification
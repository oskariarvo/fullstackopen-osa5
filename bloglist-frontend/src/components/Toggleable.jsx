import { useState, useImperativeHandle, forwardRef } from "react"
import PropTypes from "prop-types"

const Toggleable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  Toggleable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    hideLabel: PropTypes.string.isRequired,
    leftToButton: PropTypes.string
  }

  const hideWhenVisible = { display: visible ? "none" : "" }
  const showWhenVisible = { display: visible ? "" : "none" }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  const differentOrder = () => {
    if (props.leftToButton !== undefined) {
      return (
        <div>
          {props.leftToButton && <span>{props.leftToButton} </span>}
          <button onClick={toggleVisibility}>{props.hideLabel}</button>
          {props.children}
        </div>
      )}
    return (
      <div>
        {props.leftToButton && <span>{props.leftToButton} </span>}
        {props.children}
        <button onClick={toggleVisibility}>{props.hideLabel}</button>
      </div>
    )
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        {props.leftToButton} <button onClick={toggleVisibility} data-testid="toggleableButtonLabel">{props.buttonLabel}</button>
      </div>
      {visible && (
        <div style={showWhenVisible} className="toggleableNotShown">
          <div>
            {differentOrder()}
          </div>
        </div>
      )}
    </div>
  )
})

Toggleable.displayName = "Toggleable"

export default Toggleable
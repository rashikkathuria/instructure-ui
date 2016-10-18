import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

/**
  The `<Portal/>` component allows you to render a subtree into another container.

  ```jsx_example
  class App extends React.Component {
    constructor (props) {
      super(props)

      this.state = {
        isPortalOpen: false
      }
    }

    handleButtonClick = () => {
      this.setState({
        isPortalOpen: !this.state.isPortalOpen
      })
    }

    render () {
      return (
        <div>
          <Button onClick={this.handleButtonClick}>
            {this.state.isPortalOpen ? 'Close' : 'Open'} the Portal
          </Button>
          <Portal
            container={() => this._container}
            isOpen={this.state.isPortalOpen}
          >
            <ContextBox>
              <p>Greetings from the portal!</p>
            </ContextBox>
          </Portal>
          <Typography>
            <p>{lorem.paragraph()}</p>
            <div ref={(c) => this._container = c}></div>
            <p>{lorem.paragraph()}</p>
          </Typography>
        </div>
      )
    }
  }

  <App />
  ```
**/
export default class Portal extends Component {
  static defaultProps = {
    isOpen: false,
    container: () => document.body
  }

  static propTypes = {
    /**
     * Wheter or not the `<Portal />` is open
     */
    isOpen: PropTypes.bool,

    /**
     * Callback fired when `<Portal />` content has been rendered
     */
    onReady: PropTypes.func,

    /**
     * Callback fired when `<Portal />` has been closed
     */
    onClose: PropTypes.func,

    /**
     * The children to be rendered within the `<Portal />`
     */
    children: PropTypes.node,

    /**
     * An element or a function returning an element to use as the container
     * for the `<Portal />`
     */
    container: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ])
  }

  constructor (props) {
    super(props)

    this._node = document.createElement('div')
  }

  componentDidMount () {
    this.renderPortal(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.renderPortal(nextProps)
  }

  componentWillUnmount () {
    this.removePortal()
  }

  render () {
    return null
  }

  renderPortal (props) {
    const container = this.getContainer()
    let children = props.children

    if (typeof children === 'string') {
      children = <span>{children}</span>
    }

    if (props.isOpen) {
      container.appendChild(this._node)
      ReactDOM.unstable_renderSubtreeIntoContainer(this, children, this._node, props.onReady)
    } else {
      // Close the portal
      if (this.removePortal() &&
          typeof props.onClose === 'function') {
        props.onClose()
      }
    }
  }

  removePortal () {
    if (this._node && this._node.parentNode) {
      this._node.parentNode.removeChild(this._node)
    }
    return ReactDOM.unmountComponentAtNode(this._node)
  }

  getContainer () {
    let container

    if (typeof this.props.container === 'function') {
      container = this.props.container.call(null)
    } else {
      container = ReactDOM.findDOMNode(this.props.container)
    }

    if (!container || !container.nodeName) {
      container = document.body
    }

    return container
  }
}
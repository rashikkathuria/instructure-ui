/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import keycode from 'keycode'
import classnames from 'classnames'
import noScroll from 'no-scroll'

import themeable from '@instructure/ui-themeable'
import createChainedFunction from '@instructure/ui-utils/lib/createChainedFunction'
import ensureSingleChild from '@instructure/ui-utils/lib/react/ensureSingleChild'
import contains from '@instructure/ui-utils/lib/dom/contains'
import { omitProps } from '@instructure/ui-utils/lib/react/passthroughProps'

import styles from './styles.css'
import theme from './theme'

/**
---
category: components/utilities
---
**/
@themeable(theme, styles)
class Mask extends Component {
  static propTypes = {
    onDismiss: PropTypes.func,
    placement: PropTypes.oneOf(['top', 'center', 'bottom']),
    fullScreen: PropTypes.bool,
    children: PropTypes.node,
    onClick: PropTypes.func,
    onKeyUp: PropTypes.func
  }

  static defaultProps = {
    children: undefined,
    onClick: undefined,
    onKeyUp: undefined,
    onDismiss: undefined,
    placement: 'center',
    fullScreen: false
  }

  componentDidMount () {
    if (this.props.fullScreen) {
      noScroll.on()
    }
  }

  componentWillUnmount () {
    if (this.props.fullScreen) {
      noScroll.off()
    }
  }

  dismiss = event => {
    if (typeof this.props.onDismiss === 'function') {
      event.preventDefault()
      this.props.onDismiss(event)
    }
  }

  handleKeyUp = event => {
    if (event.keyCode === keycode.codes.esc && !event.defaultPrevented) {
      this.dismiss(event)
    }
  }

  handleClick = event => {
    if (!contains(this._content, event.target)) {
      this.dismiss(event)
    }
  }

  render () {
    const content = ensureSingleChild(this.props.children, {
      ref: el => {
        this._content = el
      }
    })

    const classes = classnames({
      [styles.root]: true,
      [styles[this.props.placement]]: true,
      [styles.fullScreen]: this.props.fullScreen
    })

    let props = omitProps(this.props, Mask.propTypes)

    if (typeof this.props.onDismiss === 'function' ||
      typeof this.props.onClick === 'function' ||
      typeof this.props.onKeyUp === 'function') {
      props = {
        ...props,
        onClick: createChainedFunction(this.handleClick, this.props.onClick),
        onKeyUp: createChainedFunction(this.handleKeyUp, this.props.onKeyUp),
        tabIndex: -1
      }
    }

    return (
      <span {...props} className={classes}>
        {content}
      </span>
    )
  }
}

export default Mask

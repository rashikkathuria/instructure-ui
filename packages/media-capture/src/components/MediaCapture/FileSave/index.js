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
import Button from '@instructure/ui-buttons/lib/components/Button'
import TextInput from '@instructure/ui-forms/lib/components/TextInput'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'

import {
  SAVING
} from '../../../constants/CaptureStates'
import { translate } from '../../../constants/translated/translations'


/**
---
private: true
---
**/
export default class FileSave extends Component {
  static propTypes = {
    captureState: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    actions: PropTypes.shape({
      saveClicked: PropTypes.func.isRequired
    }).isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      fileName: this.props.fileName
    }
  }

  onChange = () => {
    this.setState({
      fileName: this.input.value
    })
  }

  saveClicked = () => {
    this.props.actions.saveClicked(this.state.fileName.trim())
  }

  render () {
    return (
      <div style={{ display: 'flex', width: '100%' }}>
        <TextInput
          size="small"
          label={<ScreenReaderContent>{translate('SR_FILE_INPUT')}</ScreenReaderContent>}
          placeholder={this.props.fileName}
          onChange={this.onChange}
          inputRef={(e) => { this.input = e }}
        />
        <Button
          onClick={this.saveClicked}
          disabled={this.props.captureState === SAVING}
          variant="primary"
          size="small"
          margin="0 0 0 x-small"
        >
          { translate('SAVE') }
        </Button>
      </div>
    )
  }
}

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

const FILE_TYPE = 'video/webm'

function startMediaRecorder (stream, onMediaRecorderInit, success, error) {
  const mediaFile = new MediaFile(stream, FILE_TYPE, success, error)
  onMediaRecorderInit(mediaFile.mediaRecorder)
  mediaFile.mediaRecorder.start(10)
}

class MediaFile {
  constructor (stream, fileType, fileSuccess, fileError) {
    this.stream = stream
    this.fileType = fileType
    this.fileSuccess = fileSuccess
    this.fileError = fileError
    this.chunks = []
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: this.fileType })
    this.mediaRecorder.ondataavailable = this.addToChunks
    this.mediaRecorder.onerror = this.onError
    this.mediaRecorder.onstop = this.onStop
  }

  addToChunks = (e) => {
    this.chunks.push(e.data)
  }

  onError = (e) => {
    this.fileError(e)
  }

  onStop = (e) => {
    const blob = new Blob(this.chunks, { type: this.fileType })
    this.fileSuccess(blob)
  }
}

export { startMediaRecorder }
export default MediaFile
import FileSelector, { showFilePicker } from './FileSelector'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import React from 'react'
import { DocumentPicker } from 'react-native-document-picker'

jest.mock('react-native-document-picker', () => {
  let callback

  return {
    DocumentPicker: {
      show: jest.fn((options, cb) => {
        callback = cb
      }),
      finishShow: (err, result) => callback(err, result)
    },
    DocumentPickerUtil: {
      allFiles: jest.fn()
    }
  }
})

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    fileUrls: ['Ra.doc', 'La.pdf'],
    onRemove: () => {}
  }

  renderer.render(<FileSelector {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

describe('showFilePicker', () => {
  let props
  beforeEach(() => {
    props = {
      onAdd: jest.fn(),
      upload: jest.fn(() => Promise.resolve({
        payload: {
          url: 'https:/storage.hylo.com/foo.pdf'
        }
      })),
      type: 'post',
      id: '10',
      onError: jest.fn(),
      onComplete: jest.fn()
    }
  })
  it('uses react-native-document-picker', async () => {
    showFilePicker(props)
    await DocumentPicker.finishShow(null, {
      uri: 'file:///somewhere/foo.pdf',
      fileName: 'foo.pdf',
      type: 'application/x-pdf'
    })

    expect(props.upload).toHaveBeenCalledWith('post', '10', {
      uri: 'file:///somewhere/foo.pdf',
      name: 'foo.pdf',
      type: 'application/x-pdf'
    })

    expect(props.onAdd).toHaveBeenCalledWith({
      local: 'file:///somewhere/foo.pdf',
      remote: 'https:/storage.hylo.com/foo.pdf'
    })
  })

  it('handles picker error', async () => {
    showFilePicker(props)
    await DocumentPicker.finishShow({message: 'Zounds!'})

    expect(props.upload).not.toHaveBeenCalled()
    expect(props.onComplete).toHaveBeenCalledWith('Zounds!')
  })

  it('handles upload error', async () => {
    const errorProps = {
      ...props,
      upload: jest.fn(() => Promise.resolve({
        error: true,
        payload: {
          message: 'Defrobulation imminent'
        }
      }))
    }
    showFilePicker(errorProps)
    await DocumentPicker.finishShow(null, {
      uri: 'file:///somewhere/foo.pdf',
      fileName: 'foo.pdf',
      type: 'application/x-pdf'
    })

    expect(props.onAdd).not.toHaveBeenCalled()
    expect(props.onError).toHaveBeenCalledWith('Defrobulation imminent')
    expect(props.onComplete).toHaveBeenCalled()
  })
})

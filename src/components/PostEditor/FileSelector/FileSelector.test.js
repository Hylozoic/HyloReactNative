import FileSelector from './FileSelector'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import React from 'react'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'

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

it('uses react-native-document-picker', async () => {
  const onAdd = jest.fn()
  const upload = jest.fn(() => Promise.resolve({
    payload: {
      url: 'https:/storage.hylo.com/foo.pdf'
    }
  }))

  const { root: { instance } } = TestRenderer.create(
    <FileSelector onAdd={onAdd} upload={upload} type='post' id='7' />)

  instance.pick()
  expect(instance.state.pending).toBeTruthy()
  await DocumentPicker.finishShow(null, {
    uri: 'file:///somewhere/foo.pdf',
    fileName: 'foo.pdf',
    type: 'application/x-pdf'
  })

  expect(upload).toHaveBeenCalledWith('post', '7', {
    uri: 'file:///somewhere/foo.pdf',
    name: 'foo.pdf',
    type: 'application/x-pdf'
  })

  expect(onAdd).toHaveBeenCalledWith({
    local: 'file:///somewhere/foo.pdf',
    remote: 'https:/storage.hylo.com/foo.pdf'
  })

  expect(instance.state.pending).toBeFalsy()
})

it('handles picker error', async () => {
  const onAdd = jest.fn()
  const onError = jest.fn()
  const upload = jest.fn(() => Promise.resolve({
    payload: {
      url: 'https:/storage.hylo.com/foo.pdf'
    }
  }))

  const { root: { instance } } = TestRenderer.create(
    <FileSelector onAdd={onAdd}
      onError={onError}
      upload={upload}
      type='post'
      id='7' />)

  instance.pick()
  expect(instance.state.pending).toBeTruthy()
  await DocumentPicker.finishShow({message: 'Zounds!'})

  expect(upload).not.toHaveBeenCalled()
  expect(onError).toHaveBeenCalledWith('Zounds!')
})

it('handles upload error', async () => {
  const onAdd = jest.fn()
  const onError = jest.fn()
  const upload = jest.fn(() => Promise.resolve({
    error: true,
    payload: {
      message: 'Defrobulation imminent'
    }
  }))

  const { root: { instance } } = TestRenderer.create(
    <FileSelector onAdd={onAdd}
      upload={upload}
      type='post'
      id='7'
      onError={onError} />)

  instance.pick()
  await DocumentPicker.finishShow(null, {
    uri: 'file:///somewhere/foo.pdf',
    fileName: 'foo.pdf',
    type: 'application/x-pdf'
  })

  expect(onAdd).not.toHaveBeenCalled()
  expect(onError).toHaveBeenCalledWith('Defrobulation imminent')
})

import React from 'react'
import { ActionSheetIOS, TouchableOpacity } from 'react-native'
import { Provider } from 'react-redux'
import getEmptyState from 'store/getEmptyState'
import { act, render, waitFor, fireEvent } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import ImagePicker from 'components/ImagePicker'

// TODO: This is a first pass at using testing-library/react-native
// and I was able to make it work for a basic snapshot test, but nothing else
// due to a current bug with an await/timeout error when using any of the other
// async methods. Tracking this:
//   https://github.com/callstack/react-native-testing-library/issues/379

jest.mock('react-native/Libraries/ActionSheetIOS/ActionSheetIOS', () => ({
  showActionSheetWithOptions: jest.fn()
}))

describe('ImagePicker Specification', () => {
  it('default render matches snapshot', async () => {
    const state = getEmptyState()

    const { getByTestId, toJSON } = render(
      <Provider store={createMockStore(state)}>
        <ImagePicker disabled={false} />
      </Provider>
    )

    const button = await getByTestId('popup-menu-button')

    await fireEvent(button, 'press')

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot()
    })
  })
})

// import ImagePicker from './ImagePicker'
// import TestRenderer from 'react-test-renderer'
// import ReactShallowRenderer from 'react-test-renderer/shallow'
// import RNImagePicker from 'react-native-image-picker'
// import React from 'react'
// import { Text, TouchableOpacity } from 'react-native'

// jest.mock('react-native-image-picker')

// it('matches last snapshot', () => {
//   const renderer = new ReactShallowRenderer()
//   const props = {
//     disabled: true
//   }

//   renderer.render(<ImagePicker {...props}><Text>Children</Text></ImagePicker>)
//   const actual = renderer.getRenderOutput()

//   expect(actual).toMatchSnapshot()
// })

// it('calls this.showPicker onPress', () => {
//   const { root, root: { instance } } = TestRenderer.create(<ImagePicker />)
//   instance.showPicker = jest.fn()
//   root.findByType(TouchableOpacity).props.onPress()
//   expect(instance.showPicker).toHaveBeenCalled()
// })

// it('uploads the picked image', async () => {
//   const upload = jest.fn(() =>
//     Promise.resolve({
//       payload: {
//         url: 'https://images.hylo.com/success.jpg'
//       }
//     }))

//   const onChoice = jest.fn()

//   const { root: { instance } } = TestRenderer.create(<ImagePicker
//     upload={upload}
//     type='userAvatar'
//     id='7'
//     title='Choose yer image bub'
//     onChoice={onChoice}
//                                                      />)
//   instance.showPicker()

//   expect(RNImagePicker.showImagePicker).toBeCalledWith({
//     title: 'Choose yer image bub',
//     storageOptions: { skipBackup: true, path: 'images' },
//     takePhotoButtonTitle: null
//   }, expect.any(Function))

//   expect(instance.state.pending).toBeTruthy()

//   await RNImagePicker.finishImagePicker({
//     uri: 'file:///tmp/bar.jpg',
//     fileName: 'bar.jpg'
//   })

//   expect(instance.state.pending).toBeFalsy()

//   expect(upload).toBeCalledWith('userAvatar', '7', {
//     uri: 'file:///tmp/bar.jpg', name: 'bar.jpg'
//   })

//   expect(onChoice).toBeCalledWith({
//     local: 'file:///tmp/bar.jpg', remote: 'https://images.hylo.com/success.jpg'
//   })
// })

// it('calls onError if there is an error during picking', async () => {
//   const onError = jest.fn()
//   const { root: { instance } } = TestRenderer.create(<ImagePicker
//     onError={onError}
//                                                      />)
//   instance.showPicker()

//   await RNImagePicker.finishImagePicker({
//     error: 'Pipes are leaking'
//   })

//   expect(onError).toBeCalledWith('Pipes are leaking')
// })

// it('calls onError if there is an error during upload', async () => {
//   const onError = jest.fn()
//   const upload = jest.fn(() => Promise.resolve({
//     error: true,
//     payload: new Error('Mysterious obstruction')
//   }))
//   const { root: { instance } } = TestRenderer.create(<ImagePicker
//     onError={onError}
//     upload={upload}
//                                                      />)
//   instance.showPicker()

//   await RNImagePicker.finishImagePicker({
//     uri: 'file:///tmp/bar.jpg',
//     fileName: 'bar.jpg'
//   })

//   expect(onError).toBeCalledWith('Mysterious obstruction')
// })

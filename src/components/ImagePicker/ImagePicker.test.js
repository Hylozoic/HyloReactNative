import React from 'react'
import { Provider } from 'react-redux'
import getEmptyState from 'store/getEmptyState'
import { render } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import ImagePicker from 'components/ImagePicker'

jest.mock('react-native/Libraries/ActionSheetIOS/ActionSheetIOS', () => ({
  showActionSheetWithOptions: jest.fn()
}))

// jest.mock('components/ImagePicker/ImagePicker', () => ({
//   __esModule: true,
//   ...jest.requireActual('components/ImagePicker/ImagePicker'),
//   showImagePicker: jest.fn()
// }))

describe('ImagePicker Specification', () => {
  it('default render matches snapshot', async () => {
    const state = getEmptyState()

    const { toJSON } = render(
      <Provider store={createMockStore(state)}>
        <ImagePicker disabled={false} />
      </Provider>
    )
    expect(await toJSON()).toMatchSnapshot()
  })
})

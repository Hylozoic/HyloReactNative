import React from 'react'
import { Provider } from 'react-redux'
import { getEmptyState } from 'store/reducers/resetStore'
import { render, cleanup } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import FileSelector from 'screens/PostEditor/FileSelector'

describe('FileSelector Specification', () => {
  afterEach(cleanup)
  
  it('default render matches snapshot', async () => {
    const state = getEmptyState()
    const fileUrls = [ 'test-file-1', 'test-file-2' ]
    const { findByText } = render(
      <Provider store={createMockStore(state)}>
        <FileSelector fileUrls={fileUrls} />
      </Provider>
    )

    expect(await findByText('test-file-2')).toBeTruthy()
  })
})

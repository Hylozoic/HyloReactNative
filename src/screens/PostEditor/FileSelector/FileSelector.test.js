import React from 'react'
import { render } from '@testing-library/react-native'
import { TestRoot } from 'util/testing'
import FileSelector from 'screens/PostEditor/FileSelector'

it('default render matches snapshot', async () => {
  const fileUrls = ['test-file-1', 'test-file-2']
  const { findByText } = render(
    <TestRoot>
      <FileSelector fileUrls={fileUrls} />
    </TestRoot>
  )
  expect(await findByText('test-file-2')).toBeTruthy()
})

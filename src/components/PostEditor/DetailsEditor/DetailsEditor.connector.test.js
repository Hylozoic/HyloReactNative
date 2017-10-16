import { mapDispatchToProps, mapStateToProps } from './DetailsEditor.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('DetailsEditor mapStateToProps', () => {
  it('returns initialContent', () => {
    const details = 'post details'
    const state = {
      PostEditor: {
        details
      }
    }
    expect(mapStateToProps(state, props).initialContent).toBe(details)
  })
})

describe('DetailsEditor dispatchProps', () => {
  it('saveChanges should match the latest snapshot', () => {
    const details = {some: 'changes'}
    expect(dispatchProps.saveChanges(details)).toMatchSnapshot()
  })
})

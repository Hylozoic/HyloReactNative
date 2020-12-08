import 'react-native'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import trackCurrentTab from './trackCurrentTab'

test('that handleChange changes state value for currentTab when changed', () => {
  const newCurrentTabRouteName = 'Members'
  const newState = {
    index: 0,
    routes: [ // stackNav
      {
        index: 0,
        routes: [ // drawerNav
          {
            index: 0,
            routes: [ // tabNav
              {
                index: 0,
                routes: [
                  {
                    routeName: newCurrentTabRouteName
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
  class TargetComponent extends React.Component {
    render () { return <span>test</span> }
  }
  const TestComponent = trackCurrentTab(TargetComponent)
  const instance = ReactTestRenderer.create(<TestComponent />).getInstance()
  instance.setState = jest.fn()
  instance.handleChange(null, newState)
  expect(instance.setState).toHaveBeenCalledWith({currentTabName: newCurrentTabRouteName})
})

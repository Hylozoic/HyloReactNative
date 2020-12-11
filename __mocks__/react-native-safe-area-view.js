const React = require('react')
const SafeAreaViewMock = ({ children, ...otherProps }) => {
  return React.createElement('SafeAreaView', otherProps, children)
}
export default SafeAreaViewMock
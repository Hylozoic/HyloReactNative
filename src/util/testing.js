/**
 * @providesModule util/testing
 */

// Temporary brain-dead test event simulation, until either Enzyme or
// react-dom/test-utils decides to make React Native a first-class citizen
//
// Use:
//
//   const root = TestRenderer.create(<FooBar />).root
//   simulate(root.findByType(TouchableOpacity), 'press')
//   expect(someFunction).toHaveBeenCalled()
//
// where `someFunction` is a `jest.fn()`. The event object can be passed as the
// third argument, otherwise it will receive a default value.
export function simulate (instance, eventName, evt = {}) {
  const titleCase = `${eventName[0].toUpperCase()}${eventName.substring(1).toLowerCase()}`
  const handlerName = `on${titleCase}`
  const handler = instance.props[handlerName]

  // TODO: in theory we could pass a `ResponderSyntheticEvent` by default, because that's
  // what TouchableOpacity emits. It's probably not necessary for most tests though. It'd
  // also introduce a dependency on react-dom.
  if (handler) handler(evt)
}

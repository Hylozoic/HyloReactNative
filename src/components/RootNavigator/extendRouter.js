export default function extendRouter (router) {
  if (!router._originalGetAction) {
    router._originalGetAction = router.getActionForPathAndParams
  }
  Object.assign(router, {
    getActionForPathAndParams (path, params) {
      // can override default behavior here
      const action = router._originalGetAction(path, params)
      // console.log('getActionForPathAndParams:', path, params, action)
      return action
    }
  })
}

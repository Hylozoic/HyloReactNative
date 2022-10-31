import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { WebViewMessageTypes } from 'hylo-shared'
import logout from 'store/actions/logout'
import { LEAVE_GROUP } from 'store/constants'
import HyloWebView, { parseWebViewMessage } from 'screens/HyloWebView'

export default function UserSettingsWebView ({ path: pathProp, route }) {
  const dispatch = useDispatch()
  const webViewRef = useRef(null)
  // const [unsaved, setUnsaved] = useState(false)
  const path = pathProp || route?.params?.path

  const handleMessage = message => {
    const { type, data } = parseWebViewMessage(message)

    switch (type) {
      case WebViewMessageTypes.LEFT_GROUP: {
        return data.groupId && dispatch({ type: LEAVE_GROUP, meta: { id: data.groupId } })
      }

      case WebViewMessageTypes.NAVIGATION: {
        const { pathname } = data

        if (pathname.match(/\/login/)) {
          dispatch(logout())
        }

        break
      }
      // TODO: See https://github.com/Hylozoic/hylo-evo/tree/user-settings-webview-improvements
      // case 'USER_SETTINGS.SET_EDIT_PROFILE_UNSAVED': {
      //   console.log('!~~~ setting unsaved', data)
      //   setUnsaved(data)
      //   break
      // }
    }
  }

  return (
    <HyloWebView
      ref={webViewRef}
      path={path}
      onMessage={handleMessage}
    />
  )
}

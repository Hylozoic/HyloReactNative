import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Loading from 'components/Loading'
import WebView from 'react-native-webview'
import { getSessionCookie  } from 'util/session'
import getCurrentGroup from 'store/selectors/getCurrentGroup'

export default function GroupSettings () {
  const group = useSelector(getCurrentGroup)
  const [cookie, setCookie] = useState()

  useEffect(() => {
    const asyncFunc = async () => {
      const cookie = await getSessionCookie()
      setCookie(cookie)
    }

    asyncFunc()
  }, [])

  if (!group || !cookie) return <Loading />

  return (
    <WebView
      source={{
        uri: `http://localhost:9000/groups/${group?.slug}/settings`,
        headers: { Cookie: cookie }
      }}
      sharedCookiesEnabled={true}
      style={{ marginTop: 0 }}
    />
  )
}

import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { openURL } from 'hooks/useOpenURL'
import { FileLabel } from 'screens/PostEditor/FileSelector'

export default function Files ({ urls, style, itemStyle }) {
  if (!urls) return null

  return (
    <View style={style}>
      {urls.map((url, index) =>
        <TouchableOpacity key={url} onPress={() => openURL(url)}>
          <FileLabel url={url} key={index} style={itemStyle} />
        </TouchableOpacity>
      )}
    </View>
  )
}

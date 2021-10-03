/* eslint-disable camelcase */
import React from 'react'
import { View, TouchableOpacity, Linking } from 'react-native'
import { FileLabel } from 'screens/PostEditor/FileSelector'

export default function Files ({ urls, style = {} }) {
  if (!urls) return null

  return (
    <View style={{...styles.files, ...style}}>
      {urls.map(url =>
        <TouchableOpacity key={url} onPress={openUrlFn(url)}>
          <FileLabel url={url} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const openUrlFn = url => () =>
  Linking.canOpenURL(url).then(ok => ok && Linking.openURL(url))

const styles = { 
  files: {
    marginHorizontal: 18,
    marginBottom: 18
  }
}

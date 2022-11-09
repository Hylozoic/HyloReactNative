import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { openURL } from 'hooks/useOpenURL'
import { FileLabel } from 'screens/PostEditor/FileSelector'

export default function Files ({ urls, style = {} }) {
  if (!urls) return null

  return (
    <View style={[styles.files, style]}>
      {urls.map((url, index) =>
        <TouchableOpacity key={url} onPress={() => openURL(url)}>
          <FileLabel url={url} key={index} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = {
  files: {
    marginHorizontal: 18
  }
}

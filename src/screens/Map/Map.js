import React, { useRef, useEffect } from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import HyloWebView from 'screens/HyloWebView'
import getCurrentGroup from 'store/selectors/getCurrentGroup'

export default function Map () {
  const currentGroup = useSelector(getCurrentGroup)
  console.log('!!! currentGroup?.slug', currentGroup?.slug)

  return (
    <HyloWebView path={`${currentGroup?.slug}/map`} />
  )
}
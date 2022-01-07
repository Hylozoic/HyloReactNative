import React  from 'react'
import { useFocusEffect } from '@react-navigation/core'
import { useSelector } from 'react-redux'
import HyloWebView from 'screens/HyloWebView'
import { ALL_GROUP_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import getCurrentGroup from 'store/selectors/getCurrentGroup'

export default function Map ({ navigation }) {
  const group = useSelector(getCurrentGroup)

  useFocusEffect(() => {
    navigation.setOptions({
      title: group?.name
    })
  })

  let path
  if ([ALL_GROUP_ID, PUBLIC_GROUP_ID].includes(group?.slug)) {
    path = `${group?.slug}/map`
  } else {
    path = `groups/${group?.slug}/map`
  }

  return (
    <HyloWebView path={path} />
  )
}

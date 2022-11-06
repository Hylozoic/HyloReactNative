import React from 'react'
import ModalHeader from './ModalHeader'
import { white, caribbeanGreen, white60onCaribbeanGreen } from 'style/colors'

export const WorkflowModalHeader = props => {
  return (
    <ModalHeader
      headerBackTitleVisible={false}
      headerLeftCloseIcon={false}
      headerStyle={{
        backgroundColor: props?.style?.backgroundColor || caribbeanGreen,
        shadowColor: 'transparent'
      }}
      headerTitleStyle={{
        color: white,
        fontFamily: 'Circular-Bold',
        fontSize: 12
      }}
      headerTintColor={white60onCaribbeanGreen}
      statusBarOptions={{
        backgroundColor: props?.style?.backgroundColor || caribbeanGreen,
        barStyle: 'light-content'
      }}
      {...props}
    />
  )
}

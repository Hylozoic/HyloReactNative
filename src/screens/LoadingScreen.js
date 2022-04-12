import React from 'react'
import { Modal } from 'react-native'
import Loading from 'components/Loading'

export default function LoadingScreen ({ visible = true }) {
  return (
    <Modal visible={visible}>
      <Loading size='large' style={styles.container} />
    </Modal>
  )
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  }
}

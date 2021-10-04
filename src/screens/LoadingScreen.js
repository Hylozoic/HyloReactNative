import React from 'react'
import Loading from 'components/Loading'

export default function LoadingScreen () {
  return (
    <Loading size='large' style={styles.container} />
  )
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  }
}
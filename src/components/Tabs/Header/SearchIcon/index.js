import React from 'react'
import BadgedIcon from '../../../BadgedIcon'
import styles from '../Header.styles'

export default function SearchIcon ({ showSearch }) {
  return (
    <BadgedIcon
      name='Search'
      action={showSearch}
      style={styles.icon}
    />
  )
}

import React from 'react'
import BadgedIcon from 'components/BadgedIcon'
import styles from '../header.styles'

export default function SearchIcon ({ showSearch }) {
  return (
    <BadgedIcon
      name='Search'
      action={showSearch}
      style={styles.headerIcon}
    />
  )
}

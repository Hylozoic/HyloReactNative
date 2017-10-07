import SpaceFillingImage from '../../SpaceFillingImage'
import React from 'react'

export default function PostImage ({ imageUrl }) {
  if (!imageUrl) return null
  return <SpaceFillingImage imageUrl={imageUrl} style={{marginBottom: 12}} />
}

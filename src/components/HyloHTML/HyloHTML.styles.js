import { nevada, rhino, white80 } from 'style/colors'

export const baseStyle = {
  color: nevada,
  fontSize: 14,
  lineHeight: 20,
  fontFamily: 'Circular-Book'
}

export const tagsStyles = {
  iframe: {
    alignSelf: 'center'
  },
  p: {
    margin: '0.5em',
    // padding: 0
  },
  a: {
    color: '#0275d8',
    textDecorationLine: 'none'
  },
  code: {
    color: white80,
    backgroundColor: rhino,
    fontSize: 12
  },
  pre: {
    borderRadius: '0.5em',
    display: 'block',
    overflow: 'scroll',
    fontSize: 12,
    backgroundColor: rhino,
    padding: 12
  }
}

export const classesStyles = {
  'hylo-link': {
    color: '#0DC39F'
  },
  mention: {
    color: '#0DC39F',
    textDecorationLine: 'none'
  },
  topic: {
    color: '#0DC39F',
    textDecorationLine: 'none'
  }
}

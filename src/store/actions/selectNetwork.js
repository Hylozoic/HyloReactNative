import { SELECT_NETWORK } from 'store/constants'

export default function selectNetwork (id) {
  console.log('selectNetwork id', id)
  return {
    type: SELECT_NETWORK,
    payload: id
  }
}

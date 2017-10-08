/**
 * @providesModule util/fetchVersion
 */

import fetchJSON from './fetchJSON'
import { isIOS } from './platform'

export default function fetchVersion () {
  const platform = isIOS ? 'ios' : 'android'
  const version = 1.6 // FIXME: variable should not be hardcoded
  const queryParams = `${platform}-version=${version}`
  fetchJSON('/noo/mobile/auto-update-info?' + queryParams)
  .then(result => {
    console.log('result', result)
  })
}

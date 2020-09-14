const MAPBOX_TOKEN = 'pk.eyJ1IjoidGVycmFuY29sbGVjdGl2ZSIsImEiOiJjazlnOHZ5ZjcwYXNsM2VsaWsycjhtbm96In0.j6kV3G71HfHkuIjFKE2dLA'

export default function search (
  endpoint = 'https://api.tiles.mapbox.com',
  source = 'mapbox.places',
  accessToken = MAPBOX_TOKEN,
  proximity = '',
  bbox = '',
  types = '',
  query,
  callback
) {
  const searchTime = new Date()
  const uri =
    endpoint +
    '/geocoding/v5/' +
    source +
    '/' +
    encodeURIComponent(query) +
    '.json' +
    '?access_token=' +
    accessToken +
    (proximity ? '&proximity=' + proximity : '') +
    (bbox ? '&bbox=' + bbox : '') +
    (types ? '&types=' + encodeURIComponent(types) : '')
  xhr(
    {
      uri: uri,
      json: true
    },
    function (err, res, body) {
      callback(err, res, body, searchTime)
    }
  )
}

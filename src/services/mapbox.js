const MAPBOX_GEOCODING_API_URL = 'https://api.tiles.mapbox.com/geocoding/v5/mapbox.places'

export async function fetchMapboxLocations (searchTerm, {
  proximity,
  bbox = '',
  types = ''
}) {
  const uri = MAPBOX_GEOCODING_API_URL
    + '/'
    + encodeURIComponent(searchTerm)
    + '.json?access_token='
    + process.env.MAPBOX_TOKEN
    // used to center map, send the existing location you're editing or current location
    + (proximity ? '&proximity=' + proximity : '')
    + (bbox ? '&bbox=' + bbox : '')
    + (types ? '&types=' + encodeURIComponent(types) : '')

  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  return response.json()
}

import { get } from 'lodash/fp'
import { LOCATION_SEARCH, FIND_OR_CREATE_LOCATION } from 'store/constants'
import convertMapboxToLocation from 'util/convertMapboxToLocation'


export const FindOrCreateLocationMutation = `mutation (
  $accuracy: String,
  $addressNumber: String,
  $addressStreet: String,
  $bbox: [PointInput],
  $center: PointInput,
  $city: String,
  $country: String,
  $fullText: String,
  $geometry: [PointInput],
  $locality: String,
  $neighborhood: String,
  $region: String,
  $postcode: String,
  $wikidata: String
) {
  findOrCreateLocation(data: {
    accuracy: $accuracy,
    addressNumber: $addressNumber,
    addressStreet: $addressStreet,
    bbox: $bbox,
    center: $center
    city: $city
    country: $country,
    fullText: $fullText,
    geometry: $geometry,
    locality: $locality,
    neighborhood: $neighborhood,
    region: $region,
    postcode: $postcode,
    wikidata: $wikidata
  }) {
    id
    accuracy
    addressNumber
    addressStreet
    bbox {
      lat
      lng
    }
    center {
      lat
      lng
    }
    city
    country
    fullText
    locality
    neighborhood
    region
    postcode
  }
}`

export function findOrCreateLocationAction (data, query = FindOrCreateLocationMutation) {
  return {
    type: FIND_OR_CREATE_LOCATION,
    graphql: {
      query,
      variables: { ...data }
    },
    meta: {
      extractModel: {
        modelName: 'Location',
        getRoot: get('findOrCreateLocation')
      }
    }
  }
}

export function pollingfindOrCreateLocation (dispatch, locationData, callback) {
  const poll = (url, delay) => {
    if (delay > 4) return
    dispatch(findOrCreateLocationAction(locationData)).then(value => {
      if (!value) return
      const locationReceived = value.meta.extractModel.getRoot(value.payload.data)
      if (!locationReceived) {
        setTimeout(() => poll(url, delay * 2), delay * 1000)
      } else {
        callback(locationReceived)
      }
    })
  }
  poll(locationData, 0.5)
}


// 
const MAPBOX_TOKEN = 'pk.eyJ1IjoidGVycmFuY29sbGVjdGl2ZSIsImEiOiJjazlnOHZ5ZjcwYXNsM2VsaWsycjhtbm96In0.j6kV3G71HfHkuIjFKE2dLA'
const MAPBOX_GEOCODING_API_URL = 'https://api.tiles.mapbox.com/geocoding/v5/mapbox.places'

async function payload (searchTerm, searchTime, proximity) {
  const uri = MAPBOX_GEOCODING_API_URL
    + '/'
    + encodeURIComponent(searchTerm)
    + '.json?access_token='
    + MAPBOX_TOKEN
    // used to center map, send the existing location you're editing or current location
    + (proximity ? '&proximity=' + proximity : '')
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  const results = await response.json()
  const locations = results.features.map(feature => convertMapboxToLocation(feature))

  return {
    searchTime,
    data: {
      locations: {
        items: locations,
        hasMore: false
      }
    }
  }
}

export default function locationSearch (searchTerm, proximity) {
  const searchTime = new Date()

  return {
    type: LOCATION_SEARCH,
    payload: payload(searchTerm, searchTime, proximity),
    meta: {
      extractModel: 'Location',
      extractQueryResults: {
        getParams: () => ({ searchTerm }),
        getItems: get('payload.data.locations'),
        reset: true
      }
    }
  }
}

import { fetchMapboxLocations, convertMapboxToLocation } from 'services/mapbox'
import { get, isObject } from 'lodash/fp'
import { SET_SEARCH_SUGGESTIONS } from 'screens/ItemChooser/ItemChooser.store'

export const FIND_OR_CREATE_LOCATION = 'FIND_OR_CREATE_LOCATION'

// NOTE: `locationObject` as derived from API response stores coordinates
// as strings (i.e. `center.lat` and `lng`) but they need to remain floats
// to be valid for sending back to the API as valid locationObjects.
// This function is a temporary fix for something that needs to be further
// ironed-out between our graphql response handling and ReduxORM.
export function fixHyloLocationObject (locationObject) {
  return {
    ...locationObject,
    center: {
      lat: parseFloat(locationObject.center.lat),
      lng: parseFloat(locationObject.center.lng)
    }
  }
}
export async function locationSearch (scope, searchTermOrLocationObject, proximity) {
  const locationObject = isObject(searchTermOrLocationObject) && searchTermOrLocationObject
  const searchTerm = !locationObject && searchTermOrLocationObject
  // TODO: To allow direct entry of lat/lng check if this string value
  // is a valid lat/lng coordinates. If construct or lookup the mapbox entry
  // for the coordinates and return that as a valid Hylo locationObject.
  const mapboxLocations = searchTerm
    ? await fetchMapboxLocations(searchTerm, { proximity })
    : await fetchMapboxLocations(`${locationObject.center.lng},${locationObject.center.lat}`)

  let locations = mapboxLocations
    .features
    .map(feature => ({
      ...convertMapboxToLocation(feature),
      // TODO: Check this. Is this a mapbox ID or a hylo location ID?
      id: feature.id
    }))
  locations = [
    searchTerm
      ? { id: 'NEW', fullText: searchTerm }
      : fixHyloLocationObject(locationObject),
    ...locations
  ]

  return {
    type: SET_SEARCH_SUGGESTIONS,
    payload: {
      scope,
      searchSuggestions: locations
    }
  }
}

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

export function findOrCreateLocation (data, query = FindOrCreateLocationMutation) {
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

export function pollingFindOrCreateLocation (dispatch, locationData, callback) {
  const poll = (url, delay) => {
    if (delay > 4) return
    dispatch(findOrCreateLocation(locationData)).then(value => {
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

import { locationSearch } from 'screens/LocationPicker/LocationPicker.store'
import LocationPickerItemRow from 'screens/LocationPicker/LocationPickerItemRow'

export default function LocationPicker ({
  screenTitle = 'Choose a Location',
  navigation,
  // TODO: Default to current location to send as proximity for location search
  initialSearchTerm = '',
  onPick
}) {
  navigation.navigate('ItemChooser', {
    screenTitle,
    searchPlaceholder: 'Search for your location',
    initialSearchTerm,
    ItemRowComponent: LocationPickerItemRow,
    pickItem: onPick,
    searchTermFilter: searchTerm => searchTerm,
    fetchSearchSuggestions: locationSearch
  })
}

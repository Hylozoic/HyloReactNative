// Location Picker
import { locationSearch } from 'screens/ItemChooser/ItemChooser.store'
import LocationPickerItemRow from 'screens/ItemChooser/LocationPickerItemRow'

export default function LocationPicker ({
  screenTitle = 'Choose a Location',
  navigation,
  // TODO: Defaut to current location to send as proximity for location search
  initialSearchTerm = '',
  onPick
}) {
  navigation.navigate('ItemChooser', {
    screenTitle,
    searchPlaceholder: 'Search for your location',
    initialSearchTerm,
    ItemRowComponent: LocationPickerItemRow,
    pickItem: onPick, // this.setLocation,
    searchTermFilter: searchTerm => searchTerm,
    fetchSearchSuggestions: locationSearch
  })
}

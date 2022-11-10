import { useSelector } from 'react-redux'

export default function useInitialURLHandled () {
  const initialURLHandled = useSelector(state => state.initialURL)

  return !initialURLHandled
}

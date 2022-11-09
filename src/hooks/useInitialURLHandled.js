import { useSelector } from 'react-redux'

export default function useInitialURLHandled () {
  const initialURLHandled = useSelector(state => state.session.initialURLHandled)

  return initialURLHandled
}

import { createClient, fetchExchange} from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { devtoolsExchange } from '@urql/devtools'
import apiHost from 'util/apiHost'
import resolvers from './resolvers'
import optimistic from './optimistic'
import keys from './keys'

const cache = cacheExchange({
  keys,
  resolvers,
  optimistic
})

const client = createClient({
  url: `${apiHost}/noo/graphql`,
  exchanges: [devtoolsExchange, cache, fetchExchange]
})

export default client

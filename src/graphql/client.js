import { Client, cacheExchange, fetchExchange } from 'urql'
import { devtoolsExchange } from '@urql/devtools'
import apiHost from 'util/apiHost'

const client = new Client({
  url: `${apiHost}/noo/graphql`,
  exchanges: [devtoolsExchange, cacheExchange, fetchExchange]
})

export default client

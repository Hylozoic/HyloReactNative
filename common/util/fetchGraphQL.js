const fetchGraphQL = query =>
  fetch('http://localhost:9000/noo/graphql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Access-Token': '49fb6b050322fc58c58fb215ab6bed8438b0436b10735213'
    },
    body: JSON.stringify({query})
  })
  .then(resp => resp.json())
  .then(json => json.data)

export default fetchGraphQL

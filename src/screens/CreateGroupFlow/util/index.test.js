import { formatDomainWithUrl, removeDomainFromURL } from './index'

const url = 'foo'
const formattedUrl = `hylo.com/c/${url}`

describe('formatDomainWithUrl', () => {
  it('works as expected', () => {
    expect(formatDomainWithUrl(url)).toEqual(formattedUrl)
  })
})

describe('removeDomainFromURL', () => {
  it('works as expected', () => {
    expect(removeDomainFromURL(formattedUrl)).toEqual(url)
  })
})

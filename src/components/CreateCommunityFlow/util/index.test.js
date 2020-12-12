import { formatDomainWithUrl, removeUrlFromDomain } from './index'

const url = 'foo'
const formattedUrl = `hylo.com/c/${url}`

describe('formatDomainWithUrl', () => {
  it('works as expected', () => {
    expect(formatDomainWithUrl(url)).toEqual(formattedUrl)
  })
})

describe('removeUrlFromDomain', () => {
  it('works as expected', () => {
    expect(removeUrlFromDomain(formattedUrl)).toEqual(url)
  })
})

import { noncircular } from './index'

describe('noncircular', () => {
  it('works as expected', () => {
    const foo = {ok: 'yay'}
    const bar = {z: {x: foo}}
    foo.wow = bar

    expect(noncircular(foo)).toMatchSnapshot()
  })
})

import fetchProjects from './fetchProjects'

it('returns the expected action', () => {
  const action = fetchProjects({ subject: 'project' })
  expect(action).toMatchSnapshot()
})

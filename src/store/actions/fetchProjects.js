import fetchPosts from './fetchPosts'

export const FETCH_PROJECTS = 'FETCH_PROJECTS'

export default function fetchProjects (params, options) {
  // just calls fetchPosts with a different action type
  return fetchPosts(params, options, FETCH_PROJECTS)
}

// import fetchCommunityTopics from '../../store/actions/fetchCommunityTopics'
// import orm from 'store/models'

// export const getT = ormCreateSelector(
//   orm,
//   state => state.orm,
//   (_, { id }) => id,
//   (session, id) => {
//     const person = session.Person.safeGet({id})
//     if (!person) return null
//     return {
//       ...person.ref,
//       skills: person.skills.toModelArray(),
//       memberships: person.memberships.toModelArray()
//     }
//   }
// )

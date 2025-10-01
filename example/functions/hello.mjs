export default async function (event) {
  const { getQuery, db } = event.h3

  return {
    message: 'This is hello function demo purpose',
    query: getQuery(),
    hasDb: !!db,
  }
}

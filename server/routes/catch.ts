export default defineEventHandler((_event) => {
  throw new Error('This is a test error')
})

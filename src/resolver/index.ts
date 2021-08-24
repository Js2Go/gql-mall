import book from './book'

const getSchemas = async () => {
  return await Promise.all([
    book
  ])
}

export default getSchemas

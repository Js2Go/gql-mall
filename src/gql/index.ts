import { loadSchema } from '../util/loadSchema'

const getSchema = async () => {
  return await loadSchema('*')
}

export default getSchema

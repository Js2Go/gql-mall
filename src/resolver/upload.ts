import { IResolvers } from '@graphql-tools/utils'
import fs from 'stream/promises'

export const uploadMutations: IResolvers = {
  async singleUpload(parent, { file }) {
    const { createReadStream, filename, mimetype, encoding } = await file
    const stream = createReadStream()
    const out = (await import('fs')).createWriteStream(filename)
    stream.pipe(out)
    await fs.finished(out)

    return { filename, mimetype, encoding }
  },
}

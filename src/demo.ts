import fs from 'fs/promises'
import { join } from 'path'

(async function () {
  try {
    const files = await fs.readdir(join(__dirname, 'gql'), {
      encoding: 'utf8'
    })
    for (const file of files) {
      const f = await fs.readFile(join(__dirname, `gql/${file}`))
      console.log(f.toString())
    }
    // console.log(files)
  } catch(err) {
    console.log(err)
  }
}())

import { Sequelize } from 'sequelize'

const startDb = () => {
  return new Promise((resolve: (val: Sequelize) => void) => {
    const db = new Sequelize({
      dialect: 'mysql',
      database: 'mall',
      username: 'root'
    })

    resolve(db)
  })
}

export default startDb

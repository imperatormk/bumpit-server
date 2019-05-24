'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
      const categories = queryInterface.bulkInsert('categories', [{
        name: 'Underwear'
      }, {
        name: 'Shoes'
      }], {})
  
  	  const users = queryInterface.bulkInsert('users', [{
      	username: 'imperatormk',
        password: '$2b$12$Q3lLMkZoMhEMg03a7deHBeksDQwB8k1rllH83zA7vyG7Ue7Y6g5ry',
        location: 'Macedonia',
        bio: 'Coder?',
        email: 'darko.simonovski@hotmail.com',
        phone: '076-314-010',
        createdAt: Sequelize.fn('NOW'), // temp
        updatedAt: Sequelize.fn('NOW') // temp
      }, {
      	username: 'mr.mach',
        password: '$2y$12$bJebJvoEk3YdbskBW7KuoePMgfGqQAh6TXfz1tdDamNZQLBJYxb6W',
        location: 'Macedonia',
        bio: 'Coder?',
        email: 'mr.mach@gmail.com',
        phone: '069-320-420',
        createdAt: Sequelize.fn('NOW'), // temp
        updatedAt: Sequelize.fn('NOW') // temp
      }], {})
  
  	  return Promise.all([categories, users]).then(() => {
        const items = queryInterface.bulkInsert('items', [{
          catId: 1,
          selId: 1,
          title: 'An underwear',
          details: 'Very well kept',
          condition: 2,
          price: 119,
          currency: 'EUR',
          size: 'Test size A',
          location: 'U Home',
          createdAt: Sequelize.fn('NOW'), // temp
          updatedAt: Sequelize.fn('NOW') // temp
        }, {
          catId: 2,
          selId: 1,
          title: 'A super shoe',
          details: 'This equals two',
          condition: 1,
          price: 589,
          currency: 'AUD',
          size: 'Test size C',
          location: 'SS Home',
          createdAt: Sequelize.fn('NOW'), // temp
          updatedAt: Sequelize.fn('NOW') // temp
        }, {
          catId: 2,
          selId: 2,
          title: 'A shoe',
          details: 'Just one though',
          condition: 1,
          price: 449,
          currency: 'USD',
          size: 'Test size B',
          location: 'S Home',
          createdAt: Sequelize.fn('NOW'), // temp
          updatedAt: Sequelize.fn('NOW') // temp
        }], {})

        const connections = queryInterface.bulkInsert('connections', [{
          usrFromId: 1,
          usrToId: 2,
          createdAt: Sequelize.fn('NOW'), // temp
          updatedAt: Sequelize.fn('NOW') // temp
        }, {
          usrFromId: 2,
          usrToId: 1,
          createdAt: Sequelize.fn('NOW'), // temp
          updatedAt: Sequelize.fn('NOW') // temp
        }], {})

      	return Promise.all([items, connections]).then(() => {
      	  const images = queryInterface.bulkInsert('images', [{
            itmId: 1,
            url: 'https://via.placeholder.com/500x300',
          }, {
            itmId: 2,
            url: 'https://via.placeholder.com/400x600',
          }, {
            itmId: 3,
            url: 'https://via.placeholder.com/400x400',
          }], {})
          
          const reviews = queryInterface.bulkInsert('reviews', [{
            usrId: 1,
            itmId: 1,
            rating: 2,
            message: 'Not very well kept',
            createdAt: Sequelize.fn('NOW'), // temp
            updatedAt: Sequelize.fn('NOW') // temp
          }, {
            usrId: 2,
            itmId: 2,
            rating: 3,
            message: 'Not bad for a single shoe',
            createdAt: Sequelize.fn('NOW'), // temp
            updatedAt: Sequelize.fn('NOW') // temp
          }], {})

          const likes = queryInterface.bulkInsert('likes', [{
            usrId: 1,
            itmId: 2,
            createdAt: Sequelize.fn('NOW'), // temp
            updatedAt: Sequelize.fn('NOW') // temp
          }], {})

          const orders = queryInterface.bulkInsert('orders', [{
            usrId: 1,
            itmId: 1,
            status: 'PROCESSING',
            createdAt: Sequelize.fn('NOW'), // temp
            updatedAt: Sequelize.fn('NOW') // temp
          }, {
            usrId: 1,
            itmId: 3,
            status: 'PROCESSING',
            createdAt: Sequelize.fn('NOW'), // temp
            updatedAt: Sequelize.fn('NOW') // temp
          }], {})

          return Promise.all([images, reviews, likes, orders])
            .then(() => {
              const charges = queryInterface.bulkInsert('charges', [{
                txnId: 'order1_1',
                amount: 8500,
                amountRefunded: 0,
                currency: 'usd',
                stage: 'ESCROW',
                status: 'succeeded',
                ordId: 1,
                createdAt: Sequelize.fn('NOW'), // temp
                updatedAt: Sequelize.fn('NOW') // temp
              }, {
                txnId: 'order2_1',
                amount: 8500,
                amountRefunded: 8500,
                currency: 'usd',
                stage: 'ESCROW',
                status: 'succeeded',
                ordId: 2,
                createdAt: Sequelize.fn('NOW'), // temp
                updatedAt: Sequelize.fn('NOW') // temp
              }], {})

              return Promise.all([charges])
                .then(() => {
                  const refunds = queryInterface.bulkInsert('refunds', [{
                    refId: 'refund1_2',
                    chgId: 2,
                    amount: 10,
                    currency: 'usd',
                    status: 'succeeded'
                  }, {
                    refId: 'refund2_2',
                    chgId: 2,
                    amount: 20,
                    currency: 'usd',
                    status: 'succeeded'
                  }], {})
                  return Promise.all([refunds])
                })
            })
        })
      })
  },
  down: (queryInterface, Sequelize) => {
    const charges = queryInterface.bulkDelete('charges', null, {})
    return Promise.all([charges])
      .then(() => {
        const categories = queryInterface.bulkDelete('categories', null, {})
        const users = queryInterface.bulkDelete('users', null, {})
        return Promise.all([categories, users])
          .then(() => {
          const items = queryInterface.bulkDelete('items', null, {})
          const connections = queryInterface.bulkDelete('connections', null, {})
          return Promise.all([items, connections])
            .then(() => {
              const images = queryInterface.bulkDelete('images', null, {})
              const reviews = queryInterface.bulkDelete('reviews', null, {})
              const likes = queryInterface.bulkDelete('likes', null, {})
              const orders = queryInterface.bulkDelete('orders', null, {})
              return Promise.all([images, reviews, likes, orders])
            })
          })
      })
  }
}
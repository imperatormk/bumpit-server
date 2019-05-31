'use strict'

const shippingInfoObj = {
  fullname: 'Darko Simonovski',
  address: 'Apostol Zdravevski 34',
  unit: '2nd floor',
  state: 'North Macedonia',
  city: 'Bitola',
  zipcode: '7000',
  contactPhone: '070-727-051'
}

module.exports = {
  up: (queryInterface, Sequelize) => {
      const categories = queryInterface.bulkInsert('categories', [{
        name: 'Underwear'
      }, {
        name: 'Shoes'
      }], {})
  
  	  const users = queryInterface.bulkInsert('users', [{
      	username: 'mr.mach',
        password: '$2y$12$bJebJvoEk3YdbskBW7KuoePMgfGqQAh6TXfz1tdDamNZQLBJYxb6W',
        name: 'Martin',
        surname: 'Mrmach',
        location: 'Macedonia',
        bio: 'Coder?',
        email: 'mr.mach@gmail.com',
        phone: '069-320-420',
        stripeCustId: 'cus_F7oP9ZWmkeB9S2', // subject of change?
        createdAt: Sequelize.fn('NOW'), // temp
        updatedAt: Sequelize.fn('NOW') // temp
      }, {
      	username: 'imperatormk',
        password: '$2b$12$Q3lLMkZoMhEMg03a7deHBeksDQwB8k1rllH83zA7vyG7Ue7Y6g5ry',
        name: 'Darko',
        surname: 'Simonovski',
        location: 'Macedonia',
        bio: 'Coder?',
        email: 'darko.simonovski@hotmail.com',
        phone: '076-314-010',
        stripeCustId: 'cus_F7h2ocdiAVzL0B', // subject of change?
        createdAt: Sequelize.fn('NOW'), // temp
        updatedAt: Sequelize.fn('NOW') // temp
      }], {})
  
  	  return Promise.all([categories, users]).then(() => {
        const shippingInfo = queryInterface.bulkInsert('shippingInfo',[{
          ...shippingInfoObj,
          usrId: 1
        }, {
          ...shippingInfoObj,
          usrId: 2
        }], {})

        const products = queryInterface.bulkInsert('products', [{
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

      	return Promise.all([shippingInfo, products, connections]).then(() => {
      	  const images = queryInterface.bulkInsert('images', [{
            proId: 1,
            url: 'https://via.placeholder.com/500x300',
          }, {
            proId: 2,
            url: 'https://via.placeholder.com/400x600',
          }, {
            proId: 3,
            url: 'https://via.placeholder.com/400x400',
          }], {})
          
          const reviews = queryInterface.bulkInsert('reviews', [{
            usrId: 1,
            proId: 1,
            rating: 2,
            message: 'Not very well kept',
            createdAt: Sequelize.fn('NOW'), // temp
            updatedAt: Sequelize.fn('NOW') // temp
          }, {
            usrId: 2,
            proId: 2,
            rating: 3,
            message: 'Not bad for a single shoe',
            createdAt: Sequelize.fn('NOW'), // temp
            updatedAt: Sequelize.fn('NOW') // temp
          }], {})

          const likes = queryInterface.bulkInsert('likes', [{
            usrId: 1,
            proId: 2,
            createdAt: Sequelize.fn('NOW'), // temp
            updatedAt: Sequelize.fn('NOW') // temp
          }], {})

          const orders = queryInterface.bulkInsert('orders', [{
            usrId: 1,
            proId: 1,
            shippingInfo: JSON.stringify(shippingInfoObj),
            status: 'PROCESSING',
            createdAt: Sequelize.fn('NOW'), // temp
            updatedAt: Sequelize.fn('NOW') // temp
          }, {
            usrId: 1,
            proId: 3,
            shippingInfo: JSON.stringify(shippingInfoObj),
            status: 'PROCESSING',
            createdAt: Sequelize.fn('NOW'), // temp
            updatedAt: Sequelize.fn('NOW') // temp
          }], {})

          return Promise.all([images, reviews, likes, orders])
        })
      })
  },
  down: (queryInterface, Sequelize) => {
    const categories = queryInterface.bulkDelete('categories', null, {})
    const users = queryInterface.bulkDelete('users', null, {})
    return Promise.all([categories, users])
      .then(() => {
      const shippingInfo = queryInterface.bulkDelete('shippingInfo', null, {})
      const products = queryInterface.bulkDelete('products', null, {})
      const connections = queryInterface.bulkDelete('connections', null, {})
      return Promise.all([shippingInfo, products, connections])
        .then(() => {
          const images = queryInterface.bulkDelete('images', null, {})
          const reviews = queryInterface.bulkDelete('reviews', null, {})
          const likes = queryInterface.bulkDelete('likes', null, {})
          const orders = queryInterface.bulkDelete('orders', null, {})
          return Promise.all([images, reviews, likes, orders])
        })
      })
  }
}
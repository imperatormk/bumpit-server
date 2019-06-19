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

      const brands = queryInterface.bulkInsert('brands', [{
        name: 'Nike'
      }, {
        name: 'Adidas'
      }], {})
  
  	  const users = queryInterface.bulkInsert('users', [{
      	username: 'mr.mach',
        password: '$2b$12$Q3lLMkZoMhEMg03a7deHBeksDQwB8k1rllH83zA7vyG7Ue7Y6g5ry',
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
  
  	  return Promise.all([categories, brands, users]).then(() => {
        const shippingInfos = queryInterface.bulkInsert('shippingInfos',[{
          ...shippingInfoObj,
          usrId: 1
        }, {
          ...shippingInfoObj,
          usrId: 2
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

      	return Promise.all([shippingInfos, connections])
      })
  },
  down: (queryInterface, Sequelize) => {
    const categories = queryInterface.bulkDelete('categories', null, {})
    const brands = queryInterface.bulkDelete('brands', null, {})
    const users = queryInterface.bulkDelete('users', null, {})
    return Promise.all([categories, brands, users])
      .then(() => {
      const shippingInfos = queryInterface.bulkDelete('shippingInfos', null, {})
      const connections = queryInterface.bulkDelete('connections', null, {})
      return Promise.all([shippingInfos, connections])
        .then(() => {
          const reviews = queryInterface.bulkDelete('reviews', null, {})
          return Promise.all([reviews])
        })
      })
  }
}
const {
     buildSchema,
     graphql,
} = require('graphql')



let initialCarArr = [
     {carName:'aa1',carType:'type1'},
     {carName:'aa2',carType:'type1'},
     {carName:'aa3',carType:'type3'},
     {carName:'aa4',carType:'type2'},
     {carName:'aa5',carType:'type1'}
]

const mSchema = buildSchema(`
     type Query {
          allCar : [Car]
          carByName(name: String!): [Car]
          carByType(typ: String!): [Car]
     }

     type Mutation {
          createNewCar(carInput: CarInput!): Car
     }

     input CarInput {
        carName: String!
        carType: String!  
     }

     type Car {
          carName: String!
          carType: String!
     }
`)

let rootValue = {
     allCar: ()=> initialCarArr,
     carByName: (args)=> {
          console.log(args)
          return initialCarArr
               .filter(c=>(
                    c.carName === args.name
               ))
     },
     carByType: (args)=> {
          console.log(args)
          return initialCarArr
               .filter(c=>(
                    c.carType === args.typ
               ))
     },
     createNewCar: ({carInput})=>{ 
          initialCarArr.push(carInput)
          return carInput
     }
}

const myQueries = `
     # query using operation type and name
     # we can use fragments to wrap our query field
     # fragments in graphql

     fragment carsField on Car {
          carName
          carType
     }

     # directives in graphql
     # @include, @skip
     # @include(if: Boolean) Only include this field in the result if the argument is true.
     # @skip(if: Boolean) Skip this field if the argument is true.

     query dynamicCarsTypeField($includeIt: Boolean!) {
          allCar {
               carName
               carType @include(if: $includeIt)
          }
     }


     # examples query using above fragments
     query listCarByName($carName: String!) {
          carByName(name: $carName) {
               ...carsField
          }
     }

     query listCarByItsType($tp: String!) {
          carByType(typ: $tp) {
               ...carsField
          }
     }

     mutation newCar($iCar: CarInput!) {
          createNewCar(carInput: $iCar) {
               ...carsField
          }
     }
`


// we can choose our query from myQueries
// by its name and we can pass our variable values
// like below code

graphql(mSchema , myQueries , rootValue , null , {
     iCar:{
          carName:'new_car',
          carType:'new_type'
     }
},'newCar')
     .then(r=>{
          console.log(JSON.stringify(r))
          return graphql(mSchema , myQueries , rootValue , null , {
               tp: 'type1'
          },'listCarByItsType')
     }).then(r=>{
          console.log(JSON.stringify(r))
     })
     .then(_=>{
          return graphql(mSchema,myQueries ,rootValue , null , {
               includeIt: false
          } , 'dynamicCarsTypeField')
     })
     .then(r=>{
          console.log(JSON.stringify(r))
     })
     .catch(err=>{
          console.error(err)
     })
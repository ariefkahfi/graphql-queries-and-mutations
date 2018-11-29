# GraphQL - Queries and mutation

#### Learn how to query (with fragment and variable also using directive)


With fragment and variable
```
    fragment carsField on Car {
          carName
          carType
     }

# examples query using above fragments
    query listCarByName($carName: String!) {
        carByName(name: $carName) {
            ...carsField
        }
    }
```

With directive (@include , @skip)
```
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
```

#### Learn how to mutate data using `mutation`

```
     # examples mutations to mutate data
     # create,update,delete
     mutation newCar($iCar: CarInput!) {
          createNewCar(carInput: $iCar) {
               ...carsField
          }
     }
```



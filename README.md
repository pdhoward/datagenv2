# Data Generator

Test data generator for PROXIMITY, customized to a specific platform use case

## Process Flow

* Generating test data is one of the more difficult tasks in app development. The combination of conditions and exceptions are manifold, and well-designed tests processes are dependent on well-developed test data to help uncover technical and functional errors. The following flow was used in crafting the test data set for validating the Venues that participate in the PROXIMITY DTC messaging network

1. Fetch a document from machine/venues on Atlas
2. From the ../usazips file, randomly retrieve a zip code, location coordinates, city, state for insertion into doc
3. From the [logos] url, randomly retrieve an image url and insert as image
4. Update doc with embedded IMDF (indoor mapping data format) object (future capability to render indoor maps)
5. Generate and insert a mock gateway address (mac address) as monitors (needs to be an Array for future testing)
6. Generate and insert a mock JWT for accessing TAG DB
7. Insert 'type id' as 'Venue'

## LICENSE
MIT


## Strategic Machines
The conversational platform firm. Connecting business to customer engagement
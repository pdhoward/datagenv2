# Data Generator

Test data generator for PROXIMITY, customized to a specific platform use case

## Process Flow

* Generating test data is one of the more difficult tasks in app development. The combination of conditions and exceptions are manifold, and well-designed tests processes are dependent on well-developed test data to help uncover technical and functional errors. The complexity mounts when working with apps that process streaming data, since the user stories requires datasets which are synced with great precision to emulate a realistic production environment.

The following flow was used in crafting the test data set for validating the Venues that participate in the PROXIMITY DTC messaging network

### GENERATE VENUE DATA SET
#### Note this function has been archived and the machine/venue collection has been deleted. The proximity/venue dataset is egenrated and available for testing. These notes left for documentation putposes
1. Fetch a document from machine/venues on Atlas
2. From the ../usazips file, randomly retrieve a zip code, location coordinates, city, state for insertion into doc
3. From the [logos] url, randomly retrieve an image url and insert as image
4. Update doc with embedded IMDF (indoor mapping data format) object (future capability to render indoor maps)
5. Generate and insert a mock gateway address (mac address) as monitors (needs to be an Array for future testing)
6. Generate and insert a mock JWT for accessing TAG DB
7. Insert 'type id' as 'Venue'

### GENERATE OPS DATA SET
#### Includes brands, product tags and messages
1. Delete all old collections in brands, tags and messages
2. for each brand in the test csv file, build a brand object
- mock up addresses and location data
- create a unique brandid 
3. for each brand, generate 100 fake product tags
- each product tag is assigned a unique fake tagid
- attach a random product name and description from test csv file
4. for each brand, generate 20 product messages or advertisements, incorporating tag ids that were generated in step 3 above 
- each message is assigned a unique message id
- text based message generated (but other types will be generated in future)
- object format conforms with requirements for proximity-publish app to generate a web page per venue with brand ads

## LICENSE
MIT


## Strategic Machines
The conversational platform firm. Connecting business to customer engagement
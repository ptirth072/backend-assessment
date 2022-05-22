# Backend Assessment

### Assumptions made
- Assume cars are not owned by users.
- License plate and VIN number to be unique.
- All fields required by default except for description.
- Length for each fields can be anything but greater than zero.
- UI Frontend will send the request in the expected JSON format.
- User Authentication is out of scope.
- Exception handling can be done separately based on the business work flow.
- Only basic information for the vehicle is retrieved and saved.

The requirements could have been achieved by using single database table but I have used 2 table to keep the VIN information isolated from the main table with one to one relationship.

### Overview

I have forked the template repository to use the tech stack used by carSHAiR

### Getting Started

To bring up the environment, perform the following steps:

1. Bring up the MySQL database

    ```bash
    # In the project root directory
    docker compose up
    # Exposes database on port 3306
    ```

2. Bring up express server in development mode

    ```bash
    # In a separate terminal session
    yarn dev
    # Exposes express app on port 8889
    ```
3. Execute the below request to Get, Delete, Save or Update the data.

## GET API
curl --location --request GET 'localhost:8889/car-details/529eb6e0-f81a-4769-ae5b-7fc5e3d6cb98'

## DELETE API
curl --location --request DELETE 'localhost:8889/car-details/test'

## POST
curl --location --request POST 'localhost:8889/car-details' \
--header 'Content-Type: application/json' \
--data-raw '{
  "licenseplate_number": "Test 123",
  "registration_number": "Test1234567",
  "registration_state": "Ontario",
  "registration_expiration_date": "2030-01-01",
  "registration_name": "Tirth Patel",
  "vin_number": "1HD1BWV13DB013272",
  "car_value": 15000.50,
  "current_mileage": 12000,
  "description": "Description for a new car goes here",
  "color": "#FFFFFF"
}'

## POST ERROR
curl --location --request POST 'localhost:8889/car-details' \
--header 'Content-Type: application/json' \
--data-raw '{
  "licenseplate_number": "",
  "registration_number": "ABCD1234567",
  "registration_state": "Ontario",
  "registration_expiration_date": "2030-01-01",
  "registration_name": "Tirth Patel",
  "vin_number": "4JGBB8GB4BA662410",
  "car_value": 15000.50,
  "current_mileage": 12000,
  "description": "Description for a new car goes here",
  "color": "#FFFFFF"
}'

## PUT
curl --location --request PUT 'localhost:8889/car-details/529eb6e0-f81a-4769-ae5b-7fc5e3d6cb98' \
--header 'Content-Type: application/json' \
--data-raw '{
  "licenseplate_number": "ABCD 456",
  "registration_number": "ABCD1234567",
  "vin_number": "JTHFF2C26B2515141"
}'

### Submission Requirements Feedback
  - How long the assessment took to complete
      - Took me couple of working days to complete as I was not familiar with TypeORM and Routing-Controller and MySql.
      - Learned the new tech stack and implemented the solution.
  - Whether or not the requirements were clear
      - Pretty clear requirements
  - On a scale of 1 - 10, the level of difficulty
      - For someone with not being familiar to tech stack I would say 7/8 otherwise will give it a 4
  - If given the choice, would they rather have done an Leet-code style assessment over a project-based assessment
      My personal preference for this is project-based assessment

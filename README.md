# Exercise Tracker Microservice API

The Exercise Tracker API is a service designed to help you track and manage exercise logs for users. It offers the ability to create user accounts, log exercises, retrieve exercise logs, and apply filters to the log data. This API is built as part of the FreeCodeCamp Backend Development and APIs Certification and is functionally similar to the [Exercise Tracker API Example by FreeCodeCamp](https://exercise-tracker.freecodecamp.rocks/).

## Tech Stack

- **Prisma**
- **SQLite**
- **Express**

## How it Works

This API can be accessed via HTTP requests to the following endpoints:

- To create a user:

  ```
  POST /api/users
  ```

- To list all users:

  ```
  GET /api/users
  ```

- To log an exercise for a user:

  ```
  POST /api/users/:_id/exercises
  ```

- To retrieve a user's exercise logs:

  ```
  GET /api/users/:_id/logs
  ```

### Functionality

1. **User Management**:

   - You can create a new user by making a POST request to `/api/users` with a `username`.
   - The response from this request will include the user's `username` and `_id`.

2. **Exercise Logging**:

   - Log an exercise for a user by sending a POST request to `/api/users/:_id/exercises`. You can provide details like `description`, `duration`, and optionally `date`.

3. **Exercise Logs Retrieval**:

   - Retrieve a user's exercise logs by making a GET request to `/api/users/:_id/logs`.
   - The response will include the user's `count` and an array of exercise logs with `description`, `duration`, and `date` properties.

4. **Advanced Filtering**:

   - You can apply filters to exercise logs by adding `from`, `to`, and `limit` parameters to the GET request to `/api/users/:_id/logs`.

## Example Usage

Here are some examples of how to use the Exercise Tracker API:

- To create a new user:

  - Send a POST request to `/api/users` with the following JSON data:

    ```
    {
      "username": "john_doe"
    }
    ```

  - The response will include the user's information, including the `_id`.

- To log an exercise:

  - Send a POST request to `/api/users/:_id/exercises` with the following JSON data:

    ```
    {
      "description": "Jogging",
      "duration": 30,
      "date": "2023-10-16"
    }
    ```

  - The response will include the user's information with the exercise fields added.

- To retrieve a user's exercise logs:

  - Send a GET request to `/api/users/:_id/logs`.

- To apply filters to exercise logs:

  - Add query parameters like `from`, `to`, and `limit` to the GET request to `/api/users/:_id/logs`.

## Getting Started

To run this API on your local machine, follow these steps:

1. Clone the repository.
2. Install the required dependencies using npm or yarn.
3. Start the server with your preferred Node.js runtime.
4. Access the API at `http://localhost:3000/api`.

## Author

Rifki Salim

## License

This project is open-source and available under the [MIT License](LICENSE.md).

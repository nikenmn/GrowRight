# GrowRight

# User Management API

This API provides endpoints for user registration, login, retrieving user information, viewing user profiles, and editing user profiles.

## Table of Contents

- [User Management API](#user-management-api)
  - [Table of Contents](#table-of-contents)
  - [Endpoints](#endpoints)
    - [Register User](#register-user)
    - [Login User](#login-user)
    - [Login Google](#login-google)
    - [Prediction](#prediction)
    - [Get User](#get-user)
    - [Get User Profile](#get-user-profile)
    - [Edit User Profile](#edit-user-profile)
  - [Error Codes](#error-codes)

## Endpoints

### Register User

**Endpoint:** `/register`

**Method:** `POST`

**Authentication:** No

**Request:**

- **Body Parameters:**
  - `userName` (string) - Username of the user
  - `email` (string) - Email address of the user
  - `password` (string) - Password of the user

**Responses:**

- **201 Created**
  - **Body:**
    ```json
    {
      "status": "success",
      "message": "User has been registered"
    }
    ```
- **400 Bad Request**
  - Invalid email:
    ```json
    {
      "status": "fail",
      "message": "Invalid email"
    }
    ```
  - Password length less than 8 characters:
    ```json
    {
      "status": "fail",
      "message": "Password must be at least 8 characters long"
    }
    ```
  - Password does not contain symbol and number:
    ```json
    {
      "status": "fail",
      "message": "Password must contain at least one symbol and number"
    }
    ```
  - Email already registered:
    ```json
    {
      "status": "fail",
      "message": "Email already registered"
    }
    ```

### Login User

**Endpoint:** `/login`

**Method:** `POST`

**Authentication:** No

**Request:**

- **Body Parameters:**
  - `email` (string) - Email address of the user
  - `password` (string) - Password of the user

**Responses:**

- **200 OK**
  - **Body:**
    ```json
    {
      "status": "success",
      "message": "Login success",
      "data": {
        "userId": "<userId>",
        "userName": "<userName>",
        "email": "<email>"
      },
      "token": "<JWT Token>"
    }
    ```
- **404 Not Found**
  - **Body:**
    ```json
    {
      "status": "fail",
      "message": "User not found"
    }
    ```
- **401 Unauthorized**
  - **Body:**
    ```json
    {
      "status": "fail",
      "message": "Wrong password"
    }
    ```

### Login Google

**Endpoint** `/login-google`

**Method:** `GET`or`POST`

**Authentication:** No

**Rquest**

- No specific request body is needed. This endpoint uses Google OAuth for authentication

**Responses:**

- **200 OK**
  - **Body:**
    ```json
    {
      "status": "success",
      "message": "Login success"
      "data": {
        "userId": "<userId>",
        "userName": "<userName>",
        "email": "<email>"
      }
    "token": "<JWT Token>"
    }
    ```

- **201 OK**
  - **Body:**
    ```json
    {
      "status": "success",
      "message": "User has been registered"
      "data": {
        "userId": "<userId>",
        "userName": "<userName>",
        "email": "<email>"
      }
    "token": "<JWT Token>"
    }
    ```

### Prediction

**Endpoint:** `/prediction/{userId}`

**Method:** `POST`

**Authentication:** Yes

**Request:**

- **Headers:**
  - `Authorization: Bearer <JWT Token>`
- **Path Parameters:**
  - `userId` (string) - ID of the user
- **Body Parameters:**
  - `name` (string) - Name for prediction
  - `gender` (bolean) - 1 for Male and 0 for Female
  - `age` (int) - Age in months
  - `weight` (decimal) - Body weight kg
  - `height` (decimal) - Height in cm

**Responses:**

- **200 OK**
  - **Body:**
    ```json
    {
      "status": "success",
      "message": "Prediction success",
      "data": {
        "input": {
          "name": <name>,
          "gender": <gender>,
          "age": <age>,
          "weight": <weight>,
          "height": <height>
        },
        "prediction": {
          "zsWeightAge": <decimal>,
          "zsHeightAge": <decimal>,
          "zsWeightHeight": <decimal>,
          "zsTotal": <decimal>,
          "zsTotalPercentage":<decimal>
        }
      }
    }
   ```

### Get User

**Endpoint:** `/home`

**Method:** `GET`

**Authentication:** Yes

**Request:**

- **Headers:**
  - `Authorization: Bearer <JWT Token>`

**Responses:**

- **200 OK**
  - **Body:**
    ```json
    {
      "status": "success",
      "data": {
        "userId": "<userId>",
        "userName": "<userName>",
        "email": "<email>"
      }
    }
    ```

### Get User Profile

**Endpoint:** `/profile/{userId}`

**Method:** `GET`

**Authentication:** Yes

**Request:**

- **Headers:**
  - `Authorization: Bearer <JWT Token>`
- **Path Parameters:**
  - `userId` (string) - ID of the user

**Responses:**

- **200 OK**
  - **Body:**
    ```json
    {
      "status": "success",
      "data": {
        "userId": "<userId>",
        "userName": "<userName>",
        "email": "<email>",
        "createDat": "<createDat>",
        "updateDat": "<updateDat>"
      }
    }
    ```
- **401 Unauthorized**
  - **Body:**
    ```json
    {
      "status": "fail",
      "message": "Unauthorized"
    }
    ```

### Edit User Profile

**Endpoint:** `/profile/{userId}`

**Method:** `PUT`

**Authentication:** Yes

**Request:**

- **Headers:**
  - `Authorization: Bearer <JWT Token>`
- **Path Parameters:**
  - `userId` (string) - ID of the user
- **Body Parameters:**
  - `userName` (string) - New username
  - `email` (string) - New email address
  - `noHp` (string) - New phone number

**Responses:**

- **200 OK**
  - **Body:**
    ```json
    {
      "status": "success",
      "message": "User has been updated",
      "data": {
        "userId": "<userId>",
        "userName": "<userName>",
        "email": "<email>",
        "noHp": "<noHp>",
        "createDat": "<createDat>",
        "updateDat": "<updateDat>"
      }
    }
    ```
- **400 Bad Request**
  - Invalid email:
    ```json
    {
      "status": "fail",
      "message": "Invalid email"
    }
    ```
  - Email already registered:
    ```json
    {
      "status": "fail",
      "message": "Email already registered"
    }
    ```
- **401 Unauthorized**
  - **Body:**
    ```json
    {
      "status": "fail",
      "message": "Unauthorized"
    }
    ```

## Error Codes

- **400 Bad Request:** The server could not understand the request due to invalid syntax.
- **401 Unauthorized:** The client must authenticate itself to get the requested response.
- **404 Not Found:** The server can not find the requested resource.

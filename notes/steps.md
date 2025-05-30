# Work Flow of a Project

#### Step 1. Create DB Models

- Inside user models, make sure
  - in the password field we put "select: false". This will exclude password from query results.
    ```js
     password: {
      type: String,
      required: [true, "Password is required"],
    },
    ```
- Use pre hook to hash the password before saving.
- use **bcrypt.hash** to hash the password
- use **bcypt.compare** to decrypt the password.
- create Access Tokens and Refresh Tokens using jwtSign method.
  - we will be adding these methods to our schema methods by using **_userSchema.methods.method_name_**

#### Step 2. Set up file handling and Uploading

- configure multer and cloudinary
- use try-catch, get local path from multer (multer sends the local path inside req.file / files)
- upload the files on cloudinary and unlink the file from local path

#### Step 3. Writing controller for User Registration

- get user details from front end
- validations
- check if user already exists
- check for files to upload
- upload files to cloud
- create user object and enter in DB
- remove password and refresh token from response
- return response

#### Step 4. Writing controller for User Login

- req body -> data
- check if we got username or email from req.body
- find user
- check password
- issue Access token and Refresh Token
  - advisable to create a separate method for this as it will be used many times.
  - find user by id
  - generate tokens
  - save refresh token in user document.
  - return accessToken and refreshToken
  - when calling this method, dont forget to update the current user reference.
- send tokens in secure-cookie
- send response

#### Step 5. Writing controller for User Logout

- To logout, create a middleware to get userId from accessToken which is sent inside the cookies
  - get accessToken from req.cookie
  - decode the info (userId stored in accessToken) by using jwt.verify() method
  - use that userId to find the user in DB.
  - Add that user object to req and make sure to remove password and refreshToken from the user object.
  - dont forget next() at the end of the function as it is a middleware.
- In logout Controller,
  - find the user from req.user.\_id
  - set refreshToken to undefined
  - return a response and use clear cookies method to delete accessToken and refreshToken.

#### Step 6. CRUD Operations with User Controller

##### Change Password

- get old password and new Password from the user.
- get userId from the user object sent by our JWTVerify middleware.
- verify if old password is correct
- update the new password
- save the new password in user object in DB
- return a response

##### Get Current User

- Since our request already has access to user Id through JWTVerify middleware, we can just return the response and send back req.user

##### Update Accounts details

- get user data
- check if we got the data
- validate the data
- use find and update
- remove password
- dont forget to add new:true. This will return the new document not the original document.
- return response

##### Update User Images/ files

- updating files should have a separated controller than text based updates because we dont want to overwrite all the text based user details everytime we update an image.
- get image
- check if we got local path or not
- upload on cloudinary
- check if upload successful
- find the user and update it
- return the response

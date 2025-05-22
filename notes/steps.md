# Work Flow of a Project

#### Step 1. Create DB Models

- Inside user models, make sure
  - in the password field we put "select: false". This will exclude password from query results.
    ```js
     password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
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

#### Step 3. Writing controller for User

- get user details from front end
- validations
- check if user already exists
- check for files to upload
- upload files to cloud
- create user object and enter in DB
- remove password and refresh token from response
- return response

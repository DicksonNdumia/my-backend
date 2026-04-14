### Day 1🧪 Authenitication of Users Register And Login

The following are sample registered users you can use for testing authentication.

> 🔐 **Password for all users:** `123456789`

---

#### 📊 Summary

- **Success:** true
- **Total Users:** 5

---

#### 👥 User List

| ID  | Name      | Email                                          |
| --- | --------- | ---------------------------------------------- |
| 2   | admin     | [doe@example.com](doe@example.com)             |
| 8   | moderator | [mmm@example.com](mmm@example.com)             |
| 7   | moderator | [moderator@example.com](moderator@example.com) |
| 10  | user      | [carlos@example.com](carlos@example.com)       |
| 9   | user      | [bruno@example.com](bruno@example.com)         |

---

#### 📦 Raw JSON (Optional)

```json
{
  "success": true,
  "count": 5,
  "data": [
    { "id": 2, "name": "admin", "email": "doe@example.com" },
    { "id": 8, "name": "moderator", "email": "mmm@example.com" },
    { "id": 7, "name": "moderator", "email": "moderator@example.com" },
    { "id": 10, "name": "user", "email": "carlos@example.com" },
    { "id": 9, "name": "user", "email": "bruno@example.com" }
  ]
}
```

#### day 2 I created events an events controllers where the moderator can create, update, delete an event

> **Note:** All requests that modify data (`POST`, `PUT`, `DELETE`) require a **Bearer access token** obtained after logging in.

---

### 🔹 Fetch All Events

**Request:**

> GET http://localhost:3000/api/v1/events

**Response Example:**

```json
{
  "message": "The events are as follows",
  "resultData": [
    {
      "id": 1,
      "title": "Nyeri Falls Hiking Tour",
      "location": "Nyeri",
      "date": "2026-04-27T21:00:00.000Z",
      "description": "Come all and let's all have fun and engage with the nature",
      "created_by": null,
      "created_at": "2026-04-02T00:30:22.756Z",
      "updated_at": "2026-04-02T00:30:22.756Z",
      "image_url": "https://res.cloudinary.com/dqjqva9ca/image/upload/v1775125823/Library/bappacmpieyw4q0redlu.jpg",
      "image_public_id": null
    },
    {
      "id": 2,
      "title": "The Met Gala Event",
      "location": "Nanyuki",
      "date": "2026-04-10T21:00:00.000Z",
      "description": "What are you waiting for? Come on, book your event!",
      "created_by": null,
      "created_at": "2026-04-02T00:43:29.917Z",
      "updated_at": "2026-04-02T00:43:29.917Z",
      "image_url": "https://res.cloudinary.com/dqjqva9ca/image/upload/v1775126610/Library/a6t7isvc29agd4ktdbtr.jpg",
      "image_public_id": null
    },
    {
      "id": 3,
      "title": "Canada",
      "location": "Canada",
      "date": "2026-07-20T21:00:00.000Z",
      "description": "What are you waiting for? Come on, book your event!",
      "created_by": 2,
      "created_at": "2026-04-02T00:46:24.972Z",
      "updated_at": "2026-04-02T01:53:56.433Z",
      "image_url": "https://res.cloudinary.com/dqjqva9ca/image/upload/v1775126784/Library/yvnwihwfvemlj3mnhcg5.jpg",
      "image_public_id": null
    },
    {
      "id": 4,
      "title": "The Met Gala Event",
      "location": "Nanyuki",
      "date": "2026-04-10T21:00:00.000Z",
      "description": "What are you waiting for? Come on, book your event!",
      "created_by": 2,
      "created_at": "2026-04-02T00:47:50.497Z",
      "updated_at": "2026-04-02T00:47:50.497Z",
      "image_url": "https://res.cloudinary.com/dqjqva9ca/image/upload/v1775126871/Library/pk287un3crfz51bwdsow.jpg",
      "image_public_id": null
    },
    {
      "id": 6,
      "title": "Nairobi Matatu Showdown",
      "location": "Nairobi",
      "date": "2026-05-10T21:00:00.000Z",
      "description": "Nganya nganya alert",
      "created_by": 7,
      "created_at": "2026-04-02T00:53:27.993Z",
      "updated_at": "2026-04-02T00:53:27.993Z",
      "image_url": "https://res.cloudinary.com/dqjqva9ca/image/upload/v1775127208/Library/izhkvu7jsawb9cq1jqub.jpg",
      "image_public_id": null
    }
  ]
}
```

#### 🔹 Day 3 Created booking and also the ability of the user to book an event using the event_id

Welcome

> Also the moderator and the user can delete the bookings
> the other thing is the ability for the user and moderator to get events with the booking details e.g who booked the event
> **Request:**

> GET http://localhost:3000/api/v1/bookings

**Response Example:**

```json
{
  "message": "Boom! Event details fetched successfully",
  "data": [
    {
      "booking_id": 1,
      "booking_date": "2026-04-02T21:20:51.495Z",
      "event_title": "Nyeri Falls Hiking Tour",
      "image": "https://res.cloudinary.com/dqjqva9ca/image/upload/v1775125823/Library/bappacmpieyw4q0redlu.jpg",
      "event_location": "Nyeri",
      "event_date": "2026-04-27T21:00:00.000Z",
      "attendee_name": "Carlos",
      "attendee_email": "carlos@example.com"
    },
    {
      "booking_id": 3,
      "booking_date": "2026-04-02T22:27:28.452Z",
      "event_title": "Canada",
      "image": "https://res.cloudinary.com/dqjqva9ca/image/upload/v1775126784/Library/yvnwihwfvemlj3mnhcg5.jpg",
      "event_location": "Canada",
      "event_date": "2026-07-20T21:00:00.000Z",
      "attendee_name": "Bruno",
      "attendee_email": "bruno@example.com"
    },
    {
      "booking_id": 4,
      "booking_date": "2026-04-02T23:42:42.311Z",
      "event_title": "The met Gala event",
      "image": "https://res.cloudinary.com/dqjqva9ca/image/upload/v1775126610/Library/a6t7isvc29agd4ktdbtr.jpg",
      "event_location": "Nanyuki",
      "event_date": "2026-04-10T21:00:00.000Z",
      "attendee_name": "Bruno",
      "attendee_email": "bruno@example.com"
    }
  ]
}
```

### Day 4 Created comments controller where the users are able to comment on an event before even booking

> Just for pure vibes

**Request:**

> GET http://localhost:3000/api/v1/comments
> also added a bit of protection

**Response Example:**

#####

#### DAY 5 Created a review controller where the users ara able to add a review/ feedback after the event are over added date

# validity that ensures reviews are always over before adding review also validation that checks if the user had booked the event to

# give the correct feedback

####

### Completed the backend and now I will move to the frontend part

**Packages installed:**

> "@actions/core": "^1.11.1",
> "@actions/exec": "^1.1.1",
> "@sendgrid/mail": "^8.1.6",
> "bcryptjs": "^3.0.3",
> "chalk": "^5.6.2",
> "cloudinary": "^2.9.0",
> "cookie-parser": "^1.4.7",
> "cors": "^2.8.6",
> "cron": "^4.4.0",
> "dotenv": "^17.3.1",
> "express": "^5.2.1",
> "jsonwebtoken": "^9.0.3",
> "morgan": "^1.10.1",
> "multer": "^2.1.1",
> "nodemailer": "^8.0.4",
> "nodemon": "^3.1.14",
> "path": "^0.12.7",
> "pg": "^8.20.0",
> "supabase": "^2.84.5"
> "jest": "^30.3.0",

**Using npm install**

**Also created .github workflows where the CI / CD runs the test, build of the app**

name: Backend CI

on:
push:
branches: [main]
pull_request:
branches: [main]

jobs:
build:
runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - name: Checkout repository code
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm run test

      - name: Confirm success
        run: echo "Pipeline completed successfully"

**CI/CD automations**

### Wrote some simple test although it was full AI that wrote some examples am

### still trying to understand about testing of code

### day seven of this project created a Dockerfile and a compose.yaml for creating the backend container and images

# Set the base image to create the image for the backend

> FROM node:20-alpine

#create a user with permissions to run the app

# -S -> create the user to a group

# -G -> add the user to a group

# this is done to avoid running the app as root

# if the app is run as root, any vulneravility in the app can be exploited to gain

# access to the host system

# It's a good practice to run the app as a non-root user

> RUN addgroup app && adduser -S -G app app

# Set the user to run the app

> USER app

# Set the working directory to /app

> WORKDIR /app

# Copy package.json and package-lock.json to the working directory

# This is done before copying the rest of the files to take advantage of Docker's cache

# If the package.json and package-lock.json files haven't changed, Docker will used the

# cached dependencies

> COPY package\*.json ./

# sometimes the ownership of the files in the working directory is changed to root

# and thus the app can't access the files and throws an error -> EACCES: permission denied

# to avoid this, change the ownership to the root user

> USER root

# change the ownership of the /app directory to the app user

# chown -R <user>:<group> <directory>

# chown command changes the user and/or group ownership of for given file.

> RUN chown -R app:app .

# change the user back to the app user

> USER app

#install the dependencies

> RUN npm install

# copy the rest of the files to the working directory

> COPY . .

#export poer 3000 to tell Docker that the container listens on the specified network port

# at runtime

> EXPOSE 3000

###

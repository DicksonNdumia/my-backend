### 🧪 Test Users for Login

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

### 🧪 Test Events for Login

#### day 2 I created events an events controllers where the moderator can create, update, delete an event

> **Note:** All requests that modify data (`POST`, `PUT`, `DELETE`) require a **Bearer access token** obtained after logging in.

---

## 🔹 Fetch All Events

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






###
```

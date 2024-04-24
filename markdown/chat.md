- Users Collection
  - username: String
  - email: String
  - password: String
  - avatar: String (URL to the profile picture)
  - conversation: [ObjectId](refers to the conversations)

- Conversations Collection
  - members: [ObjectId](Array of ObjectIds referring to users)
  - messages: [ObjectId](Array of ObjectIds referring to messages)

- Messages Collection
  - conversationId: [ObjectId] (Refers to the Conversation model)
  - sender: [ObjectId] (Refers to the User model)
  - text: String
  - createdAt: Date

# Data modelling

✅ Data Modeling Checklist

🧱 **1. Identify Core Entities**

- What are the main things you're storing data about? (Users, Products, Orders, etc.)

- Are there any supporting or dependent entities? (e.g., OrderItems under Orders)

🏷️ **3. List Attributes for Each Entity**
**_For each entity:_**

- What fields does it need?

- Name, email, createdAt, etc.

- What data types are appropriate?

  - string, integer, boolean, date, etc.

**_Which fields are:_**

- Required

- Optional

- Unique

- Defaulted

🔗 **4. Define Relationships**
For every pair of entities:

- What is the relationship type?

  - One-to-One

  - One-to-Many

  - Many-to-Many

🧩 **5. Define Primary and Foreign Keys**

- What uniquely identifies each entity? (Primary Key)

- What links one entity to another? (Foreign Key)

**_Don't forget:_**

- Index foreign keys for performance.

- Use surrogate keys (e.g., id) or natural keys (e.g., email) as appropriate.

⚙️ **6. Determine Indexing Needs**
Ask:

- Which fields will be queried, filtered, or sorted often?

- Which fields should be unique (e.g., username, email)?

- Are there foreign keys or composite keys that need indexes?

🧪 **7. Add Constraints and Validation**
Per field:

- Is it required?

- Should it match a pattern (e.g., email)?

- Is it within a range?

- Is it unique?

🧰 **8. Plan for Access Patterns**
Ask:

- How will this data be used?

- What are the most common queries?

- Do I need to support pagination, sorting, or full-text search?

Design accordingly.

🛡️ **10. Security and Compliance**

- Is any data sensitive (PII, passwords, tokens)?

- Use hashing, encryption where needed

- Do you need audit fields? (createdAt, updatedAt, deletedAt)

📊 **11. Plan for Growth and Scalability**

- Will this data model handle 10x or 100x more users?

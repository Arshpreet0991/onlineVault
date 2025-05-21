# Task Management Models - Notes & Best Practices

---

## User Model

- **Fields:**

  - `username`: required, lowercase, trimmed string.
  - `email`: required, unique, lowercase, trimmed string.
  - `password`: required, **not selected by default** (`select: false`).
  - `avatar`: optional string.
  - `refreshToken`: optional string.

- **Important:**
  - Password hashing should be handled before save (not shown here).
  - When querying users, password is excluded unless `.select('+password')` is used.
  - Unique and trimmed email prevents duplicates with whitespace issues.

---

## Task Model

- **Fields:**

  - `taskTitle`: required string.
  - `owner`: references `User` ObjectId, indexed.
  - `taskStatus`: enum (`not started`, `in progress`, `completed`), default `not started`.
  - `subTasks`: array of `SubTask` ObjectIds.

- **Notes:**
  - Storing subtask IDs inside `subTasks` array allows easy `.populate('subTasks')`.
  - `taskStatus` should reflect subtasks completion status.
  - Keep `subTasks` array and actual subtasks consistent.

---

## SubTask Model

- **Fields:**

  - `subTaskContent`: required string.
  - `taskId`: required ObjectId referencing `Task`, indexed.
  - `isCompleted`: boolean, default `false`.
  - `createdBy`: optional ObjectId referencing `User`.

- **Notes:**
  - Bidirectional link: subtask knows its parent task via `taskId`.
  - Keep consistency with Task’s `subTasks` array.
  - `taskId` must reference an existing Task (validation recommended).

---

## Common Pitfalls & Best Practices

### Data Consistency

- When **creating a SubTask**:

  1. Create SubTask with valid `taskId`.
  2. Push new SubTask ID to the parent Task’s `subTasks` array.

- When **deleting a Task**:

  - Delete all subtasks with matching `taskId` to avoid orphan subtasks.

- When **deleting a SubTask**:

  - Remove the SubTask ID from the Task’s `subTasks` array.

- **Tip:** Use Mongoose middleware (hooks) or controller logic for syncing.

---

### Updating Task Status Based on SubTasks

- After SubTask completion status changes:

  - If _all_ subtasks completed → set Task’s `taskStatus` to `"completed"`.
  - If _some_ subtasks completed → set `taskStatus` to `"in progress"`.
  - If _none_ completed → set `taskStatus` to `"not started"`.

- This logic can be implemented:
  - In controller after updating a SubTask.
  - Or via Mongoose hooks (`post('save')` on SubTask).

---

### Performance Considerations

- `subTasks` array can grow large; loading all subtasks at once can be slow.
- Consider paginating subtasks or lazy loading them in your frontend.
- Indexing `taskId` on SubTask ensures fast lookup of subtasks by task.

---

### Validation & Required Fields

- Fields marked as `required` **must be provided** when creating/updating documents.
- Use `trim: true` on strings like emails and usernames to prevent whitespace errors.
- Enums restrict field values (helps with data consistency).

---

### Security Considerations

- Password field is excluded by default from queries.
- Hash passwords before saving user documents.
- Validate user ownership before allowing updates/deletes on tasks and subtasks.

---

### Preventing Orphan SubTasks

- Ensure `taskId` of SubTask references an existing Task before saving.
- When deleting Tasks, **cascade delete** subtasks manually.
- Optionally, add validation or hooks to enforce this.

---

## Summary Table

| Concern            | Current Setup                                                        | Advice                                       |
| ------------------ | -------------------------------------------------------------------- | -------------------------------------------- |
| Task–SubTask Link  | Task holds array of SubTask IDs; SubTask references Task by `taskId` | Keep in sync via hooks or controller logic.  |
| SubTask title      | No title, only `subTaskContent`                                      | This is sufficient and simpler.              |
| Task status update | Needs manual update after SubTask changes                            | Automate in controller or Mongoose hooks.    |
| Task deletion      | Manual cascade delete of subtasks                                    | Implement with hooks or in controller.       |
| Validation         | Required fields set                                                  | Always validate inputs in backend.           |
| Password handling  | Password not selected by default                                     | Hash on save; never expose in API responses. |
| Orphan prevention  | Must be done manually                                                | Use validation and cascade deletes to avoid. |

---

_Keep this file handy as a reference for your task/subtask data modeling and backend logic!_

---

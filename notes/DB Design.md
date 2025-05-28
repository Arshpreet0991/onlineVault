# MongoDB Design: Embedding vs Referencing

## 🔹 Core Decision: When to Embed vs When to Reference

### ✅ Use **Embedded Documents** (or Arrays) When:

- Child data is **tightly coupled** to the parent.
- Child items are **not queried independently**.
- The array will remain **small and manageable** (e.g., ≤100 items).
- You need **fast reads** for parent + child together.
- Use case is **append-only**, like logs or history.

#### Pros:

- Fewer queries (all data in one document).
- Easier atomic updates on the whole object.
- Great for reads when always accessed together.

#### Cons:

- Hard to query/filter child items across all documents.
- Max document size limit (16MB in MongoDB).
- Update conflicts possible with concurrent writes to the same array.

#### Example:

> A user has a watch history. You don’t need to query individual watch items globally.  
> → Store `watchHistory` as an array inside the user document.

---

### ✅ Use **Referencing (Separate Collections)** When:

- Child data needs to be **queried independently**.
- There’s a need to **filter, sort, or paginate** child items.
- Child items might be accessed by **other relationships** later.
- Collections might **grow large** and need indexing.

#### Pros:

- Highly scalable and flexible.
- Enables global queries on child items.
- Easier to index and optimize individual fields.

#### Cons:

- Requires multiple queries or `populate` to fetch related data.
- Slightly more complex structure.
- Atomicity only applies at single-document level.

#### Example:

> Each subTask belongs to a task, but you want to show all incomplete subTasks due today, regardless of task.  
> → Store subTasks in a separate collection with a `taskId` reference.

---

## 🧾 Summary Table

| Scenario                                        | Embed (Array) | Reference (Separate Collection) |
| ----------------------------------------------- | ------------- | ------------------------------- |
| Data always accessed with parent                | ✅            | ❌                              |
| Child needs global queries                      | ❌            | ✅                              |
| High read performance for full parent-child set | ✅            | ❌                              |
| Complex child filtering/sorting                 | ❌            | ✅                              |
| Concurrent edits to child items                 | ❌            | ✅                              |
| Limited number of child items (e.g., ≤20)       | ✅            | ❌                              |

---

## 🧠 Design Tip:

> If you're **only ever showing child items inside the parent**, embed them.  
> The moment you want **global access or searchability**, move them out to their own collection and reference the parent.

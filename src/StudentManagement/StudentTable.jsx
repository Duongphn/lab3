export default function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return <p className="empty-state">No students to display.</p>
  }

  return (
    <table className="student-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Major</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td className="id-cell">{student.id}</td>
            <td>{student.name}</td>
            <td>{student.age}</td>
            <td>{student.major}</td>
            <td className="action-cell">
              <button
                type="button"
                className="btn btn-edit"
                onClick={() => onEdit(student)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-delete"
                onClick={() => onDelete(student.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

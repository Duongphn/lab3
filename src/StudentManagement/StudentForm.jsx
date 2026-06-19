import { useState, useCallback } from 'react'

export default function StudentForm({ onAdd, onSave, editingStudent, onCancelEdit, majors }) {
  const [name, setName] = useState(editingStudent ? editingStudent.name : '')
  const [age, setAge] = useState(editingStudent ? String(editingStudent.age) : '')
  const [major, setMajor] = useState(editingStudent ? editingStudent.major : '')
  const [error, setError] = useState('')

  const validate = useCallback(() => {
    if (!name.trim()) return 'Name is required.'
    const numericAge = Number(age)
    if (!age || Number.isNaN(numericAge) || numericAge <= 0) {
      return 'Age must be a positive number.'
    }
    if (!major.trim()) return 'Major is required.'
    return ''
  }, [name, age, major])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const validationError = validate()
      if (validationError) {
        setError(validationError)
        return
      }

      const payload = {
        name: name.trim(),
        age: Number(age),
        major: major.trim(),
      }

      if (editingStudent) {
        onSave({ id: editingStudent.id, ...payload })
      } else {
        onAdd(payload)
        setName('')
        setAge('')
        setMajor('')
        setError('')
      }
    },
    [validate, name, age, major, editingStudent, onSave, onAdd],
  )

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <h2>{editingStudent ? 'Edit Student' : 'Add Student'}</h2>

      <div className="form-row">
        <label>
          Name
          <input
            type="text"
            value={name}
            placeholder="Student name"
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Age
          <input
            type="number"
            min="1"
            value={age}
            placeholder="Age"
            onChange={(e) => setAge(e.target.value)}
          />
        </label>

        <label>
          Major
          {/* Combobox: pick from the list or type a new major by keyboard. */}
          <input
            type="text"
            list="majors-list"
            value={major}
            placeholder="Select or type a major"
            onChange={(e) => setMajor(e.target.value)}
          />
          <datalist id="majors-list">
            {majors.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingStudent ? 'Save Changes' : 'Add Student'}
        </button>
        {editingStudent && (
          <button type="button" className="btn" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

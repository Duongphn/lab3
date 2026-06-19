import { useReducer, useState, useEffect, useMemo, useCallback } from 'react'
import { studentReducer, ACTIONS } from './studentReducer'
import { useTheme } from './theme'
import StudentForm from './StudentForm'
import StudentTable from './StudentTable'
import './StudentManagement.css'

const STORAGE_KEY = 'sm_students'
const ALL_MAJORS = 'All majors'

// A small fixed base list so the dropdown is useful even before any data exists.
const BASE_MAJORS = ['Software Engineering', 'Information Technology', 'Business Administration', 'Marketing']

function loadStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export default function StudentManagement() {
  const [students, dispatch] = useReducer(studentReducer, undefined, loadStudents)

  const [search, setSearch] = useState('')
  const [selectedMajor, setSelectedMajor] = useState(ALL_MAJORS)
  const [editingStudent, setEditingStudent] = useState(null)

  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
  }, [students])

  const majorOptions = useMemo(() => {
    const set = new Set([...BASE_MAJORS, ...students.map((s) => s.major)])
    return Array.from(set).sort()
  }, [students])

  const visibleStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return students.filter((student) => {
      const matchesName = student.name.toLowerCase().includes(keyword)
      const matchesMajor =
        selectedMajor === ALL_MAJORS || student.major === selectedMajor
      return matchesName && matchesMajor
    })
  }, [students, search, selectedMajor])

  const handleAdd = useCallback((payload) => {
    dispatch({ type: ACTIONS.ADD, payload })
  }, [])

  const handleSave = useCallback((payload) => {
    dispatch({ type: ACTIONS.EDIT, payload })
    setEditingStudent(null)
  }, [])

  const handleDelete = useCallback(
    (id) => {
      dispatch({ type: ACTIONS.DELETE, payload: { id } })
      // If we were editing the student that just got deleted, clear the form.
      setEditingStudent((current) => (current && current.id === id ? null : current))
    },
    [],
  )

  const handleEditRequest = useCallback((student) => {
    setEditingStudent(student)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingStudent(null)
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
  }, [])

  const handleMajorChange = useCallback((e) => {
    setSelectedMajor(e.target.value)
  }, [])

  return (
    <div className="student-management">
      <header className="sm-header">
        <h1>Student Management</h1>
        <button type="button" className="btn theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <StudentForm
        key={editingStudent ? editingStudent.id : 'new'}
        onAdd={handleAdd}
        onSave={handleSave}
        editingStudent={editingStudent}
        onCancelEdit={handleCancelEdit}
        majors={majorOptions}
      />

      <div className="sm-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
        />

        <select
          className="major-filter"
          value={selectedMajor}
          onChange={handleMajorChange}
        >
          <option value={ALL_MAJORS}>{ALL_MAJORS}</option>
          {majorOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <span className="student-count">
          Total: {visibleStudents.length} / {students.length}
        </span>
      </div>

      <StudentTable
        students={visibleStudents}
        onEdit={handleEditRequest}
        onDelete={handleDelete}
      />
    </div>
  )
}

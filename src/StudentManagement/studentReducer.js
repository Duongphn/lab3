export const ACTIONS = {
  INIT: 'INIT',
  ADD: 'ADD',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
}

function generateId() {
  return `${Date.now()}`
}

export function studentReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT:
      return action.payload

    case ACTIONS.ADD:
      return [
        ...state,
        {
          id: generateId(),
          name: action.payload.name,
          age: action.payload.age,
          major: action.payload.major,
        },
      ]

    case ACTIONS.EDIT:
      return state.map((student) =>
        student.id === action.payload.id
          ? { ...student, ...action.payload }
          : student,
      )

    case ACTIONS.DELETE:
      return state.filter((student) => student.id !== action.payload.id)

    default:
      return state
  }
}

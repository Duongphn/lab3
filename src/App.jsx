import { ThemeProvider } from './StudentManagement/ThemeContext'
import StudentManagement from './StudentManagement/StudentManagement'

function App() {
  return (
    <ThemeProvider>
      <StudentManagement />
    </ThemeProvider>
  )
}

export default App

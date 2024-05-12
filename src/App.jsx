import { BrowserRouter, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/public/login"
import AdminLayout from "./components/layout/admin"
import StudentsPage from "./pages/admin/StudentsPage"
import TeachersPage from "./pages/admin/TeachersPage"
import DashBoardPage from "./pages/admin/dashboard/DashBoardPage"
import StudentPage from "./pages/admin/StudentPage"
// import TeachersHookPage from "./pages/admin/TeachersWithHook"

function App() {

  return (
    <BrowserRouter>
    <Routes>
      {/* <Route index element={<HomePage/>} /> */}
      <Route index element={<LoginPage/>} />
      <Route path="admin" element={<AdminLayout/>} >
        <Route path="dashboard" element={<DashBoardPage/>} />
        <Route path="students" element={<StudentsPage/>} />
        {/* <Route path="hook" element={<TeachersHookPage/>} /> */}
        <Route path="teachers" element={<TeachersPage/>} />
          <Route path="teachers/:id" element={<StudentPage/>} />
        <Route/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App

import { Route, Routes } from 'react-router-dom'

import NavBar from './components/NavBar'
import Footer from './components/Footer'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Admin/Dashboard'
import Students from './pages/Admin/Students'
import Courses from './pages/Admin/Courses'
import MyCourses from './pages/MyCourse'

function App() {

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <NavBar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register  />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/admin/students' element={<Students />} />
        <Route path='/admin/courses' element={<Courses />} />
        <Route path='my-course' element={< MyCourses/>} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import React from "react"
import { Provider } from './components/ui/provider.jsx'
import IndexPage from './IndexPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CoursePage from './CoursePage.jsx'
import SubmissionPortal from './SubmissionPortal.jsx'
import GradePage from './GradePage.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<IndexPage />} />
          <Route path="/assignments/:courseId" element={<CoursePage />} />
          <Route path="/assignments/:courseId/:assignmentId" element={<SubmissionPortal />} />
          <Route path="/courses/:courseId/grades" element={<GradePage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)


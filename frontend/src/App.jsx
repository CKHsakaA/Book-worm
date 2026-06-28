import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx'
import BookinfoPage from '../pages/BookinfoPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/getbookinfo/:bookid" element={<BookinfoPage />} />
          <Route path="/signup" element={<SignupPage/>}></Route>
        </Routes>
    </>
  )
}

export default App

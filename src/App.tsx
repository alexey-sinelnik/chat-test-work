import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./helpers/router";
import HomePage from "./pages/home";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";


function App() {

  return (
      <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="login" element={<SignInPage />} />
          <Route path="register" element={<SignUpPage />} />
      </Routes>
  )
}

export default App

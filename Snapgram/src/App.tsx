import { Routes, Route } from 'react-router-dom';
import SignupForm from './_auth/form/SignupForm';
import SigninForm from './_auth/form/SigninForm';
import { Home } from './_root/pages';
import './globals.css';
import RootLayout from './_root/RootLayout';


const App = () => {
  return (
    <main>
        <Routes>
            <Route element={<AuthLayout />}>
                {/* private routes */}
                <Route path="sign-in" element={<SigninForm />} />
                <Route path="sign-up" element={<SignupForm />} />
            </Route>

            <Route element = {<RootLayout />}>
                {/* public routes */}
                <Route index element={<Home />} />
            </Route>
        </Routes>
    </main>
  )
}

export default App
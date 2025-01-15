import { Routes, Route } from 'react-router-dom';
import AuthLayout from './_auth/AuthLayout';
import SignupForm from './_auth/form/SignupForm';
import SigninForm from './_auth/form/SigninForm';
import RootLayout from './_root/RootLayout';
import { Home } from './_root/pages';
// import { Toaster } from "@/components/ui/toaster";

import './globals.css';



const App = () => {
  return (
    <main className="flex h-screen">
        <Routes>
            <Route element={<AuthLayout />}>
                {/* public routes */}
                <Route path="sign-in" element={<SigninForm />} />
                <Route path="sign-up" element={<SignupForm />} />
            </Route>

            <Route element={<RootLayout />}>
                {/* private routes */}
                <Route index element={<Home />} />
            </Route>
        </Routes>

        {/* <Toaster /> */}
    </main>
  )
}

export default App
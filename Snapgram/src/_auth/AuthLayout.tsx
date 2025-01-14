import { Outlet, Navigate } from 'react-router-dom';



const AuthLayout = () => {
    const isAuthenticated = true;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
    ): (
        <>
          <section className="flex flex-1 justify-center items-center py-10" >
            <Outlet />

            <img 
            src="/asset/images/side-img.svg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat" 
            />
          </section>
        </>


      )}
    </>
  )
}

export default AuthLayout
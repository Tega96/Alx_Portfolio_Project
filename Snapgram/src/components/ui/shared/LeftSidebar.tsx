import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'
import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'


const LeftSidebar = () => {
  const { pathname } = useLocation;
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img 
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        {/* <Link to="{`/profile/${user.id}`}" className="flex gap-3 items-center">
          <img 
            src{user.imageUrl} || "/assets/icons/profile-placeholder.svg"
            alt="profile"
            className="h-14 w-14 rounded-full"
          />

          <div className="flex flex-col">
            <p className="body-bold">
              {user.name}
            </p> 

            <p className="small-regular text-light-3">
            @{user.username}
            </p>
            
            
            <ul className="flex flex-col gap-6">
              {sidebarLinks.map((link: INavLink) => {
                return (
                  <li key={Link.label}
                  className="leftsidebar-link">
                    <NavLink
                      to="{link.route}"
                      className="flex gap-4 items-center p-4"
                    >
                      <img 
                        src={link.imgURL}
                        alt={link.label}
                        className="group-hover:invert-white"
                      />

                    </NavLink>
                  </li>
                )
              })}
            </ul>

          </div>
        </Link> */}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label}
              className={`leftsidebar-link group ${
                isActive && 'bg-primary-500'}`}>
                <NavLink
                  to="{link.route}"
                  className="flex gap-4 items-center p-4"
                >
                  <img 
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && 'invert-white'}`}
                  />

                </NavLink>
              </li>
            )
          })}
        </ul>






      </div>
    </nav>
  )
}

export default LeftSidebar
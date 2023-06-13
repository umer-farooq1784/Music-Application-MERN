import React, { Fragment, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../logo.png';
import { StyleActive, StyleInactive } from '../utils/styles';
import { FaCrown } from "react-icons/fa";
import {useStateValue} from "../context/StateProvider"
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import { motion } from "framer-motion";



const Header = () => {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [isMenu, setIsMenu] = useState(false);

  const signout = () => {
    const firebaseAuth = getAuth(app);
    firebaseAuth.signOut().then(() => {
      window.localStorage.setItem("auth", "false");
    }).catch((error) => console.log(error));
    navigate("/login", { replace: true });
  };

  return (
    
   <header className='flex items-center w-full p-4 md:py-4 md:px-6' onMouseEnter={() => setIsMenu(true)} onMouseLeave={() => setIsMenu(false)}>
      <NavLink to={"/"}>
        <img src={Logo} alt='Logo' className='w-24'/>
      </NavLink>

      <ul className='flex items-center justify-center ml-6'>
        <li className='mx-5 text-lg'>
          <NavLink to={"/home"} className={({isActive}) => isActive ? StyleActive : StyleInactive}>Home</NavLink>
        </li>
        {/* <li className='mx-5 text-lg'>
          <NavLink to={"/songs"}className={({isActive}) => isActive ? StyleActive : StyleInactive}>Songs</NavLink>
        </li> */}
        {/* <li className='mx-5 text-lg'>
          <NavLink to={"/premium"}className={({isActive}) => isActive ? StyleActive : StyleInactive}>Premium</NavLink>
        </li> */}
        <li className='mx-5 text-lg'>
          <NavLink to={"/contact"} className={({isActive}) => isActive ? StyleActive : StyleInactive}>Contact Us</NavLink>
        </li>
      </ul>

      <div className="flex items-center ml-auto cursor-pointer gap-2 relative">
        <img
          className="w-12 min-w-[44px] object-cover rounded-full shadow-lg"
          src={user?.user?.imageURL}
          alt=""  
          referrerpolicy="no-referrer"
        />
        <div className="flex flex-col">
          <p className="text-textColor text-lg hover:text-headingColor font-semibold">
            {user?.user.name}
          </p>
          <p className="flex items-center gap-2 text-xs text-gray-500 font-normal">
            Premium Member{" "}
            <FaCrown className="text-xm -ml-1 text-yellow-500" />{" "}
          </p>
        </div>
        {isMenu && (
          <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className='absolute z-10 top-10 p-4 right-0 w-225 gap-4 bg-card shadow-lg rounded-lg backdrop-blur-sm flex flex-col'>
            <NavLink to={'/Profile'}>
              <p className='text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out'>Profile</p>
            </NavLink>
            {/* <p className='text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out'>My Favourites</p> */}
            <hr />
            {user?.user.role === "admin" && (
              <>
                <NavLink to={"/dashboard/home"}>
                  <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                    Dashboard
                  </p>
                </NavLink>
                <hr />
              </>
            )}
            <p className='text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out' onClick={signout}>Sign Out</p>
          </motion.div>

        )}
        
      </div>
    </header>
  
  )
}

export default Header;

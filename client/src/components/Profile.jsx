import React from 'react';
import { useStateValue } from '../context/StateProvider';
import { NavLink, useNavigate } from 'react-router-dom';
import Header from './Header';
import {motion} from "framer-motion"
import moment from "moment";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";

const UserProfile = ({ name, id, profilePicture }) => {
    
  const [{ user }, dispatch] = useStateValue();
  const createdAt = moment(new Date(user?.user?.createdAt)).format("MMMM Do YYYY");
  const navigate = useNavigate();
  const signout = () => {
    const firebaseAuth = getAuth(app);
    firebaseAuth.signOut().then(() => {
      window.localStorage.setItem("auth", "false");
    }).catch((error) => console.log(error));
    navigate("/login", { replace: true });
  };
  return (
    <div className="w-full h-full">
  <Header />
  <h2 className="px-4 py-2 text-2xl font-semibold text-center bg-red-600 text-white rounded-md mb-4">
      My Profile
    </h2>

  <div className="max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded-md shadow-md">
    

    <div className="flex items-center justify-center mb-4">
      <div className="flex-shrink-0">
        <img
          src={user?.user?.imageURL}
          alt=""
          referrerpolicy="no-referrer"
          className="w-20 h-20 rounded-md object-cover"
        />
      </div>

      <div className="ml-4">
        <h2 className="text-4xl font-semibold mt-8">{user?.user.name}</h2>
      </div>
    </div>

    <div className="mb-4 ml-14">
      <div className="flex flex-row items-center">
        <h1 className="text-lg font-bold mr-2">Email:</h1>
        <h2 className="text-lg font-light">{user?.user.email}</h2>
      </div>

      <div className="flex flex-row items-center">
        <h1 className="text-lg font-bold mr-2">Role:</h1>
        <h2 className="text-lg font-light">{user?.user.role}</h2>
      </div>

      <div className="flex flex-row items-center">
        <h1 className="text-lg font-bold mr-2">Joined:</h1>
        <h2 className="text-lg font-light">{createdAt}</h2>
      </div>
    </div>
    <div className="flex items-center justify-center w-30 cursor-pointer p-4">
               

        <motion.button whileTap={{scale: 0.75}} className="px-8 py-2 rounded-md w-full text-white bg-red-600 
        hover: shadow-lg" onClick={signout}>
          log Out
        </motion.button>
              

      </div>

    <div className="border-t border-gray-200 pt-4">
      {/* Add additional profile attributes here */}
    </div>
  </div>
</div>
  );
};

export default UserProfile;

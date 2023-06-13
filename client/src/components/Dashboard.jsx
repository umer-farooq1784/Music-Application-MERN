import React from 'react'
import Header from './Header';
import { NavLink ,Route, Routes} from 'react-router-dom';
import { StyleActive, StyleInactive } from '../utils/styles';
import { IoHome } from "react-icons/io5";
import DashboardAlbums from "./DashboardAlbums";
import DashboardArtists from "./DashboardArtists";
import DashBoardHome from "./DashboardHome";
import DashboardSongs from "./DashboardSongs";
import DashboardUsers from "./DashboardUsers";
import DashboardNewSong from "./DashboardNewSong";
import { useStateValue } from '../context/StateProvider';
import Alert from "./Alert"
const Dashboard = () =>
{

  const [
    {
      alertType
    },
    dispatch,
  ] = useStateValue();
    return (
      <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      
        <Header />

        <div className="w-[60%] my-2 p-4 flex items-center justify-evenly">
          <NavLink to={"/dashboard/home"}><IoHome className="text-2xl text-textColor" /></NavLink>
          <NavLink to={"/dashboard/user"} className={({ isActive }) => isActive ? StyleActive : StyleInactive }> Users </NavLink>
          <NavLink to={"/dashboard/songs"} className={({ isActive }) => isActive ? StyleActive : StyleInactive }> Songs </NavLink>
          <NavLink to={"/dashboard/artist"} className={({ isActive }) => isActive ? StyleActive : StyleInactive }> Artist </NavLink>
          <NavLink to={"/dashboard/albums"} className={({ isActive }) => isActive ? StyleActive : StyleInactive }> Albums </NavLink>
        </div>

        <div className="my-4 w-full p-4">
          <Routes>
            <Route path="/home" element={<DashBoardHome />} />
            <Route path="/user" element={<DashboardUsers />} />
            <Route path="/songs" element={<DashboardSongs />} />
            <Route path="/artist" element={<DashboardArtists />} />
            <Route path="/albums" element={<DashboardAlbums />} />
            <Route path="/newSong" element={<DashboardNewSong />} />
          </Routes>
        </div>

        {alertType && (

          <Alert type={alertType}/>
        )}
      </div>

        

    )
}

export default Dashboard;
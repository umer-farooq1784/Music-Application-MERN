import React ,{ useEffect } from 'react'
import { useStateValue } from "../context/StateProvider";

import { getAllUsers, getAllSongs, getAllArtists, getAllAlbums } from "../api";
import { actionType } from "../context/reducer";
import { FaUsers } from 'react-icons/fa';
import  { bgColors } from "../utils/styles";
import { GiLoveSong } from 'react-icons/gi';
import {RiUserStarFill } from 'react-icons/ri';
import {IoIosAlbums } from 'react-icons/io';
export const DashboardCard = ({icon, name, count }) => {
    
    const bg_Color = bgColors[parseInt(Math.random() * bgColors.length)];
    return (
        <div  style={{background : `${bg_Color}`}} className=' p-4 w-40 gap-3 h-auto rounded-lg shadow-md flex flex-col items-center justify-center '>
            {icon}
            <p className='text-xl text-textColor font-semibold'>{name}</p>
            <p className='text-xl text-textColor'>{count}</p>
        </div>
    )
} 

const DashboardHome = () =>
{
    const [{ allUsers , allSongs, allArtists , allAlbums}, dispatch] =
    useStateValue();

    useEffect(() => {
        if (!allUsers) {
          getAllUsers().then((data) => {
            // console.log(data.data);
            dispatch({
                type: actionType.SET_ALL_USERS,
                allUsers: data.data,
            });
          });
        }

        if (!allArtists) {
            getAllArtists().then((data) => {
              // console.log(data.data);
              dispatch({
                  type: actionType.SET_ALL_ARTISTS,
                  allArtists: data.data,
              });
            });
          }

          if (!allAlbums) {
            getAllAlbums().then((data) => {
              // console.log(data.data);
              dispatch({
                  type: actionType.SET_ALL_ALBUMNS,
                  allAlbums: data.data,
              });
            });
          }

          if (!allSongs) {
            getAllSongs().then((data) => {
              // console.log(data.data);
              dispatch({
                  type: actionType.SET_ALL_SONGS,
                  allSongs: data.data,
              });
            });
          }


      }, []);

    return (
        <div className='w-full p-5 flex items-center justify-evenly flex-wrap'>
            <DashboardCard icon={<FaUsers className="text-3xl text-white" />} name={"Users"} count={allUsers?.length > 0 ? allUsers?.length:0} />
            <DashboardCard icon={<GiLoveSong className="text-3xl text-white" />} name={"Songs"} count={allSongs?.length > 0 ? allSongs?.length:0} />
            <DashboardCard icon={<RiUserStarFill className="text-3xl text-white" />} name={"Artists"} count={allArtists?.length > 0 ? allArtists?.length:0} />
            <DashboardCard icon={<IoIosAlbums className="text-3xl text-white" />} name={"Albums"} count={allAlbums?.length > 0 ? allAlbums?.length:0} />

           
        </div>
    )
}

export default DashboardHome;
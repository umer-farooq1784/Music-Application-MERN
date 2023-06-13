import React, { useState } from "react";
import {motion} from "framer-motion"
import {IoTrash} from "react-icons/io5"
import { deleteAlbumById, deleteArtistById, deleteSongById, getAllAlbums, getAllArtists, getAllSongs } from "../api";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../config/firebase.config";

const SongCard = ({data, index, type }) =>{
    const [isDelete, setIsDelete] = useState(false);
    const [{alertType, allArtists, allAlbums, allSongs,songIndex,isSongPlaying,user }, dispatch] = useStateValue();
  

    const displayAlbumSongs = () => {
               
        const albumId = data._id; // Assuming the album ID is stored in the data object
        
        getAllSongs().then((data) => {
          const albumSongs = data.filter((song) => song.albumId === albumId);
        
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: albumSongs,
          });
        });
      };

    const deleteData = (data) => {
        if(type === "song")
        {
            const deleteRef = ref(storage, data.imageURL);
            deleteObject(deleteRef).then(() => {
        
            });

            deleteSongById(data._id).then((res) => {
                if(res.data)
                {
                    dispatch(
                        {
                            type :actionType.SET_ALERT_TYPE,
                            alertType : "success"
                        }
                    )
                    setInterval(() =>
                    {
                        dispatch(
                            {
                                type :actionType.SET_ALERT_TYPE,
                                alertType : null
                            }
                        )
                    }, 3000);

                    getAllSongs().then((data) => {
                        dispatch({
                            type: actionType.SET_ALL_SONGS,
                            allSongs: data.data,
                        });
                    });
                }
                else
                {
                    dispatch(
                        {
                            type :actionType.SET_ALERT_TYPE,
                            alertType : "danger"
                        }
                    )
                    setInterval(() =>
                    {
                        dispatch(
                            {
                                type :actionType.SET_ALERT_TYPE,
                                alertType : null
                            }
                        )
                    }, 3000); 
                }
            })
        }

        //for album
        if(type === "album")
        {


           


            const deleteRef = ref(storage, data.imageURL);
            deleteObject(deleteRef).then(() => {
        
            });

            deleteAlbumById(data._id).then((res) => {
                if(res.data)
                {
                    dispatch(
                        {
                            type :actionType.SET_ALERT_TYPE,
                            alertType : "success"
                        }
                    )
                    setInterval(() =>
                    {
                        dispatch(
                            {
                                type :actionType.SET_ALERT_TYPE,
                                alertType : null
                            }
                        )
                    }, 3000);

                    getAllAlbums().then((data) => {
                        dispatch({ type: actionType.SET_ALL_ALBUMNS, allAlbums: data.data });
                    });
                }
                else
                {
                    dispatch(
                        {
                            type :actionType.SET_ALERT_TYPE,
                            alertType : "danger"
                        }
                    )
                    setInterval(() =>
                    {
                        dispatch(
                            {
                                type :actionType.SET_ALERT_TYPE,
                                alertType : null
                            }
                        )
                    }, 3000); 
                }
            })
        }

        //for artist
        if(type === "artist")
        {
            const deleteRef = ref(storage, data.imageURL);
            deleteObject(deleteRef).then(() => {
        
            });

            deleteArtistById(data._id).then((res) => {
                if(res.data)
                {
                    dispatch(
                        {
                            type :actionType.SET_ALERT_TYPE,
                            alertType : "success"
                        }
                    )
                    setInterval(() =>
                    {
                        dispatch(
                            {
                                type :actionType.SET_ALERT_TYPE,
                                alertType : null
                            }
                        )
                    }, 3000);

                    getAllArtists().then((data) => {
                        // console.log(data.data);
                        dispatch({
                            type: actionType.SET_ALL_ARTISTS,
                            allArtists: data.data,
                        });
                      });
                }
                else
                {
                    dispatch(
                        {
                            type :actionType.SET_ALERT_TYPE,
                            alertType : "danger"
                        }
                    )
                    setInterval(() =>
                    {
                        dispatch(
                            {
                                type :actionType.SET_ALERT_TYPE,
                                alertType : null
                            }
                        )
                    }, 3000); 
                }
            })
        }
    }
    const addToContext = () =>
    {
        if(!isSongPlaying)
        {
           dispatch({
            type: actionType.SET_ISSONG_PLAYING,
            isSongPlaying: true,

           }) 
        }
        if(songIndex != index)
        {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: index,

            })
        }
    }

    return (
        <motion.div className="relative w-40 min-w-210 px-2 py-4 cursor-pointer
         hover:bg-card bg-gray-100 shadow-md roudned-lg flex flex-col items-center">

            <motion.div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden "
            onClick={() => { if (type === 'song') addToContext(); }}
           >
                <motion.img 
                whileHover={{scale :1.05}
            }
                
                src={data.imageURL} 
                className="w-full h-full rounded-lg object-cover">




                </motion.img>
            </motion.div>

            <p className="text-base text-center text-headingColor font-semibold my-2">
                {data.name.length > 25 ? `${data.name.slice(0,25)}..`: data.name}
                
                {data.artist && (
                    <span className="block text-sm text-gray-400 my-1">
                    {data.artist.length > 25 ? `${data.artist.slice(0,25)}....`: data.artist}
                    </span>
                )}
                
            </p>
            {user?.user.role === "admin"&& (
            <div className="w-full absolute bottom-2 flex items-center
            justfy-between px-4">
            <motion.i whileTap={{scale: 0.75}} className="text-base text-red-400 drop-shadow-md hover:text-red-600" onClick={() => setIsDelete(true)}>
                <IoTrash/>
            </motion.i>



            </div>
            )}
            {isDelete && (
                <motion.div className="absolute inset-0 backdrop-blur-sm bg-cardOverlay flex items-center flex-col justify-center px-4 py-2  ">
                <p className="text-lg text-headingColor font-semibold text-center">Are you sure you want to delete it ? </p>
                <div className="flex items-center gap-4"> 
                    <motion.button className="px-2 py-1 text-sm uppercase bg-red-300 rounded-md hover:bg-red-500 cursor-pointer"
                    whileTap={{scale : 0.7}} onClick= {() => deleteData(data)}
                    >yess</motion.button>
                    <motion.button className="px-2 py-1 text-sm uppercase bg-green-300 rounded-md hover:bg-green-500 cursor-pointer"
                    whileTap={{scale : 0.7}} onClick={() => setIsDelete(false)}
                    >No</motion.button>
                </div>

            </motion.div>
            )}
            

        </motion.div>
        );
    
};
export default SongCard
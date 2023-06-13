import React, { useEffect, useRef, useState } from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { motion } from "framer-motion";

import { BiCloudUpload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import { storage } from "../config/firebase.config";
import { useStateValue } from "../context/StateProvider";
import {
  getAllAlbums,
  getAllArtists,
  getAllSongs,
  saveNewAlbum,
  saveNewArtist,
  saveNewSong,
} from "../api";
import { actionType } from "../context/reducer";
import FilterButtons from "./FilterButtons";
import { filterByLanguage, filters } from "../utils/supportfunctions";
//import album from "../../../server/models/album";

//import AlertSuccess from "./AlertSuccess";
//import AlertError from "./AlertError";

const DashboardNewSong = () => {
  const [songName, setSongName] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [songImageCover , setSongImageCover] = useState(null);
  const [imageUploadProgress , setImageUploadProgress] = useState(0);
  const [audioImageCover , setAudioImageCover] = useState(null);
  const [audioUploadingProgress , setAudioUploadingProgress] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [
    {
      allArtists,
      allAlbums, 
      allSongs,
      artistFilter, 
      albumFilter, 
      filterTerm ,
      languageFilter ,
      alertType
    },
    dispatch,
  ] = useStateValue();

  const [artistImageCover, setArtistImageCover] = useState(null);
  const [artistUploadingProgress , setArtistUploadingProgress] = useState(0);
  const [isArtistUploading, setIsArtistUploading] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  

  const [albumImageCover, setAlbumImageCover] = useState(null);
  const [albumUploadingProgress , setAlbumUploadingProgress] = useState(0);
  const [isAlbumUploading, setIsAlbumUploading] = useState(false);
  const [albumName, setAlbumName] = useState("");

  useEffect(() => {
   if (!allArtists) {
      getAllArtists().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, allArtists: data.data });
      });
    }

    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({ type: actionType.SET_ALL_ALBUMNS, allAlbums: data.data });
      });
    }
  }, []);;


 const deleteFileObject = (url ,isImage ) => {
    if (isImage){
      setIsImageLoading(true);
      setIsAudioLoading(true);
      setIsAlbumUploading(true);
      setIsArtistUploading(true);
      

    }

    const deleteRef = ref(storage, url);
    deleteObject(deleteRef).then(() => {

      setSongImageCover(null);
      setAudioImageCover(null);
      setIsAudioLoading(false);
      setIsImageLoading(false);
      setAlbumImageCover(null);
      setArtistImageCover(null);
      setIsAlbumUploading(false);
      setIsArtistUploading(false);
    });
    dispatch({
      type: actionType.SET_ALERT_TYPE,
      alertType: "success"
    })

    setInterval(() =>{
      dispatch({
        type: actionType.SET_ALERT_TYPE,
        alertType: null
      })
    }, 5000)
  };

  const saveSong = () =>{
    if(!songImageCover || !audioImageCover){
        //throw alert
        dispatch({
          type: actionType.SET_ALERT_TYPE,
          alertType: "danger"
        })
  
        setInterval(() =>{
          dispatch({
            type: actionType.SET_ALERT_TYPE,
            alertType: null
          })
        }, 3000)
    }else{
      setIsAudioLoading(true);
      setIsImageLoading(true);

      const data={
        name: songName,
        imageURL: songImageCover,
        songUrl: audioImageCover ,
        album: albumFilter ,
        artist: artistFilter,
        language: languageFilter,
        category: filterTerm,
      }
      saveNewSong(data).then(res =>{
        getAllSongs().then(songs =>{
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs : songs.data
          })
        })
          
        
      })
      
      dispatch({
        type: actionType.SET_ALERT_TYPE,
        alertType: "success"
      })

      setInterval(() =>{
        dispatch({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        })
      }, 3000)

      setSongName(null);
      setIsAudioLoading(false);
      setIsImageLoading(false);
      setSongImageCover(null);
      setAudioImageCover(null);
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
      //setDuration(null);

    }
  }
  

  const saveArtist =()=>{
    if(!artistImageCover || !artistName  || !twitter || !instagram){
      //throw alert

      dispatch({
        type: actionType.SET_ALERT_TYPE,
        alertType: "danger"
      })

      setInterval(() =>{
        dispatch({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        })
      }, 3000)
  }else{
      setIsArtistUploading(true);
      const data={
      name: artistName,
      imageURL: artistImageCover,
      twitter: `www.twitter.com/${twitter}`,
      instagram: `www.instagram.com/${instagram}`,
      }


      saveNewArtist(data).then(res =>{
        getAllSongs().then(artists =>{
          dispatch({
            type: actionType.SET_ALL_ARTISTS,
            allArtists : artists.data
          })
        })
          

        
      })


      dispatch({
        type: actionType.SET_ALERT_TYPE,
        alertType: "success"
      })

      setInterval(() =>{
        dispatch({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        })
      }, 3000)

      setIsArtistUploading(false);
      setArtistImageCover(null);
      setArtistName("");
      setTwitter("");
      setInstagram("");

  }
  }

  const saveAlbum = () => {

    if(!albumImageCover || !albumName){
      //throw alert

      dispatch({
        type: actionType.SET_ALERT_TYPE,
        alertType: "danger"
      })

      setInterval(() =>{
        dispatch({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        })
      }, 3000)
    }else{
      setIsAlbumUploading(true);
      const data= {
        name: albumName,
         imageURL: albumImageCover,
      }

      saveNewAlbum(data).then(res =>{
        getAllAlbums().then(album =>{
          dispatch({
            type: actionType.SET_ALL_ALBUMNS,
            allAlbums : album.data
          })
        })


      })

      dispatch({
        type: actionType.SET_ALERT_TYPE,
        alertType: "success"
      })

      setInterval(() =>{
        dispatch({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        })
      }, 3000)

      setIsAlbumUploading(false);
      setAlbumImageCover(null);
      setAlbumName("");
    }

  }
  return (
    <div className="flex w-full flex-col items-center justify-center p-4 border border-gray-300 rounded-md">
      
      <input
        type="text"
        placeholder="Type your song name"
        className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
      />
      <div  className="flex w-full justify-between flex-wrap items-center gap-4">
        <FilterButtons filterData={allArtists} flag={"Artist"}/>
        <FilterButtons filterData={allAlbums} flag={"Album"}/>
        <FilterButtons filterData={filterByLanguage} flag={"Language"}/>
        <FilterButtons filterData={filters} flag={"Category"}/>
      
      </div>
            
      <div className="bg-card backdrop-blur-md w-full  h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isImageLoading && <FileLoader progress= {imageUploadProgress}/>}
        {!isImageLoading && (

          <>
             {!songImageCover ? (
              <FileUploader updateState = {setSongImageCover}
              setProgress = {setImageUploadProgress} isLoading = {setIsImageLoading} isImage={true}
              />
             ): (
               
                 <div className="realtive w-full h-full overflow-hidden rounded-md ">
                    <img src={songImageCover} className="w-full object-cover" alt=""/>
                    <button type="button" className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out" onClick={( )=> deleteFileObject(songImageCover, true)}>

                      <MdDelete className="text-white"/>
                    </button>

                 </div>
             )}
          </>
        )}
      </div> 

      {/* Audio File */}

      <div className="bg-card backdrop-blur-md w-full  h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isAudioLoading && <FileLoader progress= {audioUploadingProgress}/>}
        {!isAudioLoading && (

          <>
             {!audioImageCover ? (
              <FileUploader updateState = {setAudioImageCover}
              setProgress = {setAudioUploadingProgress} isLoading = {setIsAudioLoading} isImage={false}
              />
             ): (
               
                 <div className="realtive w-full h-full flex items-center justify-center overflow-hidden rounded-md ">
                    {/* <img src={audioImageCover} className="w-full object-cover" alt=""/> */}
                    <audio src={audioImageCover} controls ></audio>
                    <button type="button" className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out" onClick={( )=> deleteFileObject(audioImageCover, false)}>

                      <MdDelete className="text-white"/>
                    </button>

                 </div>
             )}
          </>
        )}
      </div>
      
        <div className="flex items-center justify-center w-60 cursor-pointer p-4">
                {isImageLoading || isAudioLoading ? (
                  <DisabledButton></DisabledButton>
                ):(

                  <motion.button whileTap={{scale: 0.75}} className="px-8 py-2 rounded-md w-full text-white bg-red-600 
                  hover: shadow-lg" onClick={saveSong}>
                    Save song
                  </motion.button>
                )}

        </div>
       {/* Image Uploader for Artist */}
      <p className="text-xl font-semibold text-headingColor"> Artist Details</p>
       <div className="bg-card backdrop-blur-md w-full  h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isArtistUploading && <FileLoader progress= {artistUploadingProgress}/>}
        {!isArtistUploading && (

          <>
             {!artistImageCover ? (
              <FileUploader updateState = {setArtistImageCover}
              setProgress = {setArtistUploadingProgress} isLoading = {setIsArtistUploading} isImage={true}
              />
             ): (
               
                 <div className="realtive w-full h-full overflow-hidden rounded-md ">
                    <img src={artistImageCover} className="w-full object-cover" alt=""/>
                    <button type="button" className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out" onClick={( )=> deleteFileObject(artistImageCover, true)}>

                      <MdDelete className="text-white"/>
                    </button>

                 </div>
             )}
          </>
        )}
      </div> 
       {/* input for name */}

       <input
        type="text"
        placeholder="Type Artist Name"
        className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
        value={artistName}
        onChange={(e) => setArtistName(e.target.value)}
      />

      {/* twitter */}

      <div className="flex items-center rounded-md p-3 border border-gray-300 w-full">
      <p className="text-base font-semibold text-gray-400">www.twitter.com/</p>
      <input type = "text" placeholder="artist twitter id"
      className="w-full text-base font-semibold text-textColor outline-none bg-transparent"
      value={twitter}
      onChange={(e) => setTwitter(e.target.value)}
      ></input>
      </div>
      

      {/* instagram */}

      <div className="flex items-center rounded-md p-3 border border-gray-300 w-full">
      <p className="text-base font-semibold text-gray-400">www.instagram.com/</p>
      <input type = "text" placeholder="artist instagram id"
      className="w-full text-base font-semibold text-textColor outline-none bg-transparent"
      value={instagram}
      onChange={(e) => setInstagram(e.target.value)}
      ></input>
      </div>

      {/* button */}
      <div className="flex items-center justify-center w-60 cursor-pointer p-4">
                {isArtistUploading  ? (
                  <DisabledButton></DisabledButton>
                ):(

                  <motion.button whileTap={{scale: 0.75}} className="px-8 py-2 rounded-md w-full text-white bg-red-600 
                  hover: shadow-lg" onClick={saveArtist}>
                    Save Artist
                  </motion.button>
                )}

        </div>
        {/* Album */}
        <p className="text-xl font-semibold text-headingColor"> Album Details</p>
       <div className="bg-card backdrop-blur-md w-full  h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isAlbumUploading && <FileLoader progress= {albumUploadingProgress}/>}
        {!isAlbumUploading && (

          <>
             {!albumImageCover ? (
              <FileUploader updateState = {setAlbumImageCover}
              setProgress = {setAlbumUploadingProgress} isLoading = {setIsAlbumUploading} isImage={true}
              />
             ): (
               
                 <div className="realtive w-full h-full overflow-hidden rounded-md ">
                    <img src={albumImageCover} className="w-full object-cover" alt=""/>
                    <button type="button" className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out" onClick={( )=> deleteFileObject(albumImageCover, true)}>

                      <MdDelete className="text-white"/>
                    </button>

                 </div>
             )}
          </>
        )}
      </div> 


      {/* input for name */}

      <input
        type="text"
        placeholder="Type Artist Name"
        className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
        value={albumName}
        onChange={(e) => setAlbumName(e.target.value)}
      />

      {/* button */}
      <div className="flex items-center justify-center w-60 cursor-pointer p-4">
                {isAlbumUploading  ? (
                  <DisabledButton></DisabledButton>
                ):(

                  <motion.button whileTap={{scale: 0.75}} className="px-8 py-2 rounded-md w-full text-white bg-red-600 
                  hover: shadow-lg" onClick={saveAlbum}>
                    Save Album
                  </motion.button>
                )}

        </div>

    </div>
  );

  
};

export const DisabledButton = () => {

    
}

export const FileLoader = ({progress})=>{
  return(
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-xl font-semibold text-textColor">
        {Math.round(progress) > 0 && <>{`${Math.round(progress)}%`}</>}
      </p>
      <div className="w-20 h-20 min-w-[40px] bg-red-600  animate-ping  rounded-full flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full bg-red-600 blur-xl "></div>
      </div>
    </div>
  )

    
  
}


export const FileUploader =({updateState , setProgress , isLoading, isImage}) =>{

  const [
    {
      
      alertType
    },
    dispatch,
  ] = useStateValue();
  const uploadFile = (e) =>{
    isLoading(true);
    const uploadedFile = e.target.files[0];
    // console.log(uploadedFile);
    // isLoading(false);

   const storageRef = ref(storage, `${isImage ? "images" : "Audio"}/${Date.now()}-${uploadedFile.name}` )
   const uploadTask = uploadBytesResumable(storageRef, uploadedFile);

   uploadTask.on(
    "state_changed" , 
    (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    },
      (error) => { console.log(error)
        dispatch({
          type: actionType.SET_ALERT_TYPE,
          alertType: "danger"
        })
  
        setInterval(() =>{
          dispatch({
            type: actionType.SET_ALERT_TYPE,
            alertType: null
          })
        }, 5000)
      
      },
      () => { getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=> {

        updateState(downloadURL);
        isLoading(false);
      });

      dispatch({
        type: actionType.SET_ALERT_TYPE,
        alertType: "success"
      })

      setInterval(() =>{
        dispatch({
          type: actionType.SET_ALERT_TYPE,
          alertType: null
        })
      }, 5000)

      
      },
      () => {}
    
   );
  }
  return <label>

    <div className="flex flex-col items-center justify-center h-full">

        <div className="flex flex-col jsutify-center items-center cursor-pointer"></div>
        <p className="font-bold text-2xl">
          <BiCloudUpload/>
        </p>

        <p className="text-lg">Click to Upload { isImage ? "image" : "an audio"} </p>
    </div>
    <input type="file" name="upload-file" 
    accept={`${isImage ? "image/*" : "audio/*"}`}
    className={"w-0 h-0"}
    onChange ={uploadFile}

    
    />

  </label>
}

export default DashboardNewSong

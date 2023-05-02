import React, {useState, useEffect} from "react";
import axios from "axios";
import Cookies from "js-cookie";

import {useNavigate} from "react-router-dom"

import "./Friends.css";

import IncomingFriendsPopup from "../Components/IncomingFriendsPopup";
import FriendProfileChip from "../Components/FriendProfileChip";
import AddFriendArea from "../Components/AddFriendArea";
import FriendRequestStatusAlert from "../Components/FriendRequestStatusAlert";

const Friends = () => {

    const [data, setData] = useState([]);
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [displayAlert, setDisplayAlert] = useState([false, false]); //[ShouldDisplay, WasSuccessful]

    let hasFriends = false;
    let friendsDisplay = null;
    let requestStatusAlert = null;

    console.log(displayAlert);
    displayAlert[0] == true ? requestStatusAlert = <FriendRequestStatusAlert success={!displayAlert[1]}/> : requestStatusAlert = null;

    useEffect(() => {
      const token = Cookies.get("jwt");
      axios
        .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/relationships/getfriends`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((result) => {
          setData(result.data);

        })
        .catch((err) => {
          setError('Failed to fetch data from the server');
        })
        .finally(() => {
          setLoading(false);
        });
    }, []);


    try{
      hasFriends = (data.friendsList[0] != null);
    } catch(error) {
      hasFriends = null;
    }
    // hasFriends = (data.friendsList != null);
    if(hasFriends) {
      friendsDisplay = data.friendsList
        .slice(0, data.length)
        .map((data, index) => (<FriendProfileChip key={index} data={data}/>))
    } else {
      friendsDisplay = null;
    }
    console.log(hasFriends);
    console.log(data.friendsList);

      

    return(
        <div>
          <div className="LogoPostAndProfile">
              <div className="LogoText">
                Friends
              </div>
              
              <div onClick = {() => {navigate("/user") }} className="SquareButton1">
                Back
              </div>

            </div>

          <div className="FriendsMainContainer">

            {requestStatusAlert}

            <AddFriendArea setDisplayAlert={setDisplayAlert}/>
            <IncomingFriendsPopup/>
            
              <div className="FriendsItemsDisplayColumn">
                {/* {data.map((chip, index) => (<FriendProfileChip key={index} data={chip}/>))}  */}

                
                {/* {[data.friendsList]
                  .slice(0, data.length)
                  .map((data, index) => (<FriendProfileChip key={index} data={data}/>))} */}
                {friendsDisplay}


                {/* <div>
                  {data.friendsList}
                </div> */}
              </div>
          </div>
        </div>
    );
}

export default Friends;
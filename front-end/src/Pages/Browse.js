import React from "react";
import "./Browse.css";
import HeaderBrowseMap from "../Components/HeaderBrowseMap";
import UserPost from "../Components/UserPost"

const Browse = () => {
    return (
        <div>
        <HeaderBrowseMap/>
            <div className="Browse-items">
                {/* Posts will go here. They're flexed in a single column */}

                <UserPost/>
                <UserPost/>
                <UserPost/>
                
            </div>
        </div>
    );
}

export default Browse;
import React from "react";
import "./Browse.css";
import {useNavigate} from "react-router-dom"


const Browse = () => {
    const navigate = useNavigate(); 
    return (
        //Header Placeholder
        // <Header/>
        
        <main className="Browse">
            <div className = "user-header"> 
                <a href="#" className="back-link" onClick = {() => {navigate("/map") }}>Back</a> 
            </div>
            <h2>Browse</h2>
            <div className="Browse-items">
                {/* Posts will go here. They're flexed in a single column */}

                <div>
                    lorem ipsum post placeholder lorem ipsum post placeholder lorem ipsum post placeholder lorem ipsum post placeholder 
                </div>
                
            </div>
        </main>
    );
}

export default Browse;
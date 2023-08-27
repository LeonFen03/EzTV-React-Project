import React from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
function Actor() {
    const {id} = useParams();
    const Actors = useSelector((state) => state.profileSettings.profileIDs.actors);
    const Actor = Actors[id];
    return (<div>
        <div className="profile-container">
        <div className="header">
            <div className="header-content">
                
            </div>
            <div>
                <div className="img-container">
                    <img src={Actor.image} alt={Actor.name} />
                </div>
                <div>
                <h2>Name: {Actor.name}</h2>
                    <ul>
                        <li>Gender: {Actor.gender}</li>
                        <li>Birthday: {Actor.birthday}</li>
                        <li>{Actor.deathday}</li>
                    </ul>
                </div>
            </div>
               


        </div>

    </div>
    </div>)

}

export default Actor;
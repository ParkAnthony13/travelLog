import React, { useEffect, useState } from 'react';
import {navigate, Router, Link} from '@reach/router'


const CreateLog = props => {
    const {name,setName, lat,setLat, lng,setLng} = props;
    


    return (
        <div className="">
            <p>create content</p>
            <div>
                <form>
                    <p style={{display:'flex',flexDirection:"column"}}>
                        <label>Location Tag</label>
                        <input type="text" onChange={(e) => setName(e.target.value)} value={name}/>
                    </p>
                    <p style={{display:'flex',flexDirection:"column"}}>
                        <label>Lat</label>
                        <input type="number" onChange={(e) => setLat(e.target.value)} value={lat}/>
                    </p>
                    <p style={{display:'flex',flexDirection:"column"}}>
                        <label>Lng</label>
                        <input type="number" onChange={(e) => setLng(e.target.value)} value={lng}/>
                    </p>
                </form>
            </div>
        </div>
    )
}
export default CreateLog;
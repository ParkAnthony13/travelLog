import React, { useEffect, useState } from 'react';
import {navigate, Router, Link} from '@reach/router'

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";


import { formatRelative } from "date-fns";
import format from 'date-fns/format'

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

import Home from './Components/Home'
import CreateLog from './Components/CreateLog'

import './App.css';
import mapStyles from './mapStyles';









const libraries = ["places"];
const mapContainerStyle = {
    width: "65vw",
    height: "80vh"
};

const center = {
    lat: 10,
    lng: 0,
};
const options={
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
}









function App() {
    
    
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ["places"]
    })
    const [markers, setMarkers] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    
    useEffect( () => {
            markers.map((marks) => console.log("mark"));
        },[markers])

    const [name,setName] = useState("");
    const [lat,setLat] = useState("");
    const [lng,setLng] = useState("");
    const [travelDate,setTravelDate] = useState("");
    const [searchAddress,setSearchAddress] = useState("");


    const onMapClick = React.useCallback((event) => {
        setMarkers(current => [...current,
            {
                name: "Marker",
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                time: new Date(),
            },
        ]);
    }, []);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, [])


    const panTo = React.useCallback(({lat,lng}) => {
        mapRef.current.panTo({lat, lng});
        mapRef.current.setZoom(14);
    }, []);


    if (loadError) return "Error loading Maps"
    if (!isLoaded) return "Loading Maps";
    


    return (
        <div className="main">
            <div className="navbar">
                <div className="leftNav">
                    <h3 className="logo">Travel Log</h3>
                </div>
                <div className="rightNav">
                    <Link to="/" className="linkWhite">Home</Link>
                    <Link to="/account" className="linkWhite">Account</Link>
                </div>
            </div>
            <Router>
                <Home path="/home"/>
            </Router>
            <div className="content">
                <div className="contentLeft">
                    <h4>Add New Marker</h4>
                    <CreateLog 
                        name={name} setName={setName}
                        lng={lng} setLng={setLng}
                        lat={lat} setLat={setLat}

                    />
                    <h4>Locations traveled</h4>
                    {markers.map((marks) => <div>
                        <p>{marks.name}</p>
                        <p>{marks.lat}</p>
                        <p>{marks.lng}</p>
                        <button onClick={() => panTo({
                            lat:marks.lat,lng:marks.lng
                        })}>test btn</button>
                        <FocusRow panTo={panTo}/>
                    </div>)}
                    <div>
                        {
                            markers.map((marker) =>
                                <Marker 
                                    key={marker.time.toISOString()} 
                                    position={{ lat: marker.lat, lng: marker.lng }}
                                    icon={{
                                        url: '/mug.svg',
                                        scaledSize: new window.google.maps.Size(20,20),
                                        origin: new window.google.maps.Point(0,0),
                                        anchor: new window.google.maps.Point(10,10),
                                    }}
                                    onClick={() => {
                                        setSelected(marker);
                                    }}
                                />
                            )
                        }
                    </div>

                </div>
                <div className="contentRight">
                    <Search panTo={panTo} />
                    <Locate panTo={panTo} />
                    <GoogleMap 
                        id="map"
                        mapContainerStyle={mapContainerStyle}
                        zoom={2.3}
                        center={center}
                        options={options}
                        onClick={onMapClick}
                        onLoad={onMapLoad}
                    >
                        {
                            markers.map((marker) =>
                                <Marker 
                                    key={marker.time.toISOString()} 
                                    position={{ lat: marker.lat, lng: marker.lng }}
                                    icon={{
                                        url: '/mug.svg',
                                        scaledSize: new window.google.maps.Size(20,20),
                                        origin: new window.google.maps.Point(0,0),
                                        anchor: new window.google.maps.Point(10,10),
                                    }}
                                    onClick={() => {
                                        setSelected(marker);
                                    }}
                                />
                            )
                        }
                        {selected ? (
                        <InfoWindow position={{lat: selected.lat, lng: selected.lng}} onCloseClick={() =>{setSelected(null);}}>
                            <div>
                                <h3>{selected.name}</h3>
                                <p>Lat {parseFloat(selected.lat).toFixed(2)}</p>
                                <p>Long {parseFloat(selected.lng).toFixed(2)}</p>
                                <p>Date: {format(selected.time, 'yyyy MMM dd')}</p>
                            </div>
                        </InfoWindow>) : null}
                    </GoogleMap>
                </div>
            </div>
        </div>
    );
}

export default App;

function FocusRow({ panTo }) {
    return (
        <button onClick={(marker) => {
            panTo({
                lat: marker.lat,
                lng: marker.lng,
            })
        }}>
            focus
        </button>
    )
}
function Locate({ panTo }) {
    return (
        <button 
            className="compassBtn"
            onClick={() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        panTo({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        })
                        console.log(position);
                    },
                    () => null
                );
            }}
        >
            <img className="compassIcon" src="/23204-compass-svg.svg" alt="compass"/>
        </button>
    )
}


function Search({ panTo }) {
    const {
        ready,
        value,
        suggestions: {status, data},
        setValue,
        clearSuggestion
    } = usePlacesAutocomplete({
        requestOptions: {
            location: {lat: () => 43.65, lng: () => -79.38 },
            radius: 200 * 1000,
        },
    });
    return (
        <div className="search">
            <Combobox className="search2"
                onSelect={async (address) => {
                    try {
                        const results = await getGeocode({address});
                        const { lat, lng } = await getLatLng(results[0]);
                        panTo({ lat, lng });

                    } catch(error) {
                        console.log("error!")
                    }
                    
                    
                }}
                >
                <ComboboxInput className="search2" 
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    disabled={!ready}
                    placeholder="Enter an address"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" && data.map(({id,description}) => <ComboboxOption key={id} value={description}/>)}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    )
}
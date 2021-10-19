import React, { useEffect, useState } from 'react';
import {navigate, Router, Link} from '@reach/router'


const Search = props => {

    function Search() {
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
        return 
        <Combobox
            onSelect={(address) => {
                console.log(address);
            }}
        >
            <ComboboxInput 
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                disabled={!ready}
                placeholder="Enter an address"
            />
        </Combobox>
    }


    return (
        <div className="content">
            <p>home content</p>
            
        </div>
    )
}
export default Search;
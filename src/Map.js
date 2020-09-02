import React from 'react';
import './Map.css';
import {Map as LeaftletMap,TileLayer} from "react-leaflet";
import { showDataOnMap } from './util';

function Map({countries,casesType,center,zoom}) {
    return (
        <div className = "map">
            <LeaftletMap center = {center} zoom = {zoom}>
                <TileLayer
                url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution = '&copy; <a href = "http://osm.org/copyright">OpenStreet</a> contributors'
                />
                {/* Loop through and draw circles */}
                {showDataOnMap(countries,casesType)}
            </LeaftletMap>
        </div>
    );
}

export default Map;

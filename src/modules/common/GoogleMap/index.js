import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import GoogleMapTypesId from './utils/gmap-types';
import MapTypes from './utils/map-types';
import { GOOGLE_MAP_API_KEY } from '../../../env';
import styles from "./style.scss";

import { addService } from '../../../redux/actions/service';

const defaultOptions = {
    mapTypeId: GoogleMapTypesId.roadmap,
    zoom: 15
};
const libraries = ['visualization', 'places',];
const googleApiUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=${_.join(libraries, ',')}`;

const cx = classNames.bind(styles);

const compare = (a, b) => _.isEqual(_.omitBy(a, _.isFunction), _.omitBy(b, _.isFunction));

class Map extends Component {
    static defaultProps = {
        id: 'google_map',
        type: MapTypes.map,
        updateComponent: true,
    };

    constructor(props) {
        super(props);
        const { id, type, floatingButtons } = props;
        this.state = {
            id,
            type,
            floatingButtons: floatingButtons || false,
            infoPlace: true,
        };
        this.onScriptLoad = this.onScriptLoad.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.placesMap = this.placesMap.bind(this);
        this._setFloatingButtonsDefault = this._setFloatingButtonsDefault.bind(this);
        this._evalGoogleScript = this._evalGoogleScript.bind(this);
    }

    componentDidMount() {
        this._evalGoogleScript();
    }

	async componentDidUpdate(prevProps, prevState) {
        const { updateComponent } = this.props;
        if ((!compare(this.props, prevProps) || !compare(this.state, prevState) && updateComponent)) {
            this._evalGoogleScript();
        }
    }

    onScriptLoad() {
        const { getMarkers } = this.props;
        const nullFunc = () => null;
        const { id, type } = this.state;
        const options = this.getOptions();
        const map = new window.google.maps.Map(
            document.getElementById(id),
            options
        );

        switch (type) {
            case MapTypes.map:
                (getMarkers || nullFunc)(map);
                this._setFloatingButtonsDefault();
                break;
            case MapTypes.places:
                this.placesMap(map);
                break;
            default: {
                (getMarkers || nullFunc)(map)
            }
        }
    }

    getOptions() {
        const { options } = this.props;
        const merged = _.merge(defaultOptions, options);
        return merged;
    }

    _evalGoogleScript = () => {
        if (!window.google) {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = googleApiUrl;
            const x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
            s.addEventListener('load', () => {
                this.onScriptLoad()
            })
        } else {
            this.onScriptLoad()
        }
    };

    _setFloatingButtonsDefault = () => {
        const { floatingButtons } = this.props;
        const objToSet = { infoPlace: false };
        if (floatingButtons === null ||  floatingButtons === undefined) {
            // eslint-disable-next-line
            objToSet['floatingButtons'] = true;
        }

        this.setState(objToSet);
    };

    calculateRoute = (map, marker, autoComplete, type) => {
            const { addServiceAction } = this.props;
            const  directionsService = new window.google.maps.DirectionsService();
            const directionsDisplay = new window.google.maps.DirectionsRenderer();
            const distanceMAtrix =  new window.google.maps.DistanceMatrixService();

            marker.setVisible(false);
            const place = autoComplete[type].getPlace();

            if (!place.geometry) {
                return;
            }
            
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
            directionsDisplay.setMap(map);

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
            }

            const origin = autoComplete.origin.getPlace();
            const destination = autoComplete.destination.getPlace()

           
            if(origin && destination) {
                if(!_.isEmpty(origin.geometry) && !_.isEmpty(destination.geometry)){

                    const requestRoute = {
                        origin: origin.geometry.location,
                        destination: destination.geometry.location,
                        travelMode: 'DRIVING'
                      };
                      directionsService.route(requestRoute, (result, status) => {
                        if (status === 'OK') {
                          directionsDisplay.setDirections(result);
                        }
                    });
                    /* eslint-disable*/
                    distanceMAtrix.getDistanceMatrix(
                        {
                            origins: [origin.geometry.location],
                            destinations: [destination.geometry.location],
                            travelMode: 'DRIVING',
                            unitSystem: window.google.maps.UnitSystem.IMPERIAL, // miles and feet.
                            avoidHighways: false,
                            avoidTolls: false
                    },(response, status) => {

                    if (status === 'OK') {
                    const distance = response.rows[0].elements[0].distance;
                    const duration = response.rows[0].elements[0].duration;
                    
                    const distanceInKilo = distance.value / 1000; // the kilom
                    const distanceInMile = distance.value / 1609.34; // the mile
                    const durationText = duration.text;
                    const durationValue = duration.value;

                    const service = {
                        origin: origin.formatted_address,
                        destination: destination.formatted_address,
                        distanceInKilo,
                        distanceInMile,
                        durationText,
                        durationValue
                    }
                    addServiceAction(service);
                    }
                    })
                }
            }
        
    }
    

    async placesMap(map) {
        const { origin, destination, onDragEnd } = this.props;

        // autocomplete origin
        const originElement = document.getElementById(origin);
        const autocompleteOrigin = new window.google.maps.places.Autocomplete(originElement);
        autocompleteOrigin.bindTo('bounds', map);

        // autocomplete destination 
        const destinationElement = document.getElementById(destination);
        const autocompleteDestination = new window.google.maps.places.Autocomplete(destinationElement);
        autocompleteDestination.bindTo('bounds', map);

        const markerOrigin = new window.google.maps.Marker({
          map: map,
          anchorPoint: new window.google.maps.Point(0, -29),
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        });

        const markerDestination = new window.google.maps.Marker({
            map: map,
            anchorPoint: new window.google.maps.Point(0, -29),
            draggable: true,
            animation: window.google.maps.Animation.DROP,
        });

        if (onDragEnd && _.isFunction(onDragEnd)) {
            markerOrigin.addListener('dragend', (event) => {
                onDragEnd(event);
            });
        }

        const autoCompleteInputs = {
            origin: autocompleteOrigin,
            destination: autocompleteDestination
        }

        autocompleteOrigin.addListener('place_changed', () => {
            this.calculateRoute(map, markerOrigin, autoCompleteInputs, 'origin')
        }); 

        autocompleteDestination.addListener('place_changed',  () => {
            this.calculateRoute(map, markerDestination, autoCompleteInputs, 'destination')
        }); 

      }


    async changeMap(type) {
        const { onChangeMap } = this.props;
        const newType = MapTypes[type] || MapTypes.map;
        await this.setState({
            type: newType
        });
        if (onChangeMap && _.isFunction(onChangeMap)) {
            onChangeMap(newType);
        }
    }

    render() {
        const { id, type, floatingButtons, infoPlace } = this.state;
        return (
            <div className={cx("box-map-and-content-container")} >
                { floatingButtons && (
                    <div className={cx("floating-panel")}>
                        <Button 
                            color="primary"
                            className={cx("floating-panel-button", {'text-bold': type === MapTypes.map})}
                            onClick={() => this.changeMap('map')}>
                            Markers
                        </Button>
                        <Button 
                            color="primary"
                            className={cx("floating-panel-button", {'text-bold': type === MapTypes.heatmap})}
                            onClick={() => this.changeMap('heatmap')}>
                            Heatmap
                        </Button>
                    </div>
                )}

                <div className={cx("box-map-container")} id={id} />

                { infoPlace && (
                    <div id="infowindow-content">
                        <img src="" width="16" height="16" id="place-icon" alt=""/>
                        <span id="place-name">{}</span><br/>
                        <span id="place-address">{}</span>
                    </div>
                )}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    addServiceAction: service => dispatch(addService(service))
})

export default connect(null, mapDispatchToProps)(Map)
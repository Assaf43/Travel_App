import React from "react";
import GoogleMapReact from "google-map-react";
import { Paper, Typography, useMediaQuery } from "@material-ui/core";
import useStyle from "./styles";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import Rating from "@material-ui/lab/Rating";
import mapStyles from "./mapStyles";

function Map({
  setCoords,
  setBounds,
  coords,
  places,
  setChildClick,
  weatherData,
}) {
  const classes = useStyle();
  const matches = useMediaQuery("(min-width:600px)");

  const WeatherMarker = ({ icon }) => (
    <div>
      <img src={`http://openweathermap.org/img/w/${icon}.png`} />
    </div>
  );

  const Marker = ({ place }) => (
    <div className={classes.markerContainer}>
      {!matches ? (
        <LocationOnOutlinedIcon color="primary" fontSize="large" />
      ) : (
        <Paper elevation={3} className={classes.paper}>
          <Typography
            className={classes.typography}
            variant="subtitle2"
            gutterBottom
          >
            {" "}
            {place.name}
          </Typography>
          <img
            className={classes.pointer}
            src={
              place.photo
                ? place.photo.images.large.url
                : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
            }
          />
          <Rating
            name="read-only"
            size="small"
            value={Number(place.rating)}
            readOnly
          />
        </Paper>
      )}
    </div>
  );

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={coords}
        center={coords}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
        onChange={(e) => {
          setCoords({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
        onChildClick={(child) => setChildClick(child)}
      >
        {places?.map((place, index) => (
          <Marker
            lat={place.latitude}
            lng={place.longitude}
            key={index}
            place={place}
          />
        ))}
        {weatherData?.list?.map((data, index) => (
          <WeatherMarker
            icon={data.weather[0].icon}
            lat={data.coords.lat}
            lng={data.coords.lon}
            data={data}
            key={index}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
}

export default Map;

import React, { useEffect, useState } from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import Header from "./components/header/header";
import List from "./components/list/list";
import Map from "./components/map/map";
import { getPlacesData, getWeatherData } from "./api/services";

function App() {
  const [places, setPlaces] = useState([]);
  const [coord, setCoords] = useState({});
  const [bounds, setBounds] = useState(null);
  const [childClick, setChildClick] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState("");
  const [type, setType] = useState("restaurants");
  const [filterdPlaces, setfilterdPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        // console.log(`latitude: ${latitude} longitude: ${longitude}`);
        setCoords({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    const filterd = places?.filter((place) => place.rating >= rating);
    setfilterdPlaces(filterd);
  }, [rating]);

  useEffect(() => {
    if (bounds) {
      setIsLoading(true);

      // getWeatherData(coord.lat, coord.lng).then((data) => {
      //   console.log({ data });
      //   setWeatherData(data);
      // });

      getPlacesData(type, bounds.ne, bounds.sw).then((data) => {
        if (data) {
          setPlaces(
            data?.filter((place) => place.name && place.num_reviews > 0)
          );
          setfilterdPlaces([]);
          setIsLoading(false);
        }
      });
    }
  }, [bounds, type]);

  return (
    <>
      <CssBaseline />
      <Header setCoords={setCoords} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filterdPlaces.length ? filterdPlaces : places}
            childClick={childClick}
            isLoading={isLoading}
            rating={rating}
            setRating={setRating}
            type={type}
            setType={setType}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          {/* <SimpleMap /> */}
          <Map
            setCoords={setCoords}
            setBounds={setBounds}
            coords={coord}
            places={filterdPlaces.length ? filterdPlaces : places}
            setChildClick={setChildClick}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;

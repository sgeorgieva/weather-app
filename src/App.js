import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import CardsPage from './pages/CardsPage';
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap';

function App() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [units, setUnits] = useState('');
  const [city, setCity] = useState('');
  const apiKey = '2995a39d42b94229d1f93c8597318afc';
  const googleApiKey = 'AIzaSyBeQmefJp_NJ2Xi2GeHVMwfOfVAPS75Xc8'

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => {
    setDropdownOpen(!dropdownOpen)
    navigate('/');
  };

  let cloneData = [{ ...data }];

  useEffect(() => {
    getLocation();
  }, [])

  useEffect(() => {
    if (latitude !== '' && longitude !== '') {
      showCity(latitude, longitude);
      getWeather(latitude, longitude, units);
    }
  }, [latitude, longitude])

  const getWeather = (lat, lon, units) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current&units=${units}&lang{bg}&appid=${apiKey}`

    return fetch(url)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
      })
  }

  const showCity = (lat, lon) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleApiKey}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCity(data.results[0].address_components.find((component) =>
          component.types.includes("locality")
        ).long_name);
      })
      .catch((error) => console.log(error));
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success);
    } else {
      alert('Your browser doesn\'t support the geolocation api.');
    }
  }

  const success = (position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  }

  const changeMetrics = (e, units) => {
    e.preventDefault();
    e.stopPropagation();
    setUnits(units);
    getWeather(latitude, longitude, units);
  }

  return (
    <div className="App">
      <div className="d-flex align-items-center justify-content-center mb-5">
        <h1 className="title me-3">Weather - {city}</h1>
        <Dropdown isOpen={dropdownOpen} toggle={() => toggle()}>
          <DropdownToggle nav caret>
            Preferences
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={(e) => changeMetrics(e, '')}>Kelvin</DropdownItem>
            <DropdownItem onClick={(e) => changeMetrics(e, 'metric')}>Celsius</DropdownItem>
            <DropdownItem onClick={(e) => changeMetrics(e, 'imperial')}>Fahrenheit</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      {!dropdownOpen &&
        <div className="cards">
          {cloneData[0]?.daily?.slice(0, 5)?.map((filteredItem, i) => (
            <CardsPage key={i} daily={filteredItem} itemNumber={i} units={units} data={data} />
          ))}
        </div>
      }
    </div>
  );
}

export default App;

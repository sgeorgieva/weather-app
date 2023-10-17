import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardBody, CardSubtitle, CardText, CardTitle, Toast, ToastHeader, ToastBody } from 'reactstrap';
import WeatherDateByHoursPage from '../WeatherDateByHoursPage';
import { metrics } from '../../constants';
import './cardsPage.scss';

const CardsPage = (props) => {
  const { daily, itemNumber, units, data } = props;
  const navigate = useNavigate();
  const currentPath = useLocation();
  const [hourlyData, setHourlyData] = useState([]);
  const [choosedDay, setChoosedDay] = useState('');

  useEffect(() => {
    if (currentPath.pathname === '/') {
      setChoosedDay('');
      setHourlyData([]);
    }
  }, [currentPath.pathname])

  const timestamp = daily.dt;
  const date = new Date(timestamp * 1000);
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();

  let hourlyItems = Object.values(data.hourly);

  const handleClick = (e) => {
    e.currentTarget.getAttribute("data-title") && setChoosedDay(e.currentTarget.getAttribute("data-title"));
    test(e.currentTarget.getAttribute("data-title"));
    navigate('/weather-date-by-hours');
  };

  function getDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }

  let foodNames = [];

  const test = (day) => {
    foodNames = hourlyItems.filter((item) => getDayName(new Date(item.dt * 1000), "en-GB") === day);
    setHourlyData(...hourlyData, foodNames);
  };

  return (
    <div key={itemNumber}>
      {currentPath.pathname === '/' ?
        <Card onClick={(e) => handleClick(e)} data-title={day}>
          <CardBody>
            <CardTitle tag="h5">
              <p>{day}</p>
              <span className="fs-6" data-date={formattedDate}>{formattedDate}</span>
            </CardTitle>
            <img alt="weather-icon" src={`https://openweathermap.org/img/wn/${daily?.weather[0]?.icon}@2x.png`} />
            <CardSubtitle
              className="mb-2 text-muted"
              tag="h6"
            >
              <span>Min | Max</span>
              <p className="mt-1">{Math.round(daily?.temp?.min)}{metrics[units]} | {Math.round(daily?.temp?.max)}{metrics[units]}</p>
            </CardSubtitle>
            <CardText>
              {daily?.weather[0]?.description}
            </CardText>
          </CardBody>
        </Card>
        :
        <>
          {choosedDay &&
            <>
              <div className="title-by-hours">
                <h6>{choosedDay}</h6>
                <h6>{formattedDate}</h6>
              </div>
              {hourlyData && hourlyData.length === 0 &&
                <div className="d-flex mt-5">
                  <div className="p-3 my-2 rounded bg-docs-transparent-grid">
                    <Toast>
                      <ToastHeader>Warning</ToastHeader>
                      <ToastBody>Sorry, there is no weather information for this day</ToastBody>
                    </Toast>
                  </div>
                </div>
              }
            </>
          }
          {hourlyData && hourlyData.length > 0 ? <div className="d-flex mt-5">
            <WeatherDateByHoursPage hourlyData={hourlyData} units={units} />
          </div> : null}
        </>
      }
    </div>
  )
}

export default CardsPage;
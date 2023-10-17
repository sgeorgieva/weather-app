import { Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import './weatherDateByHours.scss'
import { metrics } from '../../constants';

const WeatherDateByHoursPage = (props) => {
  const { hourlyData, units } = props;

  const timeTitle = (timestamp) => {
    const date2 = (new Date(timestamp * 1000).toLocaleTimeString("en-GB", { timeZone: 'Europe/Sofia', hour: '2-digit', minute: '2-digit' }));
    return date2;
  }

  return (
    <div className="d-flex flex-wrap mx-auto cards-wrapper">
      {hourlyData && hourlyData?.length > 0 && hourlyData?.map((item, i) => {
        return (
          <Card key={i}>
            <CardBody>
              <CardTitle tag="h5">{timeTitle(item?.dt)}</CardTitle>
              <img alt="weather-icon" src={`https://openweathermap.org/img/wn/${item?.weather[0]?.icon}@2x.png`} />
              <CardSubtitle
                className="mb-2 text-muted"
                tag="h6"
              >
                <span>Temperature | Feels like</span>
                <p className="mt-1">{Math.round(item?.temp)}{metrics[units]} | {Math.round(item?.feels_like)}{metrics[units]} </p>
              </CardSubtitle>
              <CardText>
                {item?.weather[0]?.description}
              </CardText>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}

export default WeatherDateByHoursPage;
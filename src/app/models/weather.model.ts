//defining a shape (structure) of an object WeatherData
//kinda like models in Mongoose
export interface WeatherData {
  name: string;
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  visibility: number;
}

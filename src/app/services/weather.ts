import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

//defining a shape (structure) of an object WeatherData
//kinda like models in Mongoose
export interface WeatherData {
  name: string;
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
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
  };
}

@Injectable({
  providedIn: 'root',
})
//making a class called Weather
export class Weather {
  //creating a variable called http which cannot be updated (read only property)
  //inject method tells angular to use httpclient package for http requests
  private readonly http = inject(HttpClient);
  private readonly apiKey = environment.weatherApiKey;
  private readonly apiUrl = environment.weatherApiUrl;

  //a function that returns a stream of weather data
  //fetches the weather data as per given shape from the specified url and query
  getWeather(city: string): Observable<WeatherData> {
    const params = {
      q: city,
      appid: this.apiKey,
      units: 'metric',
    };
    return this.http.get<WeatherData>(this.apiUrl, { params });
  }
}

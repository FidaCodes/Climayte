import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WeatherData } from '../models/weather.model';

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

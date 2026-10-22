import { Component, computed, inject, Query, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Weather, WeatherData } from './services/weather';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly weatherService = inject(Weather);

  readonly city = signal('');
  readonly weather = signal<WeatherData | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly isDay = computed(() => {
    const data = this.weather();
    if (!data) return true;
    return data.dt >= data.sys.sunrise && data.dt <= data.sys.sunset;
  });

  //converting wind to kmh from m/s (meters per second)
  readonly windKmh = computed(() => {
    const data = this.weather();
    if (!data) return 0;
    return Math.round(data.wind.speed * 3.6 * 10) / 10;
  });

  //search function that fetches the weather result of a city entered by users
  search(): void {
    const query = this.city().trim();
    if (!query) {
      this.errorMessage.set('Please type a city name first!');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');

    this.weatherService.getWeather(query).subscribe({
      next: (data) => {
        this.weather.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.weather.set(null);
        this.loading.set(false);
        this.errorMessage.set('City not found. Try names like Paris,FR');
      },
    });
  }
}

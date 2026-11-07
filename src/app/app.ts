import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  LucideCloudSun,
  LucideDroplet,
  LucideEye,
  LucideGauge,
  LucideMapPin,
  LucideSearch,
  LucideWind,
} from '@lucide/angular';
import { Weather } from './services/weather';
import type { WeatherData } from './models/weather.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    DecimalPipe,
    LucideCloudSun,
    LucideDroplet,
    LucideEye,
    LucideGauge,
    LucideMapPin,
    LucideSearch,
    LucideWind,
  ],
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

  countryName(countryCode: string): string {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) ?? countryCode;
  }

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
      error: (error: HttpErrorResponse) => {
        this.weather.set(null);
        this.loading.set(false);
        this.errorMessage.set(
          error.status === 404
            ? 'City not found. Check the spelling and try again.'
            : error.status === 0
              ? 'Could not connect. Check your internet connection and try again.'
              : 'Weather could not be loaded. Please try again later.',
        );
      },
    });
  }
}

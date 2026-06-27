import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, forkJoin } from 'rxjs';
import { Car } from '../models/car.model';
import { API_ENDPOINTS, CARS_PER_PAGE } from '../constants/api.constants';

interface CarsPage {
  cars: Car[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class GarageService {
  private readonly http = inject(HttpClient);

  getCars(page: number): Observable<CarsPage> {
    const params = { _page: page, _limit: CARS_PER_PAGE };
    return this.http
      .get<Car[]>(API_ENDPOINTS.garage, { params, observe: 'response' })
      .pipe(map((res) => GarageService.toCarsPage(res)));
  }

  private static toCarsPage(res: HttpResponse<Car[]>): CarsPage {
    const total = Number(res.headers.get('X-Total-Count')) || 0;
    return { cars: res.body ?? [], total };
  }

  createCar(car: Omit<Car, 'id'>): Observable<Car> {
    return this.http.post<Car>(API_ENDPOINTS.garage, car);
  }

  updateCar(id: number, car: Omit<Car, 'id'>): Observable<Car> {
    return this.http.put<Car>(`${API_ENDPOINTS.garage}/${id}`, car);
  }

  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.garage}/${id}`);
  }

  createCars(cars: Omit<Car, 'id'>[]): Observable<Car[]> {
    const requests = cars.map((car) => this.createCar(car));
    return forkJoin(requests);
  }

  getCar(id: number): Observable<Car> {
    return this.http.get<Car>(`${API_ENDPOINTS.garage}/${id}`);
  }
}

import { computed, inject, Injectable, signal } from '@angular/core';
import { Car } from '../../core/models/car.model';
import { GarageService } from '../../core/services/garage.service';
import { CARS_PER_PAGE } from '../../core/constants/api.constants';

@Injectable({ providedIn: 'root' })
export class GarageStore {
  private readonly garageService = inject(GarageService);

  readonly cars = signal<Car[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);

  readonly totalPages = computed(() => Math.ceil(this.total() / CARS_PER_PAGE));

  loadCars(): void {
    this.garageService.getCars(this.page()).subscribe((res) => {
      this.cars.set(res.cars);
      this.total.set(res.total);
    });
  }

  setPage(page: number): void {
    this.page.set(page);
    this.loadCars();
  }

  createCar(name: string, color: string): void {
    this.garageService.createCar({ name, color }).subscribe(() => this.loadCars());
  }

  updateCar(id: number, name: string, color: string): void {
    this.garageService.updateCar(id, { name, color }).subscribe(() => this.loadCars());
  }

  deleteCar(id: number): void {
    this.garageService.deleteCar(id).subscribe(() => this.loadCars());
  }
}
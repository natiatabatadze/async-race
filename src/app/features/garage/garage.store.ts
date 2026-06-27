import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Car } from '../../core/models/car.model';
import { GarageService } from '../../core/services/garage.service';
import { CARS_PER_PAGE } from '../../core/constants/api.constants';
import { randomCarName, randomColor } from '../../core/utils/random.util';
import { RANDOM_CARS_COUNT } from '../../core/constants/car-names.constants';
import { WinnersService } from '../../core/services/winners.service';
import { DEFAULT_CAR_COLOR } from '../../core/constants/validation.constants';

@Injectable({ providedIn: 'root' })
export class GarageStore {
  private readonly garageService = inject(GarageService);

  private readonly winnersService = inject(WinnersService);

  readonly cars = signal<Car[]>([]);

  readonly total = signal(0);

  readonly page = signal(1);

  readonly totalPages = computed(() => Math.ceil(this.total() / CARS_PER_PAGE));

  readonly formName = signal('');

  readonly formColor = signal(DEFAULT_CAR_COLOR);

  readonly editingId = signal<number | null>(null);

  readonly loading = signal(false);

  loadCars(): void {
    this.loading.set(true);
    this.garageService.getCars(this.page()).subscribe({
      next: (res) => {
        this.cars.set(res.cars);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  resetForm(): void {
    this.formName.set('');
    this.formColor.set(DEFAULT_CAR_COLOR);
    this.editingId.set(null);
  }

  setPage(page: number): void {
    this.page.set(page);
    this.loadCars();
  }

  nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.setPage(this.page() + 1);
    }
  }

  prevPage(): void {
    if (this.page() > 1) {
      this.setPage(this.page() - 1);
    }
  }

  createCar(name: string, color: string): void {
    this.garageService.createCar({ name, color }).subscribe(() => this.loadCars());
  }

  updateCar(id: number, name: string, color: string): void {
    this.garageService.updateCar(id, { name, color }).subscribe(() => this.loadCars());
  }

  private reloadAfterDelete(): void {
    const isLastOnPage = this.cars().length === 1;
    const isNotFirstPage = this.page() > 1;
    if (isLastOnPage && isNotFirstPage) {
      this.page.set(this.page() - 1);
    }
    this.loadCars();
  }

  generateRandomCars(): void {
    const cars = Array.from({ length: RANDOM_CARS_COUNT }, () => ({
      name: randomCarName(),
      color: randomColor(),
    }));
    this.garageService.createCars(cars).subscribe(() => this.loadCars());
  }

  deleteCar(id: number): void {
    this.garageService.deleteCar(id).subscribe(() => {
      this.winnersService
        .deleteWinner(id)
        .pipe(catchError(() => of(undefined)))
        .subscribe();
      this.reloadAfterDelete();
    });
  }
}

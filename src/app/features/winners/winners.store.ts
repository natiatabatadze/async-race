import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Car, Winner } from '../../core/models/car.model';
import { WinnersService, SortField, SortOrder } from '../../core/services/winners.service';
import { GarageService } from '../../core/services/garage.service';
import { WINNERS_PER_PAGE } from '../../core/constants/api.constants';

export interface WinnerRow extends Winner {
  car: Car;
}

@Injectable({ providedIn: 'root' })
export class WinnersStore {
  private readonly winnersService = inject(WinnersService);
  private readonly garageService = inject(GarageService);

  readonly rows = signal<WinnerRow[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly sort = signal<SortField>('time');
  readonly order = signal<SortOrder>('ASC');

  readonly totalPages = computed(() => Math.ceil(this.total() / WINNERS_PER_PAGE));

  loadWinners(): void {
    this.winnersService
      .getWinners(this.page(), this.sort(), this.order())
      .subscribe((res) => {
        this.total.set(res.total);
        this.attachCars(res.winners);
      });
  }

  private attachCars(winners: Winner[]): void {
    if (winners.length === 0) {
      this.rows.set([]);
      return;
    }
    const requests = winners.map((w) => this.garageService.getCar(w.id));
    forkJoin(requests).subscribe((cars) => {
      this.rows.set(winners.map((w, i) => ({ ...w, car: cars[i] })));
    });
  }

  setPage(page: number): void {
    this.page.set(page);
    this.loadWinners();
  }

  setSort(field: SortField): void {
    if (this.sort() === field) {
      this.order.set(this.order() === 'ASC' ? 'DESC' : 'ASC');
    } else {
      this.sort.set(field);
      this.order.set('ASC');
    }
    this.loadWinners();
  }
}
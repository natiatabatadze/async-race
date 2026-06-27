import { Component, inject, OnInit } from '@angular/core';
import { WinnersStore } from './winners.store';
import { SortField } from '../../core/services/winners.service';
import { WINNERS_PER_PAGE } from '../../core/constants/api.constants';
import { CarIconComponent } from '../../shared/components/car-icon/car-icon.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-winners',
  standalone: true,
  templateUrl: './winners.component.html',
  styleUrl: './winners.component.scss',
  imports: [CarIconComponent, SpinnerComponent],
})
export class WinnersComponent implements OnInit {
  readonly store = inject(WinnersStore);

  ngOnInit(): void {
    this.store.loadWinners();
  }

  rowNumber(index: number): number {
    return (this.store.page() - 1) * WINNERS_PER_PAGE + index + 1;
  }

  sortArrow(field: SortField): string {
    if (this.store.sort() !== field) return '';
    return this.store.order() === 'ASC' ? '▲' : '▼';
  }
}

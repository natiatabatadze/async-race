import { Component, inject, OnInit } from '@angular/core';
import { WinnersStore } from './winners.store';
import { SortField } from '../../core/services/winners.service';
import { WINNERS_PER_PAGE } from '../../core/constants/api.constants';

@Component({
  selector: 'app-winners',
  standalone: true,
  templateUrl: './winners.component.html',
  styleUrl: './winners.component.scss',
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
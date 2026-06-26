import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GarageStore } from './garage.store';
import { Car } from '../../core/models/car.model';
import {
  CAR_NAME_MAX_LENGTH,
  DEFAULT_CAR_COLOR,
} from '../../core/constants/validation.constants';
import { RaceStore } from './race.store';

@Component({
  selector: 'app-garage',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './garage.component.html',
  styleUrl: './garage.component.scss',
})
export class GarageComponent implements OnInit {
  readonly store = inject(GarageStore);
  readonly raceStore = inject(RaceStore);
  readonly maxLength = CAR_NAME_MAX_LENGTH;

  name = '';
  color = DEFAULT_CAR_COLOR;
  readonly editingId = signal<number | null>(null);

  ngOnInit(): void {
    this.store.loadCars();
  }

  isValid(): boolean {
    return this.name.trim().length > 0;
  }

  onSubmit(): void {
    const id = this.editingId();
    if (id === null) {
      this.store.createCar(this.name.trim(), this.color);
    } else {
      this.store.updateCar(id, this.name.trim(), this.color);
    }
    this.resetForm();
  }

  onEdit(car: Car): void {
    this.name = car.name;
    this.color = car.color;
    this.editingId.set(car.id);
  }

  private resetForm(): void {
    this.name = '';
    this.color = DEFAULT_CAR_COLOR;
    this.editingId.set(null);
  }

  onStartRace(): void {
    this.raceStore.startRace(this.store.cars());   // ids-ის ნაცვლად მთელი მანქანები
  }

  onResetRace(): void {
    const ids = this.store.cars().map((car) => car.id);
    this.raceStore.resetRace(ids);
  }
}
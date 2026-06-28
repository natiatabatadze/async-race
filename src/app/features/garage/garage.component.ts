import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GarageStore } from './garage.store';
import { Car } from '../../core/models/car.model';
import { CAR_NAME_MAX_LENGTH, DEFAULT_CAR_COLOR } from '../../core/constants/validation.constants';
import { RaceStore } from './race.store';
import { CarIconComponent } from '../../shared/components/car-icon/car-icon.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-garage',
  standalone: true,
  imports: [FormsModule, CarIconComponent, SpinnerComponent],
  templateUrl: './garage.component.html',
  styleUrl: './garage.component.scss',
})
export class GarageComponent implements OnInit {
  readonly store = inject(GarageStore);

  readonly raceStore = inject(RaceStore);

  readonly maxLength = CAR_NAME_MAX_LENGTH;

  readonly createName = signal('');

  readonly createColor = signal(DEFAULT_CAR_COLOR);

  ngOnInit(): void {
    this.store.loadCars();
  }

  isCreateValid(): boolean {
    return this.createName().trim().length > 0;
  }

  isUpdateValid(): boolean {
    return this.store.formName().trim().length > 0;
  }

  onCreate(): void {
    this.store.createCar(this.createName().trim(), this.createColor());
    this.createName.set('');
    this.createColor.set(DEFAULT_CAR_COLOR);
  }

  onUpdate(): void {
    const id = this.store.editingId();
    if (id === null) return;
    this.store.updateCar(id, this.store.formName().trim(), this.store.formColor());
    this.store.resetForm();
  }

  onEdit(car: Car): void {
    this.store.formName.set(car.name);
    this.store.formColor.set(car.color);
    this.store.editingId.set(car.id);
  }

  onStartRace(): void {
    this.raceStore.startRace(this.store.cars());
  }

  onResetRace(): void {
    const ids = this.store.cars().map((car) => car.id);
    this.raceStore.resetRace(ids);
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { EngineService } from '../../core/services/engine.service';
import { CarRaceState } from '../../core/models/car.model';
import { Car } from '../../core/models/car.model';

const FINISH_POSITION = 90;
const START_POSITION = 0;
const PERCENT = 100;

@Injectable({ providedIn: 'root' })
export class RaceStore {
  private readonly engineService = inject(EngineService);
  readonly states = signal<Map<number, CarRaceState>>(new Map());

  private readonly startTimes = new Map<number, number>();

  startEngine(id: number): void {
    this.engineService.toggleEngine(id, 'started').subscribe((res) => {
      const duration = res.distance / res.velocity;
      this.startTimes.set(id, performance.now());
      this.setState(id, { status: 'driving', position: FINISH_POSITION, duration });
      this.runDrive(id);
    });
  }

  stopEngine(id: number): void {
    this.engineService.toggleEngine(id, 'stopped').subscribe(() => {
      this.startTimes.delete(id);
      this.setState(id, { status: 'idle', position: START_POSITION, duration: 0 });
    });
  }

  private runDrive(id: number): void {
    this.engineService.drive(id).subscribe({
      error: () => this.breakCar(id),
    });
  }

  private breakCar(id: number): void {
    const current = this.states().get(id);
    const startTime = this.startTimes.get(id);
    if (!current || startTime === undefined) return;

    const elapsed = performance.now() - startTime;
    const ratio = Math.min(elapsed / current.duration, 1);
    const frozenPosition = ratio * PERCENT;

    this.setState(id, {
      status: 'broken',
      position: frozenPosition,
      duration: 0,
    });
  }

  private setState(id: number, state: CarRaceState): void {
    const next = new Map(this.states());
    next.set(id, state);
    this.states.set(next);
  }

  getState(id: number): CarRaceState {
    return this.states().get(id) ?? { status: 'idle', position: START_POSITION, duration: 0 };
  }

  readonly winner = signal<{ car: Car; time: number } | null>(null);
  private raceActive = false;

  startRace(cars: Car[]): void {
    this.raceActive = true;
    this.winner.set(null);
    cars.forEach((car) => this.startEngineForRace(car));
  }

  resetRace(ids: number[]): void {
    this.raceActive = false;
    this.winner.set(null);
    ids.forEach((id) => this.stopEngine(id));
  }

  private startEngineForRace(car: Car): void {
    this.engineService.toggleEngine(car.id, 'started').subscribe((res) => {
      const duration = res.distance / res.velocity;
      this.startTimes.set(car.id, performance.now());
      this.setState(car.id, { status: 'driving', position: FINISH_POSITION, duration });
      this.driveForRace(car, duration);
    });
  }

  private driveForRace(car: Car, duration: number): void {
    this.engineService.drive(car.id).subscribe({
      next: () => this.finish(car, duration),
      error: () => this.breakCar(car.id),
    });
  }

  private finish(car: Car, duration: number): void {
    if (!this.raceActive || this.winner()) return;
    this.raceActive = false;
    const seconds = Number((duration / 1000).toFixed(2));
    this.winner.set({ car, time: seconds });
  }
}
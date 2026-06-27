import { inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, forkJoin } from 'rxjs';
import { EngineService } from '../../core/services/engine.service';
import { CarRaceState, Car, EngineResponse } from '../../core/models/car.model';
import { WinnersService } from '../../core/services/winners.service';

const FINISH_POSITION = 90;
const START_POSITION = 0;
const PERCENT = 100;

@Injectable({ providedIn: 'root' })
export class RaceStore {
  private readonly engineService = inject(EngineService);

  readonly states = signal<Map<number, CarRaceState>>(new Map());

  private readonly startTimes = new Map<number, number>();

  private readonly winnersService = inject(WinnersService);

  readonly winner = signal<{ car: Car; time: number } | null>(null);

  private raceActive = false;

  readonly isRacing = signal(false);

  readonly preparing = signal(false);

  private launchCar(car: Car, res: EngineResponse): void {
    const duration = res.distance / res.velocity;
    this.startTimes.set(car.id, performance.now());
    this.setState(car.id, { status: 'driving', position: FINISH_POSITION, duration });
    this.driveForRace(car, duration);
  }

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

  startRace(cars: Car[]): void {
    this.resetStates(cars.map((car) => car.id));
    this.preparing.set(true);
    this.isRacing.set(true);
    this.raceActive = true;
    this.winner.set(null);

    const requests = cars.map((car) => this.engineService.toggleEngine(car.id, 'started'));

    forkJoin(requests).subscribe({
      next: (responses) => {
        this.preparing.set(false);
        responses.forEach((res, i) => this.launchCar(cars[i], res));
      },
      error: () => {
        this.preparing.set(false);
        this.isRacing.set(false);
      },
    });
  }

  private resetStates(ids: number[]): void {
    ids.forEach((id) => {
      this.startTimes.delete(id);
      this.setState(id, { status: 'idle', position: 0, duration: 0 });
    });
  }

  dismissWinner(): void {
    this.winner.set(null);
  }

  resetRace(ids: number[]): void {
    this.isRacing.set(false);
    this.raceActive = false;
    this.winner.set(null);
    this.resetStates(ids);
    ids.forEach((id) => this.stopEngineSilently(id));
  }

  private stopEngineSilently(id: number): void {
    this.engineService
      .toggleEngine(id, 'stopped')
      .pipe(catchError(() => EMPTY))
      .subscribe();
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
    this.isRacing.set(false);

    const current = this.states().get(car.id);
    if (current) {
      this.setState(car.id, { ...current, status: 'finished', duration: 0 });
    }

    const seconds = Number((duration / 1000).toFixed(2));
    this.winner.set({ car, time: seconds });
    this.winnersService.saveWinner(car.id, seconds).subscribe();
  }
}

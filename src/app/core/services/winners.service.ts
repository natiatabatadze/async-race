import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Winner } from '../models/car.model';
import { API_ENDPOINTS, WINNERS_PER_PAGE } from '../constants/api.constants';

export type SortField = 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

export interface WinnersPage {
  winners: Winner[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class WinnersService {
  private readonly http = inject(HttpClient);

  getWinners(page: number, sort: SortField, order: SortOrder): Observable<WinnersPage> {
    const params = {
      _page: page,
      _limit: WINNERS_PER_PAGE,
      _sort: sort,
      _order: order,
    };
    return this.http
      .get<Winner[]>(API_ENDPOINTS.winners, { params, observe: 'response' })
      .pipe(map((res) => WinnersService.toWinnersPage(res)));
  }

  getWinner(id: number): Observable<Winner> {
    return this.http.get<Winner>(`${API_ENDPOINTS.winners}/${id}`);
  }

  createWinner(winner: Winner): Observable<Winner> {
    return this.http.post<Winner>(API_ENDPOINTS.winners, winner);
  }

  updateWinner(id: number, wins: number, time: number): Observable<Winner> {
    return this.http.put<Winner>(`${API_ENDPOINTS.winners}/${id}`, { wins, time });
  }

  deleteWinner(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.winners}/${id}`);
  }

  private static toWinnersPage(res: HttpResponse<Winner[]>): WinnersPage {
    const total = Number(res.headers.get('X-Total-Count')) || 0;
    return { winners: res.body ?? [], total };
  }

  saveWinner(id: number, time: number): Observable<Winner> {
    return this.getWinner(id).pipe(
      catchError(() => of(null)),
      switchMap((existing) => this.upsertWinner(id, time, existing)),
    );
  }

  private upsertWinner(id: number, time: number, existing: Winner | null): Observable<Winner> {
    if (!existing) {
      return this.createWinner({ id, wins: 1, time });
    }
    const bestTime = Math.min(existing.time, time);
    return this.updateWinner(id, existing.wins + 1, bestTime);
  }
}

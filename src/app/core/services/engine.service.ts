import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EngineResponse } from '../models/car.model';
import { API_ENDPOINTS } from '../constants/api.constants';

type EngineStatus = 'started' | 'stopped';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private readonly http = inject(HttpClient);

  toggleEngine(id: number, status: EngineStatus): Observable<EngineResponse> {
    const params = { id, status };
    return this.http.patch<EngineResponse>(API_ENDPOINTS.engine, null, { params });
  }

  drive(id: number): Observable<{ success: boolean }> {
    const params = { id, status: 'drive' };
    return this.http.patch<{ success: boolean }>(API_ENDPOINTS.engine, null, { params });
  }
}

import {inject, Injectable} from '@angular/core';
import {AdminLog} from '../../models/admin-log';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminLogsService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin_log`;

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {Authorization: `Bearer ${token}`};
  }

  getById(id: number) {
    return this.http.get<AdminLog>(`${this.API_URL}/${id}`, {
      headers: this.getHeaders()
    });
  }
}

import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin`;

  users = signal<User[]>([]);

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  fetchUsers() {
    return this.http.get<User[]>(`${this.API_URL}/users`, {
      headers: this.getHeaders()
    }).pipe(
      tap(data => this.users.set(data))
    );
  }

  update(id: number, payload: { name: string; email: string; phone: number | undefined; role: string }) {
    return this.http.put(`${this.API_URL}/user/${id}`, payload, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => {
        this.users.update(lista =>
          lista.map(u => u.id === id ? { ...u, ...payload } : u)
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/user/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.users.update(lista => lista.filter(u => u.id !== id)))
    );
  }

  updateRole(id: number, role: string) {
    return this.http.put(`${this.API_URL}/user/${id}/role`,
      { role },
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.users.update(lista =>
          lista.map(u => u.id === id ? { ...u, role } : u)
        );
      })
    );
  }
}

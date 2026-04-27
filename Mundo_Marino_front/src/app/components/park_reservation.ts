import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { Park_reservation } from '../models/park_reservation';
import { ReservationPrice } from '../models/reservation-price';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Park_reservationService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/park_user_reservation`;
  private readonly BASE_URL = `${environment.apiUrl}`;

  #park_reservations = signal<Park_reservation[]>([]);
  loading = signal<boolean>(false);
  precios = signal<ReservationPrice[]>([]);

  stripeReady = signal<boolean>(false);

  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  fetchPark_reservations() {
    this.loading.set(true);
    return this.http.get<any>(`${this.API_URL}s`).pipe(
      map(res => {
        const rawData = res.data ?? res;
        const data = Array.isArray(rawData) ? rawData : [];
        return data as Park_reservation[];
      }),
      tap(park_reservations => {
        this.#park_reservations.set(park_reservations);
        this.loading.set(false);
      })
    );
  }

  getById(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data ?? res as Park_reservation)
    );
  }

  create(formData: FormData) {
    return this.http.post<{ data: Park_reservation }>(this.API_URL, formData).pipe(
      tap(res => {
        this.#park_reservations.update(list => [res.data, ...list]);
      })
    );
  }

  update(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Park_reservation }>(`${this.API_URL}/${id}`, formData).pipe(
      tap(res => {
        this.#park_reservations.update(
          list =>
            list.map(p => p.id === id ? res.data : p)
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.#park_reservations.update(list => list.filter(p => p.id !== id));
      })
    );
  }

  fetchPrecios() {
    return this.http.get<ReservationPrice[]>(
      `${environment.apiUrl}/park_reservation_prices`
    ).pipe(
      tap(data => this.precios.set(data.map(p => ({
        ...p,
        adult_price: Number(p.adult_price),
        child_price: Number(p.child_price ?? 0),
      }))))
    );
  }

  // ══════════════════════════════════════
  // STRIPE
  // ══════════════════════════════════════

  async initStripe() {
    if (this.stripe) return; // ya inicializado
    this.stripe = await loadStripe(environment.stripeKey);
    if (!this.stripe) return;

    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          '::placeholder': { color: '#aab7c4' },
        },
        invalid: { color: '#fa755a' },
      },
      hidePostalCode: true,
    });
    this.cardElement.mount('#stripe-card-element');
    this.stripeReady.set(true);
  }

  async crearPaymentIntent(payload: {
    amount: number;
    adults: number;
    child: number;
    reservation_date: string;
    park_id: number;
    park_reservation_type_id: number;
    tax_id: number;
    adult_price_total: number;
    child_price_total: number;
    applied_tax: number;
  }): Promise<{ client_secret: string } | null> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return new Promise((resolve,reject) => {
      this.http.post<{ client_secret: string }>(
        `${this.BASE_URL}/stripe/payment-intent`,
        payload,
        { headers }
      ).subscribe({
        next: (res) => resolve(res),
        error: (err) => {
          console.error('Error completo:', err);
          console.error('Mensaje:', err.error?.message);
          reject(err);
        }
      });
    });
  }

  async confirmarPago(clientSecret: string, cardHolder: string): Promise<{ success: boolean; error?: string }> {
    if (!this.stripe || !this.cardElement) {
      return { success: false, error: 'Stripe no está listo.' };
    }

    const result = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.cardElement,
        billing_details: { name: cardHolder },
      },
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: result.paymentIntent?.status === 'succeeded' };
  }
  destroyStripe() {
    if (this.cardElement) {
      this.cardElement.destroy();
      this.cardElement = null;
    }
    this.stripe = null;
  }
}



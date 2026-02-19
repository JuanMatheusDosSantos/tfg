import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import {required} from '@angular/forms/signals';

@Component({
  selector: 'app-booking',
  imports: [
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
})
export class Booking {
  errorMessage = "";
  bookingForm!: FormGroup;
  private fb=inject(FormBuilder);

  ngOnInit() {
  this.bookingForm=this.fb.group({
    bookinType:["",[Validators.required]],
adult:[0,[Validators.required]],
    child:[0,[Validators.required]],
    date:[[]]
  })
  }
  onSubmit(){

  }

}
export function validateDate(){

}

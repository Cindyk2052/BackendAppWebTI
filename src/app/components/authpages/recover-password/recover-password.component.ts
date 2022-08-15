import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent implements OnInit {
  emailPattern: any =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  formRecover: FormGroup;

  constructor(private userService: UserService, private router: Router) {
    this.formRecover = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
        Validators.pattern(this.emailPattern),
      ]),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    let email = this.formRecover.get('email').value;
    email = email.toLowerCase();
    this.formRecover.controls['email'].setValue(email);
    this.userService
      .recoverPassword(this.formRecover.get('email').value)
      .then((response) => {
        this.router.navigate(['/login']);
      });
  }

  closeRecoverPassword() {
    this.router.navigate(['/login']);
  }

  get email() {
    return this.formRecover.get('email');
  }

  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'Debe ingresar un dirección de correo';
    }
    return this.email.hasError('email')
      ? 'Debe tener al menos 6 caracteres y ser un correo válido'
      : '';
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataApiService } from 'src/app/services/data-api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  passwordPattern: any = /^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%_#<>*?&])[A-Za-z\d$@$!%_#<>*?&]{6,15}/;

  showPassword: boolean;

  createFormGroup(){
    return new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
        Validators.pattern(this.emailPattern),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.passwordPattern),
      ]),
    })
  }

  formLogin: FormGroup;

  constructor(
    private userService: UserService, 
    private router: Router,
    private toastr: ToastrService,
    private userControl: DataApiService ) {
    this.formLogin = this.createFormGroup();
    this.showPassword = false;
  }

  ngOnInit(): void {
    
  }

  onSubmit() {
    if (this.formLogin.valid) {
      let email = this.formLogin.get('email').value
        email = email.toLowerCase()
        this.formLogin.controls['email'].setValue(email)
      this.userService.login(this.formLogin.value)
        .then((response: any) => {
          console.log(response)
          this.toastr.success(
            'Ha iniciado sesión exitosamente',
            'Inicio de sesión exitoso',
            {
              positionClass: 'toast-bottom-right',
            }
          );
          this.redirectAdminOrUser()
          
        })
        .catch(error => {
          console.log(error)
          this.toastr.error(
            'Usted no se ha registrado debidamente',
            'Inicio de sesión fallido',
            {
              positionClass: 'toast-bottom-right',
            }
          );
        });
    } else {
      console.log('No funciona');
    }
  }

  async redirectAdminOrUser(){
    if(this.userService.isAuth()){
      console.log('si esta autenticado')
      const email = this.formLogin.get('email').value
      const rol = await this.userControl.searchUserRol(email)
      
      if(rol === 'admin'){
        this.router.navigate(['/dashboard-admin'])
      }else{
        this.router.navigate(['/dashboard-user'])
      }
    }
    else{
      console.log('no esta autenticado')
      this.router.navigate(['/login']);
    }
  }

  seePassword(){
    this.showPassword = !this.showPassword
  }

  openRegister(){
    this.router.navigate(['/register']);
  }

  openRecover(){
    this.router.navigate(['/recover-password'])
  }

  get email(){
    return this.formLogin.get('email');
  }

  get password(){
    return this.formLogin.get('password');
  }

  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'Debe ingresar un dirección de correo';
    }
    return this.email.hasError('email') ? 'Debe tener al menos 6 caracteres y ser un correo válido' : '';
  }

  getErrorMessagePassword(){
    if (this.password.hasError('required')) {
      return 'Debe ingresar una contraseña'
    }
    return this.password.hasError('pattern') ? 'Mínimo 6 caracteres, 1 numero, 1 simbolo y sin espacios' : '';
  }
}

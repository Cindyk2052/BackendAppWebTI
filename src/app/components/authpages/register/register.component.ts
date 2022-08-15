import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ubication } from 'src/app/modelos/ubication';
import { DataApiService } from 'src/app/services/data-api.service';
import { UserService } from 'src/app/services/user.service';
//import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  emailPattern: any =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  passwordPattern: any = /^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%_#<>*?&])[A-Za-z\d$@$!%_#<>*?&]{6,15}/;

  alfabetWithOutSpacePattern: any = /^(?!.*[0-9])[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;

  formReg: FormGroup;

  maxDate: Date = new Date('01/01/2005');
  minDate: Date = new Date('01/01/1920');

  showPassword: boolean;

  directionsMap: Ubication[] = [
    {
      key: 'alt',
      value: 'ALTAMIRA'
    },
    {
      key: 'lg',
      value: 'LA GRANJA'
    }
  ]

  constructor(
    private userService: UserService,
    private router: Router,
    private dataControl: DataApiService,
    private toastr: ToastrService,
    ) {
    this.formReg = new FormGroup({
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
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(this.alfabetWithOutSpacePattern)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(this.alfabetWithOutSpacePattern)
      ]),
      direccionBase: new FormControl('', [
        Validators.required
      ]),
      birthdate: new FormControl('', [
        Validators.required
      ]),
      profilePic: new FormControl(''),
      direccion: new FormControl(''),
      rol: new FormControl('cliente')
    })
    this.showPassword = false;
  }

  ngOnInit(): void {}

  onSubmit(){
    this.userService.register(this.formReg.get('email').value, this.formReg.get('password').value)
      .then(async response => {
        this.toastr.success(
          'Se ha registro con éxito',
          'Registro exitoso',
          {
            positionClass: 'toast-bottom-right',
          }
        );
        this.formReg.removeControl('password');
        const getDate = this.getDate()
        const getPick = this.getPickAPI()
        const keyDirection = this.formReg.get('direccionBase').value
        const valueDirection = this.getValueDirection(keyDirection)
        this.formReg.controls['birthdate'].setValue(getDate)
        this.formReg.controls['profilePic'].setValue(getPick)
        this.formReg.controls['direccion'].setValue(valueDirection)
        let email = this.formReg.get('email').value
        email = email.toLowerCase()
        this.formReg.controls['email'].setValue(email)
        await this.dataControl.addUser(this.formReg.value, email)
        console.log('formulario a enviar', this.formReg.value)
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error(error)
        this.toastr.error(
          'Ya existe una persona registrada con este correo',
          'Registro fallido',
          {
            positionClass: 'toast-bottom-right',
          }
        );
      });

  }

  getValueDirection(key: string): String{
    let value
    for(let item of this.directionsMap){
      if(item.key === key){
        value = item.value
        return value;
      }
    }
    return value;
  }

  get email(){
    return this.formReg.get('email');
  }

  get password(){
    return this.formReg.get('password');
  }

  get name(){
    return this.formReg.get('name');
  }

  get lastName(){
    return this.formReg.get('lastName');
  }

  get direccionBase(){
    return this.formReg.get('direccionBase');
  }

  get birthdate(){
    return this.formReg.get('birthdate');
  }

  getDate(){
    let momentResponse = this.formReg.value
    momentResponse = JSON.parse(JSON.stringify(momentResponse))
    momentResponse = momentResponse.birthdate
    momentResponse = momentResponse.slice(0,-14)
    let split = momentResponse.split('-')
    momentResponse = split[2] + '/' + split[1] + '/' + split[0]
    return momentResponse
  }

  getPickAPI(){
    const formName = this.formReg.get('name').value;
    const formLastName = this.formReg.get('lastName').value
    let urlPick = `https://ui-avatars.com/api/?background=0B2460&color=fff&size=600&font-size=0.4&name=${formName}+${formLastName}`
    return urlPick
  }

  seePassword(){
    this.showPassword = !this.showPassword
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

  getErrorMessageNameLastname(){
    if (this.name.hasError('required')) {
      return 'Debe completar el campo'
    }
    return this.name.hasError('pattern') ? 'Mínimo 6 caracteres, sin numeros y sin espacios' : '';
  }

  getErrorMessageDirection(){
    return this.direccionBase.hasError('required') ? 'Debe seleccionar un sector de domicilio' : '';
  }

  getErrorMessageBirthday(){
    return this.birthdate.hasError('required') ? 'Debe seleccionar una fecha de nacimiento' : '';
  }

  closeRegister() {
    this.router.navigate(['/login']);
  }
}

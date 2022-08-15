import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { Contacto } from 'src/app/modelos/contacto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-contacts-admin',
  templateUrl: './contacts-admin.component.html',
  styleUrls: ['./contacts-admin.component.scss'],
})
export class ContactsAdminComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'address',
    'phoneNumber',
    'activity',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator:
    | MatPaginator
    | undefined;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
  formContact: FormGroup;
  enumContact: number = 0;
  contactos: Contacto[] = [];

  alfabetWithOutSpacePattern: any = /^(?!.*[0-9])[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;
  phoneNumberPattern: any = /^\d{10}$/;

  constructor(
    private dataControl: DataApiService,
    private toastr: ToastrService,
    private dialogService: DialogService
  ) {
    this.formContact = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(this.alfabetWithOutSpacePattern),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(this.alfabetWithOutSpacePattern),
      ]),
      address: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(this.phoneNumberPattern),
      ]),
      activity: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.dataControl.getContacts().subscribe((contactos) => {
      this.dataSource.data = contactos;
      this.enumContact = contactos.length;
      this.contactos = contactos;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async onSubmitAddContact() {
    const idAdd = this.comprobarId();
    if(idAdd != -1){
      this.dialogService.confirmDialog({
        title: 'Modificar Contacto',
        message: '¿Esta seguro de modificar este contacto?',
        confirmText: 'Sí',
        cancelText: 'No'
      }).subscribe(async res => {
        if(res){
          this.formContact.controls['id'].setValue(idAdd);
          await this.dataControl.addContact(this.formContact.value, idAdd);
          this.toastr.info(
            'El contacto fue modificado con éxito!',
            'Contacto modificado',
            {
              positionClass: 'toast-bottom-right',
            }
          );
        }else{
          console.log('No se ha confirmado la modificación')
        }
      })
    }else{
      this.dataControl.identifiedIdElement('GlobalContactos').then((response) => {
        let idGlobal = response['lastitemContact'];
        idGlobal++;
        const idAdd = `${idGlobal}c`;
        this.toastr.success(
          'El contacto fue registrado con éxito!',
          'Contacto registrado',
          {
            positionClass: 'toast-bottom-right',
          }
        );
        const idElement = {lastitemContact: idGlobal};
        this.dataControl.addGlobalIdElement('GlobalContactos', idElement);
        this.formContact.controls['id'].setValue(idAdd);
        this.dataControl.addContact(this.formContact.value, idAdd);
        //console.log('formulario a enviar: ', this.formContact.value);
      })
      }
    }

  comprobarId() {
    const listElement = this.contactos;
    const idBD = listElement.map((item) => item.id);
    const idMod = this.formContact.get('id').value;
    let idAdd;
    for (let item of idBD) {
      if (item == idMod) {
        idAdd = idMod;
        return idAdd
      }
    }
    return -1;
  }
    
  

  async deleteContactById(id: any) {
    this.dialogService.confirmDialog({
      title: 'Eliminar contacto',
      message: '¿Esta seguro de eliminar este contacto?',
      confirmText: 'Sí',
      cancelText: 'No'
    }).subscribe(async res => {
      if(res){
        await this.dataControl.deleteElement(id, 'Contactos');
        this.toastr.error(
          'El contacto fue eliminado con éxito',
          'Registro eliminado',
          {
            positionClass: 'toast-bottom-right',
          }
        );
        this.formContact.reset();
      }else{
        console.log('No se ha confirmado la eliminación')
      }
    })
  }

  fillFormContacto(id: any) {
    this.dataControl.modifiedContact(id).then((response: any) => {
      this.formContact.setValue(response);
    });
  }

  clearForm() {
    this.formContact.reset();
  }

  get name() {
    return this.formContact.get('name');
  }

  get lastName() {
    return this.formContact.get('lastName');
  }

  get address() {
    return this.formContact.get('address');
  }

  get phoneNumber() {
    return this.formContact.get('phoneNumber');
  }

  get activity() {
    return this.formContact.get('activity');
  }

  getErrorMessageName() {
    if (this.name.hasError('required')) {
      return 'Debe completar el campo';
    }
    return this.name.hasError('pattern')
      ? 'Mínimo 6 caracteres y sin numeros'
      : '';
  }

  getErrorMessageAddress() {
    return this.address.hasError('required')
      ? 'Debe escribir su dirrección'
      : '';
  }

  getErrorMessagePhoneNumber() {
    if (this.phoneNumber.hasError('required')) {
      return 'Debe escribir su número de contacto';
    }
    return this.phoneNumber.hasError('pattern')
      ? 'Coloque un número telefónico válido de 10 dígitos'
      : '';
  }

  getErrorMessageActivity() {
    return this.activity.hasError('required')
      ? 'Debe escribir el servicio de reciclaje que oferta'
      : '';
  }
}

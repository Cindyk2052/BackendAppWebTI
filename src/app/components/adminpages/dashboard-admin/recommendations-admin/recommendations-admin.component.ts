import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { Recomendacion } from 'src/app/modelos/recomendacion';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-recommendations-admin',
  templateUrl: './recommendations-admin.component.html',
  styleUrls: ['./recommendations-admin.component.scss'],
})
export class RecommendationsAdminComponent implements OnInit {
  formRecomen: FormGroup;
  enumRecomen: number = 0;
  recomendaciones: Recomendacion[] = [];

  contentLimitPattern: any = /^[\s\S]{0,150}$/;

  plantillaImage: any = {
    MedioAmbiente:
      'https://firebasestorage.googleapis.com/v0/b/testinsercionjson.appspot.com/o/plantillaImages%2Fmedioambiente.jpg?alt=media&token=e49add10-456c-40b0-81f5-e41af9c1a783',
    Orgánicos:
      'https://firebasestorage.googleapis.com/v0/b/testinsercionjson.appspot.com/o/plantillaImages%2Forganicos.jpg?alt=media&token=2f2467bd-5417-4175-89ad-706b8444a4d5',
    Reciclaje:
      'https://firebasestorage.googleapis.com/v0/b/testinsercionjson.appspot.com/o/plantillaImages%2Freciclaje.jpg?alt=media&token=cb69ee6d-8974-4dcf-9a8b-663b54ef96c8',
    Covid19:
      'https://firebasestorage.googleapis.com/v0/b/testinsercionjson.appspot.com/o/plantillaImages%2Fcovid19.jpg?alt=media&token=3c3364e5-cc84-49e5-a0a7-0131f4a99ce1',
  };

  constructor(
    private dataControl: DataApiService,
    private toastr: ToastrService,
    private dialogService: DialogService
  ) {
    this.formRecomen = new FormGroup({
      title: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      content: new FormControl('', [
        Validators.required,
        Validators.pattern(this.contentLimitPattern),
      ]),
      urlImage: new FormControl(),
      id: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.dataControl.getRecommendations().subscribe((recomendaciones) => {
      this.recomendaciones = recomendaciones;
      this.enumRecomen = recomendaciones.length;
    });
  }

  async onSubmitAddRecomen() {
    const urlImage = this.formRecomen.get('urlImage').value;
    if (!urlImage) {
      const baseImages = this.plantillaImage;
      const category = this.formRecomen.get('category').value;
      for (let nameImage in baseImages) {
        if (nameImage == category) {
          const responseUrlImage = baseImages[nameImage];
          this.formRecomen.controls['urlImage'].setValue(responseUrlImage);
        }
      }
    }
    
    const idAdd = this.comprobarId();
    if (idAdd != -1) {
      this.dialogService.confirmDialog({
        title: 'Modificar Recomendación',
        message: '¿Esta seguro de modificar esta recomendación?',
        confirmText: 'Sí',
        cancelText: 'No'
      }).subscribe(async res => {
        if(res){
          this.formRecomen.controls['id'].setValue(idAdd);
          await this.dataControl.addRecommendation(this.formRecomen.value, idAdd);
          this.toastr.info(
            'La recomendación fue modificada con éxito!',
            'Recomendación modificada',
            {
              positionClass: 'toast-bottom-right',
            }
          );
        }else{
          console.log('No se ha confirmado la modificación')
        }
      })
    } else {
      this.dataControl
        .identifiedIdElement('GlobalRecomendation')
        .then((response) => {
          let idGlobal = response['lastitemRecomendation'];
          idGlobal++;
          const idAdd = `${idGlobal}r`;
          this.toastr.success(
            'La recomendación fue registrada con éxito!',
            'Recomendación registrada',
            {
              positionClass: 'toast-bottom-right',
            }
          );
          const idElement = { lastitemRecomendation: idGlobal };
          this.dataControl.addGlobalIdElement('GlobalRecomendation', idElement);
          this.formRecomen.controls['id'].setValue(idAdd);
          this.dataControl.addRecommendation(this.formRecomen.value, idAdd);
          console.log('formulario a enviar: ', this.formRecomen.value);
        });
    }
  }

  comprobarId() {
    const listElement = this.recomendaciones;
    const idBD = listElement.map((item) => item.id);
    const idMod = this.formRecomen.get('id').value;
    let idAdd;
    for (let item of idBD) {
      if (item == idMod) {
        idAdd = idMod;
        return idAdd;
      }
    }
    return -1;
  }

  async deleteRecomenById(id: any) {
    this.dialogService.confirmDialog({
      title: 'Eliminar recomendación',
      message: '¿Esta seguro de eliminar esta recomendación?',
      confirmText: 'Sí',
      cancelText: 'No'
    }).subscribe(async res =>{
      if(res){
        await this.dataControl.deleteElement(id, 'Recomendaciones');
        this.toastr.error(
          'La recomendación fue eliminada con éxito!',
          'Recomendación eliminada',
          {
            positionClass: 'toast-bottom-right',
          }
        );
        this.formRecomen.reset();
      }else{
        console.log('No se ha confirmado la eliminación')
      }
    })
   
  }

  fillFormRecomen(id: any) {
    this.dataControl.modifiedRecommendation(id).then((response: any) => {
      this.formRecomen.setValue(response);
    });
  }

  clearForm() {
    this.formRecomen.reset();
  }

  get title() {
    return this.formRecomen.get('title');
  }

  get category() {
    return this.formRecomen.get('category');
  }

  get content() {
    return this.formRecomen.get('content');
  }

  getErrorMessageTitle() {
    return this.title.hasError('required')
      ? 'Debe escribir un título para la recomendación'
      : '';
  }

  getErrorMessageCategory() {
    return this.category.hasError('required')
      ? 'Debe elegir una categoría para la recomendación'
      : '';
  }

  getErrorMessageContent() {
    if (this.content.hasError('required')) {
      return 'Debe escribir el contenido de su recomendación';
    }
    return this.content.hasError('pattern')
      ? 'Límite máximo de caracteres es 150'
      : '';
  }
}

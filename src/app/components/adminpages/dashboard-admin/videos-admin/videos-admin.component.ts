import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { Video } from 'src/app/modelos/video';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-videos-admin',
  templateUrl: './videos-admin.component.html',
  styleUrls: ['./videos-admin.component.scss'],
})
export class VideosAdminComponent implements OnInit {
  formVideo: FormGroup;
  enumVideos: number = 0;
  videos: Video[] = [];

  contentLimitPattern: any = /^[\s\S]{0,140}$/;

  constructor(
    private dataControl: DataApiService,
    private toastr: ToastrService,
    private dialogService: DialogService
  ) {
    this.formVideo = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.pattern(this.contentLimitPattern),
      ]),
      category: new FormControl('', [Validators.required]),
      prevImg: new FormControl(),
      author: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      id: new FormControl(),
      urlID: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.dataControl.getVideos().subscribe((videos) => {
      this.videos = videos;
      this.enumVideos = videos.length;
    });
  }

  async onSubmitAddVideo() {
    const videoID = this.getVideoId(this.formVideo.get('url').value);
    const urlImage = `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
    this.formVideo.controls['prevImg'].setValue(urlImage);
    this.formVideo.controls['urlID'].setValue(videoID);
    const idAdd = this.comprobarId();
    if (idAdd != -1) {
      this.dialogService.confirmDialog({
        title: 'Modificar Video',
        message: '¿Esta seguro de modificar este video?',
        confirmText: 'Sí',
        cancelText: 'No'
      }).subscribe(async res => {
        if(res){
          this.formVideo.controls['id'].setValue(idAdd);
          await this.dataControl.addVideo(this.formVideo.value, idAdd);
        this.toastr.info(
          'El video fue modificado con éxito!',
          'Video modificado',
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
        .identifiedIdElement('GlobalVideos')
        .then((response) => {
          let idGlobal = response['lastitemVideo'];
          idGlobal++;
          const idAdd = `${idGlobal}v`;
          this.toastr.success(
            'El video fue registrado con exito!',
            'Video registrado',
            {
              positionClass: 'toast-bottom-right',
            }
          );
          const idElement = { lastitemVideo: idGlobal };
          this.dataControl.addGlobalIdElement('GlobalVideos', idElement);
          this.formVideo.controls['id'].setValue(idAdd);
          this.dataControl.addVideo(this.formVideo.value, idAdd);
          console.log('formulario video: ', this.formVideo.value);
        });
    }
    
   
  }

  getVideoId(url: string) {
    const urlEdited = url.slice(32, 43);
    return urlEdited;
  }

  comprobarId() {
    const listElement = this.videos;
    const idBD = listElement.map((item) => item.id);
    const idMod = this.formVideo.get('id').value;
    let idAdd;
    for (let item of idBD) {
      if (item == idMod) {
        idAdd = idMod;
        return idAdd;
      }
    }
    return -1;
  }

  async deleteVideoById(id: any) {
    this.dialogService.confirmDialog({
      title: 'Eliminar video',
      message: '¿Esta seguro de eliminar este video?',
      confirmText: 'Sí',
      cancelText: 'No'
    }).subscribe(async res =>{
      if(res){
        await this.dataControl.deleteElement(id, 'Videos');
    
        this.toastr.error('El video fue eliminado con éxito!', 'Video eliminado', {
          positionClass: 'toast-bottom-right',
        });
        this.formVideo.reset();

      }else{
        console.log('No se ha confirmado la eliminación')
      }
    })
  }

  fillFormVideo(id: any) {
    this.dataControl.modifiedVideo(id).then((response: any) => {
      this.formVideo.setValue(response);
    });
  }

  clearForm() {
    this.formVideo.reset();
  }

  get title() {
    return this.formVideo.get('title');
  }

  get category() {
    return this.formVideo.get('category');
  }

  get author() {
    return this.formVideo.get('author');
  }

  get url() {
    return this.formVideo.get('url');
  }

  getErrorMessageTitle() {
    if (this.title.hasError('required')) {
      return 'Debe escribir un título para el video';
    }
    return this.title.hasError('pattern')
      ? 'Límite máximo de caracteres es 140'
      : '';
  }

  getErrorMessageCategory() {
    return this.category.hasError('required')
      ? 'Debe elegir una categoría para el video'
      : '';
  }

  getErrorMessageAuthor() {
    return this.author.hasError('required')
      ? 'Debe escribir un autor para el video'
      : '';
  }

  getErrorMessageUrl() {
    return this.url.hasError('required')
      ? 'Debe ingresar el enlace de YouTube del video'
      : '';
  }
}

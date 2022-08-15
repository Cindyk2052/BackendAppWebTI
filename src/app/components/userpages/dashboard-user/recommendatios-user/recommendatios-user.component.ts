import { Component, OnInit } from '@angular/core';
import { DataApiService } from 'src/app/services/data-api.service';
import { Recomendacion} from 'src/app/modelos/recomendacion'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recommendatios-user',
  templateUrl: './recommendatios-user.component.html',
  styleUrls: ['./recommendatios-user.component.scss']
})
export class RecommendatiosUserComponent implements OnInit {

  recomendaciones: Recomendacion[] = [];
  fontSize = 14;

  constructor(
    private dataControl: DataApiService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.dataControl.getRecommendations().subscribe((recomendaciones) => {
      this.recomendaciones = recomendaciones;
    });
  }

  aumentarTexto(){
    if(this.fontSize > 21){
      this.toastr.error(
        'No es posible aumentar el tamaño del texto',
        'Tamaño de texto no válido',
        {
          positionClass: 'toast-bottom-right',
        }
      );
      this.fontSize = 22
    } else{
      this.fontSize++;
    }
  }

  reducirTexto(){
    if(this.fontSize < 15){
      this.toastr.error(
        'No es posible reducir el tamaño del texto',
        'Tamaño de texto no válido',
        {
          positionClass: 'toast-bottom-right',
        }
      );
      this.fontSize = 14
    } else{
      this.fontSize--;
    }
  }

}

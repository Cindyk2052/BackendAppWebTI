import { Component} from '@angular/core';
import { DataApiService } from 'src/app/services/data-api.service';


@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.scss']
})
export class DashboardUserComponent{

  urlProfilePic$ = this.dataControl.selectedImage$;

  constructor(private dataControl: DataApiService) { }

}

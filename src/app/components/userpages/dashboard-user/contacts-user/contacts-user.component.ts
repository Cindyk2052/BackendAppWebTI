import { Component, OnInit } from '@angular/core';
import { DataApiService } from 'src/app/services/data-api.service';
import { Contacto } from 'src/app/modelos/contacto'
import { MatDialog} from '@angular/material/dialog'
import { MapComponent} from '../../../dialogs/map/map.component'
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contacts-user',
  templateUrl: './contacts-user.component.html',
  styleUrls: ['./contacts-user.component.scss']
})
export class ContactsUserComponent implements OnInit {

  contactos: Contacto[] = [];
  urlProfilePicExternally: String;

  constructor(
    private userService: UserService,
    private dataControl: DataApiService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.dataControl.getContacts().subscribe((contactos) => {
      this.contactos = contactos;
    });
    this.getProfileUser()
  }

  getProfileUser() {
    const email = this.userService.seeEmailUserAuth();
    this.dataControl.getProfile(email).then((response: any) => {
      const profilePic = response.profilePic
      this.dataControl.setImage(profilePic)
    });
  }

  openDialog(){
    const dialogRef = this.dialog.open(MapComponent, {
      width: '350px',
      data: 'Esto es el modal de explicacion'
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if(res){
        console.log('Borrar')
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {

  

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    
   
  }

  singOut(){
    this.userService.logout()
      .then(() => {
        this.toastr.success('Usted ha cerrado sesión exitosamente', 'Cierre de Sesión', {
          positionClass: 'toast-bottom-right',
        });
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

 
}

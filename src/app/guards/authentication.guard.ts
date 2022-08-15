import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { DataApiService } from '../services/data-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      return this.getUserAuth() as unknown as Observable<boolean | UrlTree>
      
  }

  async getUserAuth(): Promise<Boolean>{
    const isAuth:any = await this.userService.getCurrentUser()
    console.log('Estado de usuario desde guard',isAuth)
    if(isAuth){
      return true
    }
    return false
    /*
    const rol = await this.userControl.searchUserRol(isAuth.email)
    console.log('Desde guardian', rol)
    if(rol === 'admin'){
      this.router.navigate(['/dashboard-admin'])
    }else{
      this.router.navigate(['/dashboard-user'])
    }
    */
  }

  
}

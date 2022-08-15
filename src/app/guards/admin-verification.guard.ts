import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DataApiService } from '../services/data-api.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminVerificationGuard implements CanActivate {

  constructor(private userService: UserService, private userControl: DataApiService) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.verifiedUserRol() as unknown as Observable<boolean | UrlTree>;
  }

  async verifiedUserRol(): Promise<Boolean>{
    const isAuth:any = await this.userService.getCurrentUser()
    const rol = await this.userControl.searchUserRol(isAuth.email)
    console.log('Desde guardian', rol)
    if(rol === 'admin'){
      return true
    }else{
      return false
    }
  }
  
}

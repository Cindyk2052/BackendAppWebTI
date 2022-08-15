import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DataApiService } from '../services/data-api.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class PublicAuthenticationGuard implements CanActivate {

  constructor(private userService: UserService, private userControl: DataApiService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.verifiedUserRolPublic() as unknown as Observable<boolean | UrlTree>;
  }

  async verifiedUserRolPublic(): Promise<Boolean>{
    const isAuth:any = await this.userService.getCurrentUser()
    if(isAuth){
      const rol = await this.userControl.searchUserRol(isAuth.email)
      console.log('Desde guardian', rol)
      if(rol === 'admin' || rol === 'cliente'){
      return false
    }
  }
    return true
  
      
    
    
  }
  
}

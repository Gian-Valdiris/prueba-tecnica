import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ServerService } from './services/server.service';
import { IUser } from './interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private serverService:ServerService, private router: Router) { }
  public dataU:IUser|null = null; 
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):Promise< boolean | UrlTree >{



    this.serverService.isAuth().subscribe(
      (data)=>{
        auth = data.ok
      }
    )

    let auth = await new Promise((resolve)=>{
      this.serverService.isAuth().subscribe(
        (data)=>{
          resolve(data.ok)
          this.dataU = {...data}
        }
      )
    })


    if (auth) {
      // Si el usuario está autenticado, permitir el acceso a la ruta
      this.serverService.setDataUser(this.dataU!)
      return true;
    } else {
      // Si el usuario no está autenticado, redirigirlo a la página de inicio de sesión
      return this.router.parseUrl('/login');
    }
  }

}

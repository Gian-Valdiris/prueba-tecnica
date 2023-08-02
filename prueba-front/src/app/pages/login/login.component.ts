import { Component } from '@angular/core';
import { Observer } from 'rxjs';
import { ServerService } from 'src/app/services/server.service';
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { IUser } from 'src/app/interfaces/user';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  username = '';
  password = '';
  message = ''

  constructor(
    private serverService:ServerService,
    private router:Router
  ){}

  onSubmit() {
    this.serverService.loginUser(this.username,this.password).subscribe(
      (data: IUser) => {
        this.serverService.setDataUser({...data,})
        this.router.navigateByUrl('products')
      },
      (error: HttpErrorResponse) => {
        this.message = error.error.msg
      }
    )
  }
}

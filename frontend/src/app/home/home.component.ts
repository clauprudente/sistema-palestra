import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { PalestraApi, Palestra } from "../palestra.service";
import { HttpClient } from "@angular/common/http";

interface UserData {
  id: number;
  email: string;
  nome: string;
  admin: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  palestras: Palestra[] = [];

  userData: UserData | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private palestraApi: PalestraApi,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.getUser();
    if (!this.userData) {
      this.router.navigateByUrl("/login");
    }

    this.palestraApi.listarPalestra().subscribe({
      next: (dados) => {
        this.palestras = dados;
      },
      error: (err) => console.log("Erro ao carregar dados", err),
    });


  }

  inscricao(idPalestra: number): void {
    const idUsuario = this.userData?.id;
    if (!idUsuario) return;
    this.http.post<any>("http://localhost:3000/api/inscricao", {
      idUsuario,
      idPalestra
    }).subscribe({
      next: (res) => {
        alert(res.message);
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private key = "userData";
  constructor(private router: Router) { }
  login(userData: { email: string; nome: string; admin: boolean }): void {
    localStorage.setItem(this.key, JSON.stringify(userData));
  }
  getUser(): { email: string; nome: string; admin: boolean } | null {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }
  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
  logout(): void {
    localStorage.removeItem(this.key);
    this.router.navigateByUrl("/login");
  }
}

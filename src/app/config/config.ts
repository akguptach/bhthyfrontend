import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// export const baseUrl = `http://localhost:32468/`;
export const baseUrl = environment.API_URL; // live test````'
//export const baseUrl = `https://localhost:44348/`;
@Injectable({
  providedIn: 'root'
})
export class AppConfig {
  private _config: { [key: string]: string };
  constructor() {
    this._config = {
      PathAPI: baseUrl
    };
  }
  get setting(): { [key: string]: string } {
    return this._config;
  }
  get(key: any): string {
    return this._config[key];
  }
}

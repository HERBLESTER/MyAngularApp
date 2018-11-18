import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  public getParentRoute(route: string): string {
    return route.split("/").slice(0, -1).join("/");
  }
}

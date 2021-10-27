import { MemberEditComponent } from './../members/member-edit/member-edit.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot,  CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements  CanDeactivate<unknown> {
  canDeactivate(component: MemberEditComponent): boolean {
    if(component.editFrom.dirty){
       return confirm("You have unsaved changes. Are you sure you want to Navigate?");
    }
    return true;
  }
  
}

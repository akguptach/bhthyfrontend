
import * as customAction from '../../../../store/actions/custom.actions';
import * as customReducer from '../../../../store/reducers/custom.reducer';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class Base {
    
     constructor(  private store: Store<customReducer.AppState>  ) { }

  
}

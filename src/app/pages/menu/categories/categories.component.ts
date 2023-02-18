import { Observable } from 'rxjs';
import { CustomService } from './../../service/custom.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories$!: Observable<any>;
  constructor(private customService: CustomService, private router: ActivatedRoute) { }

  ngOnInit(): void {

    this.router.paramMap.subscribe(param => {
      if (param.has('posId')) {
        this.categories$ = this.customService.Get(`OnlineMenu/GetCategory/${param.get('posId')}`);
      }
    });
  }

}

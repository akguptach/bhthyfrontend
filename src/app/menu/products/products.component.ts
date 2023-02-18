import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {


  products$!: Observable<any>;
  constructor(private customService: CustomService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(param => {
      if (param.has('categoryId')) {
        this.products$ = this.customService.Get(`OnlineMenu/GetProductByCategory/${param.get('categoryId')}`);
      }
    });
  }

}

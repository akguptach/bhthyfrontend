import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { CustomService } from 'src/app/service/custom.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productDetails$!: Observable<any>;
  constructor(private customService: CustomService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(param => {
      if (param.has('productId')) {
        this.productDetails$ = this.customService.Get(`OnlineMenu/GetProductDetailsProductId/${param.get('productId')}`);
      }
    });

  }

}

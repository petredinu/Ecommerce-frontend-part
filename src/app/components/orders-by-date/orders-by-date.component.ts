import { Component, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';

@Component({
  selector: 'app-orders-by-date',
  standalone: false,
  providers: [OrderHistoryService],
  templateUrl: './orders-by-date.component.html',
  styleUrls: ['./orders-by-date.component.css']
})
export class OrdersByDateComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  selectedDate: string = ''; // Va ține data din input

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
  }

  handleSearch() {
    if (this.selectedDate) {
      this.orderHistoryService.getOrdersByDate(this.selectedDate).subscribe(
        data => {
          this.orderHistoryList = data._embedded.orders;
        }
      );
    } else {
      alert("Te rog selectează o dată!");
    }
  }
}
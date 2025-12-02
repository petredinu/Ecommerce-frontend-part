import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface ProductFilters {
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  inStockOnly: boolean;
  sortBy: string;
}

@Component({
  selector: 'app-product-filter',
  standalone: false,
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css'
})
export class ProductFilterComponent implements OnInit {

  @Output() filtersChanged = new EventEmitter<ProductFilters>();
  
  filterForm!: FormGroup;
  showFilters = true;

  sortOptions = [
    { value: 'id,asc', label: 'Implicit' },
    { value: 'unitPrice,asc', label: 'Preț: Crescător' },
    { value: 'unitPrice,desc', label: 'Preț: Descrescător' },
    { value: 'averageRating,desc', label: 'Cele mai bine evaluate' },
    { value: 'name,asc', label: 'Nume: A-Z' },
    { value: 'name,desc', label: 'Nume: Z-A' }
  ];

  ratingOptions = [
    { value: null, label: 'Toate' },
    { value: 4, label: '4+ ⭐' },
    { value: 3, label: '3+ ⭐' },
    { value: 2, label: '2+ ⭐' }
  ];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      priceMin: [null],
      priceMax: [null],
      minRating: [null],
      inStockOnly: [false],
      sortBy: ['id,asc']
    });

    // Emit default filters
    this.applyFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    const filters: ProductFilters = {
      priceMin: this.filterForm.value.priceMin,
      priceMax: this.filterForm.value.priceMax,
      minRating: this.filterForm.value.minRating,
      inStockOnly: this.filterForm.value.inStockOnly,
      sortBy: this.filterForm.value.sortBy
    };

    // Remove null/undefined values
    Object.keys(filters).forEach(key => {
      const filterKey = key as keyof ProductFilters;
      if (filters[filterKey] === null || filters[filterKey] === undefined || filters[filterKey] === '') {
        delete filters[filterKey];
      }
    });

    this.filtersChanged.emit(filters);
  }

  resetFilters() {
    this.filterForm.reset({
      priceMin: null,
      priceMax: null,
      minRating: null,
      inStockOnly: false,
      sortBy: 'id,asc'
    });
    this.applyFilters();
  }
}

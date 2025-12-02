import { Component, OnInit } from '@angular/core';
import { PromoBannerService } from '../../services/promo-banner.service';
import { PromoBanner } from '../../common/promo-banner';

@Component({
  selector: 'app-promo-banner',
  standalone: false,
  templateUrl: './promo-banner.component.html',
  styleUrl: './promo-banner.component.css'
})
export class PromoBannerComponent implements OnInit {

  activeBanner: PromoBanner | null = null;
  isLoading: boolean = true;

  constructor(private promoBannerService: PromoBannerService) { }

  ngOnInit(): void {
    this.loadActiveBanner();
  }

  loadActiveBanner(): void {
    this.promoBannerService.activeBanner$.subscribe({
      next: (banner) => {
        this.activeBanner = banner;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading banner:', error);
        this.isLoading = false;
      }
    });
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/products/placeholder.png';
  }
}

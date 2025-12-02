import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: false,
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Input() rating: number = 0; // Current rating (0-5)
  @Input() readonly: boolean = false; // If true, stars are not clickable
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() ratingChange = new EventEmitter<number>();

  stars: number[] = [1, 2, 3, 4, 5];
  hoveredRating: number = 0;

  onStarClick(rating: number): void {
    if (!this.readonly) {
      this.rating = rating;
      this.ratingChange.emit(this.rating);
    }
  }

  onStarHover(rating: number): void {
    if (!this.readonly) {
      this.hoveredRating = rating;
    }
  }

  onMouseLeave(): void {
    this.hoveredRating = 0;
  }

  getStarClass(star: number): string {
    const currentRating = this.hoveredRating || this.rating;
    
    if (star <= currentRating) {
      return 'fas fa-star filled'; // Full star
    } else if (star - 0.5 <= currentRating) {
      return 'fas fa-star-half-alt half-filled'; // Half star
    } else {
      return 'far fa-star empty'; // Empty star
    }
  }

  getSizeClass(): string {
    switch (this.size) {
      case 'small':
        return 'star-small';
      case 'large':
        return 'star-large';
      default:
        return 'star-medium';
    }
  }
}

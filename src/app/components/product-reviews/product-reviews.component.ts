import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { ProductReview } from '../../common/product-review';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-product-reviews',
  standalone: false,
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.css'
})
export class ProductReviewsComponent implements OnInit {
  @Input() productId!: number;
  
  reviews: ProductReview[] = [];
  averageRating: number = 0;
  totalReviews: number = 0;
  ratingDistribution: { [key: number]: number } = {};
  
  // Pagination
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  
  // Add review form
  showAddReviewForm: boolean = false;
  canUserReview: boolean = false;
  userExistingReview: ProductReview | null = null;
  isAuthenticated: boolean = false;
  
  newReview = {
    rating: 0,
    title: '',
    comment: ''
  };
  
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.checkUserReviewEligibility();
      }
    });
    
    this.loadReviews();
    this.loadReviewStats();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getProductReviews(this.productId, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.reviews = data.reviews || [];
        this.totalPages = data.totalPages || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.isLoading = false;
      }
    });
  }

  loadReviewStats(): void {
    this.reviewService.getReviewStats(this.productId).subscribe({
      next: (stats) => {
        this.averageRating = stats.averageRating;
        this.totalReviews = stats.totalReviews;
        this.ratingDistribution = stats.ratingDistribution;
      },
      error: (error) => {
        console.error('Error loading review stats:', error);
      }
    });
  }

  checkUserReviewEligibility(): void {
    this.reviewService.canUserReview(this.productId).subscribe({
      next: (canReview) => {
        this.canUserReview = canReview;
      }
    });
    
    this.reviewService.getUserReviewForProduct(this.productId).subscribe({
      next: (review) => {
        this.userExistingReview = review;
        if (review) {
          this.newReview = {
            rating: review.rating,
            title: review.title,
            comment: review.comment
          };
        }
      }
    });
  }

  toggleAddReviewForm(): void {
    this.showAddReviewForm = !this.showAddReviewForm;
    if (!this.showAddReviewForm) {
      this.resetForm();
    }
  }

  onRatingChange(rating: number): void {
    this.newReview.rating = rating;
  }

  submitReview(): void {
    if (!this.validateReview()) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    const reviewData = {
      productId: this.productId,
      rating: this.newReview.rating,
      title: this.newReview.title,
      comment: this.newReview.comment
    };
    
    if (this.userExistingReview) {
      // Update existing review
      this.reviewService.updateReview(this.userExistingReview.id, reviewData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showAddReviewForm = false;
          this.resetForm();
          this.loadReviews();
          this.loadReviewStats();
          alert('Review updated successfully!');
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Error updating review. Please try again.';
          console.error('Error updating review:', error);
        }
      });
    } else {
      // Add new review
      this.reviewService.addReview(reviewData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showAddReviewForm = false;
          this.resetForm();
          this.loadReviews();
          this.loadReviewStats();
          alert('Review added successfully!');
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Error adding review. Please try again.';
          console.error('Error adding review:', error);
        }
      });
    }
  }

  validateReview(): boolean {
    if (this.newReview.rating === 0) {
      this.errorMessage = 'Please select a rating';
      return false;
    }
    if (!this.newReview.title.trim()) {
      this.errorMessage = 'Please enter a review title';
      return false;
    }
    if (!this.newReview.comment.trim()) {
      this.errorMessage = 'Please enter a review comment';
      return false;
    }
    return true;
  }

  resetForm(): void {
    if (!this.userExistingReview) {
      this.newReview = {
        rating: 0,
        title: '',
        comment: ''
      };
    }
    this.errorMessage = '';
  }

  markHelpful(reviewId: number): void {
    this.reviewService.markHelpful(reviewId).subscribe({
      next: () => {
        // Find and update the review
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          review.helpfulCount++;
        }
      },
      error: (error) => {
        console.error('Error marking review as helpful:', error);
      }
    });
  }

  getRatingPercentage(stars: number): number {
    if (this.totalReviews === 0) return 0;
    const count = this.ratingDistribution[stars] || 0;
    return (count / this.totalReviews) * 100;
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadReviews();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadReviews();
    }
  }

}

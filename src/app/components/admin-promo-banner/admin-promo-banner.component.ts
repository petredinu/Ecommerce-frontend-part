import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromoBannerService } from '../../services/promo-banner.service';
import { PromoBanner } from '../../common/promo-banner';

@Component({
  selector: 'app-admin-promo-banner',
  standalone: false,
  templateUrl: './admin-promo-banner.component.html',
  styleUrl: './admin-promo-banner.component.css'
})
export class AdminPromoBannerComponent implements OnInit {

  banners: PromoBanner[] = [];
  bannerForm!: FormGroup;
  isEditing: boolean = false;
  editingBannerId: number | null = null;
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showForm: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private promoBannerService: PromoBannerService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBanners();
  }

  initForm(): void {
    this.bannerForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', [Validators.required]],
      linkUrl: ['', [Validators.required]],
      buttonText: ['Vezi Oferta', [Validators.required]],
      active: [true],
      backgroundColor: ['#667eea', [Validators.required]],
      textColor: ['#ffffff', [Validators.required]]
    });
  }

  loadBanners(): void {
    this.isLoading = true;
    this.promoBannerService.getAllBanners().subscribe({
      next: (banners) => {
        this.banners = banners;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Eroare la încărcarea bannerelor';
        this.isLoading = false;
        console.error('Error loading banners:', error);
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.bannerForm.reset({
      buttonText: 'Vezi Oferta',
      active: true,
      backgroundColor: '#667eea',
      textColor: '#ffffff'
    });
    this.isEditing = false;
    this.editingBannerId = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  editBanner(banner: PromoBanner): void {
    this.isEditing = true;
    this.editingBannerId = banner.id;
    this.showForm = true;
    this.bannerForm.patchValue({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      buttonText: banner.buttonText,
      active: banner.active,
      backgroundColor: banner.backgroundColor,
      textColor: banner.textColor
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  saveBanner(): void {
    if (this.bannerForm.invalid) {
      this.errorMessage = 'Te rog completează toate câmpurile obligatorii';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const bannerData: any = {
      title: this.bannerForm.value.title,
      description: this.bannerForm.value.description,
      imageUrl: this.bannerForm.value.imageUrl,
      linkUrl: this.bannerForm.value.linkUrl,
      buttonText: this.bannerForm.value.buttonText,
      active: this.bannerForm.value.active,
      backgroundColor: this.bannerForm.value.backgroundColor,
      textColor: this.bannerForm.value.textColor
    };

    // Add id only when editing
    if (this.isEditing && this.editingBannerId) {
      bannerData.id = this.editingBannerId;
    }

    const saveObservable = this.isEditing && this.editingBannerId
      ? this.promoBannerService.updateBanner(this.editingBannerId, bannerData)
      : this.promoBannerService.createBanner(bannerData);

    saveObservable.subscribe({
      next: () => {
        this.successMessage = this.isEditing 
          ? 'Banner actualizat cu succes!' 
          : 'Banner creat cu succes!';
        this.isSaving = false;
        this.loadBanners();
        this.resetForm();
        this.showForm = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Eroare la salvarea bannerului';
        this.isSaving = false;
        console.error('Error saving banner:', error);
      }
    });
  }

  toggleBannerStatus(banner: PromoBanner): void {
    this.promoBannerService.toggleBannerStatus(banner.id, !banner.active).subscribe({
      next: () => {
        this.loadBanners();
        this.successMessage = `Banner ${!banner.active ? 'activat' : 'dezactivat'} cu succes!`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Eroare la schimbarea statusului';
        console.error('Error toggling status:', error);
      }
    });
  }

  deleteBanner(id: number): void {
    if (confirm('Sigur vrei să ștergi acest banner? Această acțiune este permanentă.')) {
      this.promoBannerService.deleteBanner(id).subscribe({
        next: () => {
          this.successMessage = 'Banner șters cu succes!';
          this.loadBanners();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Eroare la ștergerea bannerului';
          console.error('Error deleting banner:', error);
        }
      });
    }
  }
}

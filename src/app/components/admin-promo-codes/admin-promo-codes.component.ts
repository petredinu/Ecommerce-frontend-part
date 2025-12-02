import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromoCode } from '../../common/promo-code';
import { PromoCodeService } from '../../services/promo-code.service';

@Component({
  selector: 'app-admin-promo-codes',
  standalone: false,
  templateUrl: './admin-promo-codes.component.html',
  styleUrl: './admin-promo-codes.component.css'
})
export class AdminPromoCodesComponent implements OnInit {

  promoCodes: PromoCode[] = [];
  promoCodeForm!: FormGroup;
  isEditing = false;
  editingPromoCodeId: number | null = null;
  showForm = false;
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  discountTypes = [
    { value: 'PERCENTAGE', label: 'Procentual (%)' },
    { value: 'FIXED', label: 'Fix ($)' }
  ];

  constructor(
    private promoCodeService: PromoCodeService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPromoCodes();
  }

  initForm() {
    this.promoCodeForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      discountType: ['PERCENTAGE', Validators.required],
      discountValue: [0, [Validators.required, Validators.min(0)]],
      minOrderValue: [0, Validators.min(0)],
      expiryDate: [''],
      usageLimit: [null, Validators.min(1)],
      active: [true]
    });
  }

  loadPromoCodes() {
    this.isLoading = true;
    this.promoCodeService.getAllPromoCodes().subscribe({
      next: (data) => {
        this.promoCodes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Eroare la încărcarea codurilor:', err);
        this.errorMessage = 'Eroare la încărcarea codurilor promoționale';
        this.isLoading = false;
        this.clearMessagesAfterDelay();
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  savePromoCode() {
    if (this.promoCodeForm.invalid) {
      this.errorMessage = 'Te rog completează corect toate câmpurile obligatorii';
      this.clearMessagesAfterDelay();
      return;
    }

    this.isSaving = true;
    const promoCodeData: any = {
      code: this.promoCodeForm.value.code.toUpperCase(),
      discountType: this.promoCodeForm.value.discountType,
      discountValue: this.promoCodeForm.value.discountValue,
      minOrderValue: this.promoCodeForm.value.minOrderValue || 0,
      expiryDate: this.promoCodeForm.value.expiryDate || null,
      usageLimit: this.promoCodeForm.value.usageLimit || null,
      active: this.promoCodeForm.value.active
    };

    if (this.isEditing && this.editingPromoCodeId) {
      promoCodeData.id = this.editingPromoCodeId;
      this.promoCodeService.updatePromoCode(this.editingPromoCodeId, promoCodeData).subscribe({
        next: () => {
          this.successMessage = 'Cod promoțional actualizat cu succes!';
          this.isSaving = false;
          this.loadPromoCodes();
          this.resetForm();
          this.clearMessagesAfterDelay();
        },
        error: (err) => {
          console.error('Eroare la actualizare:', err);
          this.errorMessage = 'Eroare la actualizarea codului';
          this.isSaving = false;
          this.clearMessagesAfterDelay();
        }
      });
    } else {
      this.promoCodeService.createPromoCode(promoCodeData).subscribe({
        next: () => {
          this.successMessage = 'Cod promoțional creat cu succes!';
          this.isSaving = false;
          this.loadPromoCodes();
          this.resetForm();
          this.clearMessagesAfterDelay();
        },
        error: (err) => {
          console.error('Eroare la creare:', err);
          this.errorMessage = err.status === 409 ? 'Acest cod există deja' : 'Eroare la crearea codului';
          this.isSaving = false;
          this.clearMessagesAfterDelay();
        }
      });
    }
  }

  editPromoCode(promoCode: PromoCode) {
    this.isEditing = true;
    this.editingPromoCodeId = promoCode.id!;
    this.showForm = true;

    this.promoCodeForm.patchValue({
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      minOrderValue: promoCode.minOrderValue || 0,
      expiryDate: promoCode.expiryDate ? new Date(promoCode.expiryDate).toISOString().split('T')[0] : '',
      usageLimit: promoCode.usageLimit,
      active: promoCode.active
    });
  }

  deletePromoCode(promoCode: PromoCode) {
    if (!confirm(`Sigur vrei să ștergi codul "${promoCode.code}"?`)) {
      return;
    }

    this.promoCodeService.deletePromoCode(promoCode.id!).subscribe({
      next: () => {
        this.successMessage = 'Cod promoțional șters cu succes!';
        this.loadPromoCodes();
        this.clearMessagesAfterDelay();
      },
      error: (err) => {
        console.error('Eroare la ștergere:', err);
        this.errorMessage = 'Eroare la ștergerea codului';
        this.clearMessagesAfterDelay();
      }
    });
  }

  togglePromoCodeStatus(promoCode: PromoCode) {
    this.promoCodeService.togglePromoCodeStatus(promoCode.id!).subscribe({
      next: () => {
        this.successMessage = `Cod promoțional ${promoCode.active ? 'dezactivat' : 'activat'} cu succes!`;
        this.loadPromoCodes();
        this.clearMessagesAfterDelay();
      },
      error: (err) => {
        console.error('Eroare la schimbare status:', err);
        this.errorMessage = 'Eroare la schimbarea statusului';
        this.clearMessagesAfterDelay();
      }
    });
  }

  resetForm() {
    this.promoCodeForm.reset({
      discountType: 'PERCENTAGE',
      discountValue: 0,
      minOrderValue: 0,
      active: true
    });
    this.isEditing = false;
    this.editingPromoCodeId = null;
    this.showForm = false;
  }

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  isExpired(expiryDate?: Date): boolean {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  }

  getUsagePercentage(promoCode: PromoCode): number {
    if (!promoCode.usageLimit) return 0;
    return (promoCode.usedCount / promoCode.usageLimit) * 100;
  }
}

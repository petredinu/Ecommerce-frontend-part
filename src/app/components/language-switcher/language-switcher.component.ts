import { Component, OnInit } from '@angular/core';
import { Language, LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css'],
  standalone: false
})
export class LanguageSwitcherComponent implements OnInit {
  
  languages: Language[] = [];
  currentLanguage: string = 'ro';
  isOpen: boolean = false;
  
  constructor(private languageService: LanguageService) { }
  
  ngOnInit(): void {
    this.languages = this.languageService.languages;
    this.currentLanguage = this.languageService.getCurrentLanguage();
    
    // Subscribe la schimbările de limbă
    this.languageService.currentLanguage$.subscribe((lang: string) => {
      this.currentLanguage = lang;
    });
  }
  
  /**
   * Toggle dropdown
   */
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }
  
  /**
   * Selectează o limbă
   */
  selectLanguage(languageCode: string): void {
    this.languageService.setLanguage(languageCode);
    this.isOpen = false;
  }
  
  /**
   * Obține limba curentă
   */
  getCurrentLanguage(): Language | undefined {
    return this.languages.find(lang => lang.code === this.currentLanguage);
  }
  
  /**
   * Close dropdown când se face click în afară
   */
  onClickOutside(): void {
    this.isOpen = false;
  }
}

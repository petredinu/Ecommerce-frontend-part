import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) { }

  updateTitle(title: string) {
    this.titleService.setTitle(title);
  }

  updateMetaTags(tags: {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
  }) {
    if (tags.title) {
      this.titleService.setTitle(tags.title);
      this.metaService.updateTag({ property: 'og:title', content: tags.title });
      this.metaService.updateTag({ name: 'twitter:title', content: tags.title });
    }

    if (tags.description) {
      this.metaService.updateTag({ name: 'description', content: tags.description });
      this.metaService.updateTag({ property: 'og:description', content: tags.description });
      this.metaService.updateTag({ name: 'twitter:description', content: tags.description });
    }

    if (tags.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: tags.keywords });
    }

    if (tags.ogTitle) {
      this.metaService.updateTag({ property: 'og:title', content: tags.ogTitle });
    }

    if (tags.ogDescription) {
      this.metaService.updateTag({ property: 'og:description', content: tags.ogDescription });
    }

    if (tags.ogImage) {
      this.metaService.updateTag({ property: 'og:image', content: tags.ogImage });
      this.metaService.updateTag({ name: 'twitter:image', content: tags.ogImage });
    }

    if (tags.ogUrl) {
      this.metaService.updateTag({ property: 'og:url', content: tags.ogUrl });
      this.metaService.updateTag({ name: 'twitter:url', content: tags.ogUrl });
    }
  }

  createProductStructuredData(product: any) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.name,
      'description': product.description,
      'image': product.imageUrl,
      'sku': product.sku,
      'offers': {
        '@type': 'Offer',
        'url': window.location.href,
        'priceCurrency': 'USD',
        'price': product.unitPrice,
        'availability': product.unitsInStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'itemCondition': 'https://schema.org/NewCondition'
      }
    });

    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(script);
  }

  createBreadcrumbStructuredData(breadcrumbs: Array<{ name: string, url: string }>) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.url
      }))
    });

    document.head.appendChild(script);
  }

  createOrganizationStructuredData() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Your Shop',
      'url': 'https://localhost:4200',
      'logo': 'https://localhost:4200/assets/images/logo2.png',
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+40-372-917-306',
        'contactType': 'Customer Service',
        'availableLanguage': ['English', 'Romanian']
      },
      'sameAs': [
        'https://facebook.com/yourshop',
        'https://instagram.com/yourshop',
        'https://twitter.com/yourshop'
      ]
    });

    document.head.appendChild(script);
  }

  updateCanonicalUrl(url: string) {
    // Remove existing canonical link if present
    const existingLink = this.document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.remove();
    }

    // Create and append new canonical link
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.document.head.appendChild(link);
  }
}

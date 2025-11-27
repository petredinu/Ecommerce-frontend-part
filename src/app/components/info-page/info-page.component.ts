import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { InfoPageService } from '../../services/info-page.service';

@Component({
  selector: 'app-info-page',
  standalone: false,
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

 pageType: string = '';
  content: string = '';
  fullPageObject: any = null; // Stocam tot obiectul primit de la server

  isAdmin: boolean = false;
  isEditing: boolean = false;
  readonly adminEmail: string = 'dinu_petre26@yahoo.ro';

  constructor(private route: ActivatedRoute,
              private infoService: InfoPageService,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.pageType = params.get('type')!;
      this.loadContent();
    });

    this.auth.user$.subscribe(
      (profile) => {
        if (profile && profile.email === this.adminEmail) {
          this.isAdmin = true;
        }
      }
    );
  }

  loadContent() {
    this.infoService.getPageContent(this.pageType).subscribe(
      data => {
        this.fullPageObject = data; // Salvam obiectul pentru a avea link-ul de update
        this.content = data.content; // Extragem textul HTML pentru afisare
      },
      error => {
        console.log("Pagina nu exista in DB, afisam default.");
        this.content = "<p>Continut indisponibil momentan.</p>";
      }
    );
  }

  enableEdit() {
    this.isEditing = true;
  }

  saveContent() {
    if (this.fullPageObject) {
      this.infoService.savePageContent(this.fullPageObject, this.content).subscribe(() => {
        this.isEditing = false;
        alert("Pagina a fost salvata in baza de date!");
        this.loadContent(); // Reimprospatam
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.content = this.fullPageObject.content; // Resetam la ce era inainte
  }
}
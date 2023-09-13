import { Component, inject } from '@angular/core';
import { HealthzService } from '../../services/healthz.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-healthz',
  templateUrl: './healthz.component.html',
  styleUrls: ['./healthz.component.css'],
})
export class HealthzComponent {
  private healthzService = inject(HealthzService);

  onClickHealthz() {
    this.healthzService
      .getHealthz()
      .pipe(first())
      .subscribe({
        next: (value) => alert(value),
        error: (err) => alert(err.message),
      });
  }

  onClickApiHealthz() {
    this.healthzService
      .getApiHealthz()
      .pipe(first())
      .subscribe({
        next: (value) => alert(value),
        error: (err) => alert(err.message),
      });
  }
}

import { Component, inject } from '@angular/core';
import { first } from 'rxjs';
import { Card } from '../../card';
import { CardService } from '../../services/card.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-cards',
  templateUrl: './view-cards.component.html',
  styleUrls: ['./view-cards.component.css'],
})
export class ViewCardsComponent {
  private cardService = inject(CardService);
  private route = inject(ActivatedRoute);
  cards!: Card[];
  page!: number;
  limit = 10;

  ngOnInit() {
    this.page = Number(this.route.snapshot.queryParamMap.get('page') ?? 1);
    this.getCardsByUserId(this.page);
  }

  getCardsByUserId(page: number) {
    this.cardService
      .getCardsByUserId(this.limit, (page - 1) * this.limit)
      .pipe(first())
      .subscribe({
        next: (cards) => (this.cards = cards),
        error: (err) => console.log(err.message),
      });
  }
}

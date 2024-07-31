import { Component, Input, OnInit } from '@angular/core';
import {Hero} from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  @Input() hero?: Hero;
  private heroSubscription!: Subscription;
  
  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroSubscription = this.heroService.getHeroNo404(id)
      .subscribe(hero => this.hero = hero);
  }

  save(): void {
    if (this.hero) {
      const updateHeroSubscription = this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
        updateHeroSubscription.unsubscribe();
    }
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.getHero();
  }

  ngOnDestroy() {
    if (this.heroSubscription) {
      this.heroSubscription.unsubscribe();
    }
  }
}

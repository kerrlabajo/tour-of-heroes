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
  heroes: Hero[] = [];
  
  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getShareableHeroes().subscribe(heroes => this.heroes = heroes);
  
    const hero = this.heroes.find(h => h.id === id);
    if (hero) {
      this.hero = hero;
    } else {
      this.heroSubscription = this.heroService.getHeroNo404(id)
        .subscribe(hero => this.hero = hero);
    }
  }

  save(): void {
    if (this.hero) {
      const updateHeroSubscription: Subscription = this.heroService.updateHero(this.hero)
        .subscribe(() => updateHeroSubscription.unsubscribe());
    }
  }

  delete(hero: Hero): void {
    if(confirm(`Are you sure you want to delete ${hero.name}?`)) {
      const deleteHeroSubscription = this.heroService.deleteHero(hero.id)
        .subscribe(() => {
          deleteHeroSubscription.unsubscribe();
        });
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
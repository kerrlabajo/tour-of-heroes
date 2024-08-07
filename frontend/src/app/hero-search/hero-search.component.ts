import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit{
  heroes$!: Observable<Hero[]>;
  heroes: Hero[] = [];

  private searchTerms = new Subject<string>();
  showResults = true;

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroService.getShareableHeroes().subscribe(sharedHeroes => {
      this.heroes = sharedHeroes
    });
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(100), // wait 300ms after each keystroke before considering the term

      distinctUntilChanged(), // ignore new term if same as previous term

      map((term: string) => this.filterHeroes(term)), // map the search term to a filtered list of sharedHeroes

      // switchMap((term: string) => this.heroService.searchHeroes(term)), switch to new search observable each time the term changes
    );
  }

  private filterHeroes(term: string): Hero[] {
    const emptyTerm = !term.trim();
    if (emptyTerm) {
      // if no search term, return all sharedHeroes
      this.showResults = emptyTerm;
      return [];
    }
    if (!isNaN(Number(term))) {
      term = term.trim();
      return this.heroes.filter(hero => hero.id.toString().includes(term));
    }
    return this.heroes.filter(hero =>
      hero.name.toLowerCase().includes(term.toLowerCase())
    );
  }
}

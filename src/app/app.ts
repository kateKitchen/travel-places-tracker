import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlacesService } from './services/places.service';
import { FormsModule } from '@angular/forms';
import { PlacesListComponent } from './components/places-list/places-list.component';

@Component({
  imports: [RouterOutlet, FormsModule, PlacesListComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly placesService = inject(PlacesService);

  keyword = signal('');
  location = signal('');

  places = signal<any[]>([]);
  wishlist = signal<any>({});

  searchResultPlaces = computed(() =>
    this.places().map(place => ({
      fsq_place_id: place.fsq_place_id,
      name: place.name,
      type: place.categories[0].name,
      address: place.location.formatted_address || '',
      distance: place.distance,
      image: this.getCategoryImageUrl(place)
    }))
  );

  wishlistPlaces = computed(() => 
    Object.entries(this.wishlist()).map(([fsq_place_id, place]: [string, any]) => ({
      fsq_place_id,
      ...place
    }))
  );

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    const wishlist = localStorage.getItem('wishlist');

    if (wishlist) {
      this.wishlist.set(JSON.parse(wishlist));
    }
  }

  toggleWishlist(place: any): void {
    const currentWishlist = this.wishlist();

    if (this.isWishlisted(place.fsq_place_id)) {
      const updatedWishlist = { ...currentWishlist };

      delete updatedWishlist[place.fsq_place_id];

      this.wishlist.set(updatedWishlist);
    } else {
      const updatedWishlist = {
        ...currentWishlist,
        [place.fsq_place_id]: {
          name: place.name,
          type: place.type,
          address: place.address,
          image: place.image
        }
      };

      this.wishlist.set(updatedWishlist);
    }

    localStorage.setItem(
      'wishlist',
      JSON.stringify(this.wishlist())
    );
  }

  isWishlisted(fsqPlaceId: any): boolean {
    return !!this.wishlist()[fsqPlaceId];
  }

  getCategoryImageUrl(place: any): string {
    return place.categories[0].icon.prefix + 'bg_120' + place.categories[0].icon.suffix;
  }

  searchPlaces(): void {
    this.placesService
      .searchPlaces(this.keyword(), this.location())
      .subscribe(response => {
        this.places.set(response.results);
      });
  }
}

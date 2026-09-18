import { Component, inject, input, output, signal } from '@angular/core';
import { PlacesService } from '../../services/places.service';

@Component({
  imports: [],
  selector: 'app-places-list',
  styleUrl: './places-list.component.scss',
  templateUrl: './places-list.component.html',
})
export class PlacesListComponent {
  private readonly placesService = inject(PlacesService);

  places = input<any[]>([]);
  wishlist = input<any>({});

  wishlistToggle = output<any>();
  
  placeDetails = signal<any>({});

  isWishlisted(id: string): boolean {
    return !!this.wishlist()[id];
  }

  toggleWishlist(place: any): void {
    this.wishlistToggle.emit(place);
  }

  showMore(id: string): void {
    if (this.placeDetails()[id]) {
      return;
    }

    this.placesService.getPlaceDetails(id).subscribe({
      next: (details) => {
        this.placeDetails.update(currentDetails => ({
          ...currentDetails,
          [id]: details
        }));
      }
    });
  }

}

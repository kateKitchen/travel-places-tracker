import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Service()
export class PlacesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/foursquare-api/places/';
  private readonly token = 'N0VFAPS5OOFJGVTINYQ1CPZBMCJKCCI2WN4XR10QDPKJJK0R';
  private readonly headers = {
    Authorization: `Bearer ${this.token}`,
    'X-Places-Api-Version': '2025-06-17',
  };
  private readonly cacheTtl = 600 * 60 * 1000; // 600 minutes

  searchPlaces(query: string, ll: string): Observable<any> {
    const cacheKey = this.getCacheKey(query, ll);
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const cacheEntry = JSON.parse(cached);
      if (Date.now() - cacheEntry.timestamp < this.cacheTtl) {
        return of(cacheEntry.data);
      }
      localStorage.removeItem(cacheKey);
    }

    return this.http.get(this.baseUrl + "search", {
      params: {
        query,
        ll,
      },
      headers: this.headers,
    }).pipe(
      tap((data) => {
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          }),
        );
      }),
    );
  }

  private getCacheKey(query: string, ll: string): string {
    return `places:${JSON.stringify({ query, ll })}`;
  }

  getPlaceDetails(placeId: string) {
    const url = this.baseUrl + placeId;
    return this.http.get(
      url,
      {
        headers: this.headers,
      }
    );
  }

}

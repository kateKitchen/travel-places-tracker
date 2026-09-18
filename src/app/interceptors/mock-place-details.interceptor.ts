import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

export const mockPlaceDetailsInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = '/foursquare-api/places/';

  const isPlaceDetailsRequest = req.url.startsWith(baseUrl) && !req.url.startsWith(baseUrl + 'search');

  if (isPlaceDetailsRequest) {
    return of(
      new HttpResponse({
        status: 200,
        body: {
          rating: 4.3,
          tips: [
            {
              id: 1,
              text: 'Great place with a nice atmosphere and good coffee.'
            },
            {
              id: 2,
              text: 'Friendly staff and reasonable prices.'
            }
          ]
        }
      })
    );
  }

  return next(req);
};
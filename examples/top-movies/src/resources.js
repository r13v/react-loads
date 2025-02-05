import * as Loads from 'react-loads';
import * as api from './api';

export const moviesResource = Loads.createResource({
  _namespace: 'movies',
  load: api.getMovies
});

export const movieResource = Loads.createResource({
  _namespace: 'movie',
  load: api.getMovie
});

export const movieReviewsResource = Loads.createResource({
  _namespace: 'movieReviews',
  load: api.getReviewsByMovieId
});

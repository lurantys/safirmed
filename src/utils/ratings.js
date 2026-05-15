const MIN_VOTES = 10;
const DEFAULT_MEAN = 4.0;

export function weightedRating(rating, count) {
  if (!rating || rating < 1 || !count || count < 1) return 0;
  return (rating * count + DEFAULT_MEAN * MIN_VOTES) / (count + MIN_VOTES);
}

export function sortByWeighted(a, b) {
  return weightedRating(b.rating, b.ratingCount) - weightedRating(a.rating, a.ratingCount);
}

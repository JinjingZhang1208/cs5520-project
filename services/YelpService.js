// save apiKey later to .env

// New function to fetch restaurant data and prepare it
export const fetchAndPrepareRestaurants = async (location = 'Vancouver', term = 'restaurants', radius = 5000, minRating = 0) => {
  try {
    const apiKey = 'zFKOmWXnptRNIBcfosQ4-muwe0jNSauD4t8ECqs9V6Mmg_5bife_xgPlxIDWh9ChaJKPcQcCQ0I9KnSzSkWSL2YvI0ceIQTClb07UMfc4fdUpFb8MJGF_Qg6SPYEZnYx';
    const yelpUrl = 'https://api.yelp.com/v3/businesses/search';
    const parameters = new URLSearchParams({
      term: term,
      location: location,
      radius: radius, // by default, radius is 5000 meters(5km)
      limit: 20, // Limit the number of results to 20
    });

    const response = await fetch(`${yelpUrl}?${parameters}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();

    // Extract and prepare data, with filtering by rating
    const preparedData = data.businesses.map(({ name, rating, review_count, image_url }) => ({
      name,
      rating,
      review_count,
      image_url
    })).filter(restaurant => restaurant.rating >= minRating);

    // After fetching, sort the data by rating
    const sortedByRating = preparedData.sort((a, b) => b.rating - a.rating);
    return sortedByRating;
  } catch (error) {
    console.error('Error fetching or preparing restaurant data:', error);
    return []; // Return an empty array or handle the error as appropriate
  }
};


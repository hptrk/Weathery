//---------- This view is responsible for rendering the map ----------//

import View from './View.js';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getSVGLink, sleep } from '../helpers';

class MapView extends View {
  renderMap(data, loadCity) {
    const map = L.map('map').setView([47.497913, 19.040236], 7);
    L.tileLayer(
      'https://tile.jawg.io/57bb42eb-11fa-40e2-9016-dd35d6c31660/{z}/{x}/{y}{r}.png?access-token=CIkVU1QoyQGSOb5J7ePgQnFfwZJYvYv0iQlqCJ6Q7XmM6lvu4g6QbBGlHXV1RHpQ',
      { maxZoom: 7, minZoom: 5 }
    ).addTo(map);

    // loop over favorite cities
    data.forEach(favCity => {
      const markerIcon = L.icon({
        iconUrl: getSVGLink(favCity.icon),
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        className: 'map-icon',
      });

      // create marker for the cities
      const marker = L.marker([favCity.lat, favCity.lon], {
        icon: markerIcon,
      }).addTo(map);
      marker.bindPopup(`<div class="markerPopup">${favCity.city}</div>`); // display the city name on hover

      // when clicking on the marker, the clicked city loads
      marker.on('click', () =>
        loadCity(false, false, { lat: favCity.lat, lon: favCity.lon })
      );

      // on hover, display the name of the city
      marker.on('mouseover', function () {
        marker.openPopup();
      });
      // on mouseleave, close the popup
      marker.on('mouseout', async function () {
        await sleep(0.7);
        marker.closePopup();
      });
    });

    // when clicking on the map, load the closest city to the clicked coords
    map.on('click', e => {
      loadCity(false, false, { lat: e.latlng.lat, lon: e.latlng.lng });
      map.flyTo(e.latlng, map.getZoom(), {
        duration: 1,
        easeLinearity: 0.5,
        zoom: {
          animate: true,
        },
      });
    });
  }
}
export default new MapView();

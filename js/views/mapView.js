//---------- This view is responsible for rendering the map ----------//

import View from './View.js';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getSVGLink, sleep } from '../helpers';

class MapView extends View {
  _map;

  renderMap(data, currentLocation, loadCity) {
    // Create map
    this._map = this._createMap(currentLocation);
    this._addTileLayer();

    // Create markers for favorite cities
    this.createMarkers(data, loadCity);

    // Handle map clicks: Load clicked city + Click animation effect
    this._mapClicks(loadCity);
    console.log(loadCity);
  }

  positionMapView(latlon) {
    this._map.flyTo(latlon, this._map.getZoom(), {
      duration: 1,
      easeLinearity: 0.5,
      zoom: {
        animate: true,
      },
    });
  }

  _createMap(currentLocation) {
    const { latitude, longitude } = currentLocation; // get lat+lng from current position
    return L.map('map').setView([latitude, longitude], 7); // 7 -> zoom level
  }

  _addTileLayer() {
    L.tileLayer(
      'https://tile.jawg.io/57bb42eb-11fa-40e2-9016-dd35d6c31660/{z}/{x}/{y}{r}.png?access-token=CIkVU1QoyQGSOb5J7ePgQnFfwZJYvYv0iQlqCJ6Q7XmM6lvu4g6QbBGlHXV1RHpQ',
      { maxZoom: 7, minZoom: 5 }
    ).addTo(this._map);
  }

  createMarkers(data, loadCity, miniData, notUnknown = true) {
    // loadCity will be 'null' when called with not favorited city
    // loop over cities
    data.forEach(favCity => {
      // marker icon
      const markerIcon = L.icon({
        iconUrl: getSVGLink(
          notUnknown ? favCity.icon : miniData.weather.current.icon
        ),
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        className: 'map-icon',
      });

      // create marker for the cities
      const marker = L.marker([favCity.lat, favCity.lon], {
        icon: markerIcon,
      }).addTo(this._map);
      marker.bindPopup(
        `<div class="markerPopup">${
          notUnknown ? favCity.city : miniData.location.city
        }</div>`
      ); // display the city name on hover

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
  }

  _mapClicks(loadCity) {
    this._map.on('click', e => {
      // when clicking on the map, load the closest city to the clicked coords
      loadCity(false, false, { lat: e.latlng.lat, lon: e.latlng.lng });
      this._animateClick(e); // animate clicks
    });
  }

  async _animateClick(e) {
    // the animated element will be a marker
    const marker = L.circle(e.latlng, {
      color: '#adcade',
      opacity: 0.8,
      weight: 1,
      fillColor: '#adcade',
      fillOpacity: 0.5,
      radius: 0,
    }).addTo(this._map);

    // animate the circle marker
    let radius = 0;
    const interval = setInterval(() => {
      radius += 1000;
      if (radius < 50000) marker.setRadius(radius);
    }, 1);

    // remove the marker after 220ms
    setTimeout(() => {
      clearInterval(interval);
      this._map.removeLayer(marker);
    }, 220);

    // animate the map movement towards the clicked position
    await sleep(0.2); // pause for the animation
    this.positionMapView(e.latlng);
  }
}
export default new MapView();

//---------- This view is responsible for rendering the map ----------//

import View from './View.js';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  getSVGLink,
  sleep,
  setMapFullscreen,
  setMapToDefault,
} from '../helpers';

class MapView extends View {
  _map;
  _currentPosition;
  _resizeButton = document.querySelector('.map__header-resize');
  _isResized = false;
  _container = document.querySelector('.container');
  _mapMessage = document.querySelector('.map__message');

  // ---------- MAIN FUNCTIONS ---------- //

  renderMap(data, currentLocation, loadCity, isLightMode) {
    // Create map
    this._map = this._createMap(currentLocation);
    this._addTileLayer(isLightMode);

    // Create markers for favorite cities
    this.createMarkers(data, loadCity);

    // Handle map clicks: Load clicked city + Click animation effect
    this._mapClicks(loadCity);

    // Display or hide map info message
    this._manageMapMessage();
  }

  positionMapView(latlon) {
    this._currentPosition = latlon;
    this._map.flyTo(latlon, this._map.getZoom(), {
      duration: 1,
      easeLinearity: 0.5,
      zoom: {
        animate: true,
      },
    });
  }

  removeMarkers() {
    // retrieve all layers from the map
    this._map.eachLayer(layer => {
      // check if the layer is a marker
      layer instanceof L.Marker && this._map.removeLayer(layer); // remove the marker from the map
    });
  }

  removeMap() {
    this._map.remove();
  }

  manageResize() {
    // set resize button to default
    this._resizeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="resizebtn">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
</svg>
`;
    this._manageResizeClick(); // manage map resize
  }

  // ---------- HELPER FUNCTIONS ---------- //

  _createMap(currentLocation) {
    const { latitude, longitude } = currentLocation; // get lat+lng from current position
    return L.map('map').setView([latitude, longitude], 7); // 7 -> zoom level
  }

  _addTileLayer(isLightMode) {
    L.tileLayer(
      `https://tile.jawg.io/${
        isLightMode
          ? '735c5d29-8b81-4d01-90a1-0ed205afe9fa'
          : '57bb42eb-11fa-40e2-9016-dd35d6c31660'
      }/{z}/{x}/{y}{r}.png?access-token=CIkVU1QoyQGSOb5J7ePgQnFfwZJYvYv0iQlqCJ6Q7XmM6lvu4g6QbBGlHXV1RHpQ`,
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

  _manageResizeClick() {
    this._resizeButton.addEventListener('click', () => {
      this._isResized ? setMapToDefault() : setMapFullscreen();
      this._map.invalidateSize(); // reset leaflet size (prevent tiles not showing bug)
      this._isResized = this._isResized ? false : true; // toggle isResized
      this._toggleResizeBtn(); // change resize button
    });
  }

  _toggleResizeBtn() {
    this._resizeButton.innerHTML = this._isResized
      ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="resizebtn">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
        </svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="resizebtn">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>`;
  }

  async _manageMapMessage() {
    this._mapMessage.innerHTML = `Click <b>anywhere</b> on the map to instantly load the desired
    location!`;
    this._mapMessage.style.backgroundColor = 'var(--color-grey-light-shade)';

    // hide map message on hover
    this._mapMessage.addEventListener('mouseenter', () =>
      this._hideMapMessage()
    );
    await sleep(15); // automatically hide map message after 15 sec
    this._hideMapMessage();
  }

  _hideMapMessage() {
    this._mapMessage.style.opacity = '0';
    this._mapMessage.style.transform = 'scale(0.8)';
  }
}
export default new MapView();

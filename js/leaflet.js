import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

const map = L.map("map").setView([47.497913, 19.040236], 14);

L.tileLayer(
  "https://tile.jawg.io/57bb42eb-11fa-40e2-9016-dd35d6c31660/{z}/{x}/{y}{r}.png?access-token=CIkVU1QoyQGSOb5J7ePgQnFfwZJYvYv0iQlqCJ6Q7XmM6lvu4g6QbBGlHXV1RHpQ",
  {}
).addTo(map);

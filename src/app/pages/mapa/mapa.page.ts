import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  lat!: number;
  lng!: number;

  constructor( private route: ActivatedRoute ) { }

  ngOnInit() {
    let geo: any = this.route.snapshot.paramMap.get('geo');

    geo = geo.substr(4);
    geo = geo.split(',');

    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);

    console.log(this.lat, this.lng);
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXZpbGVzOTYiLCJhIjoiY2xjOXllMHp2M3BsdDN2bWRudnZsOGU0OSJ9.Ci6T_PqCZeiFKKZle4M6jQ';
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v9',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
    });

    //Mapa 3D
    map.on('style.load', () => {
      map.resize();

      //Marker
      new mapboxgl.Marker()
      .setLngLat([ this.lng, this.lat])
        .addTo(map);

      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
      (layer: any) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;
       
      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      map.addLayer(
      {
      'id': 'add-3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
      'fill-extrusion-color': '#aaa',
       
      // Use an 'interpolate' expression to
      // add a smooth transition effect to
      // the buildings as the user zooms in.
      'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'height']
      ],
      'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height']
      ],
      'fill-extrusion-opacity': 0.6
      }
      },
      labelLayerId
      );
      });
  }
}

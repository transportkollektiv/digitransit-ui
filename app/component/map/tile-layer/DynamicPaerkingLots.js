import { VectorTile } from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import Relay from 'react-relay/classic';
import pick from 'lodash/pick';

import { isBrowser } from '../../../util/browser';
import {
  drawRoundIcon,
  drawDynamicParkLotIcon,
  drawCitybikeOffIcon,
  drawAvailabilityBadge,
  drawAvailabilityValue,
} from '../../../util/mapIconUtils';
import glfun from '../../../util/glfun';

import {
  BIKESTATION_ON,
  BIKESTATION_OFF,
  BIKESTATION_CLOSED,
} from '../../../util/citybikes';

const getScale = glfun({
  base: 1,
  stops: [[13, 0.8], [20, 1.6]],
});

const timeOfLastFetch = {};

class DynamicParkingLots {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;

    this.scaleratio = (isBrowser && window.devicePixelRatio) || 1;
    this.citybikeImageSize =
      20 * this.scaleratio * getScale(this.tile.coords.z);
    this.availabilityImageSize =
      14 * this.scaleratio * getScale(this.tile.coords.z);

    this.promise = this.fetchWithAction(this.fetchAndDrawStatus);
  }

  fetchWithAction = actionFn =>
    fetch(
      //`${this.config.URL.CITYBIKE_MAP}` +
      'http://localhost:3001/parken_hb/' + //TODO URL from config
        `${this.tile.coords.z + (this.tile.props.zoomOffset || 0)}/` +
        `${this.tile.coords.x}/${this.tile.coords.y}.pbf`,
    ).then(res => {
      if (res.status !== 200) {
        return undefined;
      }

      return res.arrayBuffer().then(
        buf => {
          const vt = new VectorTile(new Protobuf(buf));

          this.features = [];

          if (vt.layers.map11geojson != null) { //TODO Layername
            for (
              let i = 0, ref = vt.layers.map11geojson.length - 1;
              i <= ref;
              i++
            ) {
              const feature = vt.layers.map11geojson.feature(i);
              [[feature.geom]] = feature.loadGeometry();
              this.features.push(pick(feature, ['geom', 'properties']));
            }
          }

          this.features.forEach(actionFn);
        },
        err => console.log(err),
      );
    });

  fetchAndDrawStatus = ({ geom, properties}) => {
    console.log("DRAW", geom)
    if (
      this.tile.coords.z <= this.config.dynamicParkingLots.dynamicParkingLotsSmallIconZoom
    ) {
      return drawRoundIcon(this.tile, geom, 'car');
    }


    return drawDynamicParkLotIcon(
      this.tile,
      geom,
      this.citybikeImageSize,
    ).then(() => {
      drawAvailabilityValue(
        this.tile,
        geom,
        properties.currentCapacity,
        this.citybikeImageSize,
        this.availabilityImageSize,
        this.scaleratio,
      );

      /*drawAvailabilityBadge(
        'no',
        this.tile,
        geom,
        this.citybikeImageSize,
        this.availabilityImageSize,
        this.scaleratio,
      );*/
    });

  };

  onTimeChange = () => {
    if (this.tile.coords.z > this.config.cityBike.cityBikeSmallIconZoom) {
      this.fetchWithAction(this.fetchAndDrawStatus);
    }
  };

  static getName = () => 'dynamicParkingLots';
}

export default DynamicParkingLots;
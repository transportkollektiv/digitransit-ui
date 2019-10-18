/* eslint-disable */
import configMerger from '../util/configMerger';

const CONFIG = 'hb';
const APP_TITLE = 'Mobil in Herrenberg';
const APP_DESCRIPTION = '';

const API_URL = process.env.API_URL;
const MAP_URL = process.env.MAP_URL || 'https://maps.wikimedia.org/osm-intl/';
const GEOCODING_BASE_URL = process.env.GEOCODING_BASE_URL || `https://pelias.locationiq.org/v1`;
const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY;

const walttiConfig = require('./waltti').default;

const minLat = 47.9;
const maxLat = 49.1;
const minLon = 8.4;
const maxLon = 9.9;

export default configMerger(walttiConfig, {
  CONFIG,
  URL: {
    OTP: process.env.OTP_URL || `${API_URL}/routing/v1/routers/hb/`,
    MAP: {
      default: MAP_URL,
    },
    STOP_MAP: `${API_URL}/map/v1/stop-map/`,
    DYNAMICPARKINGLOTS_MAP: `${API_URL}/map/v1/hb-parking-map/`,

    PELIAS: `${GEOCODING_BASE_URL}/search${LOCATIONIQ_API_KEY ? '?api_key=' + LOCATIONIQ_API_KEY : ''}`,
    PELIAS_REVERSE_GEOCODER: `${GEOCODING_BASE_URL}/reverse${LOCATIONIQ_API_KEY ? '?api_key=' + LOCATIONIQ_API_KEY : ''}`,
  },

  availableLanguages: ['de', 'en'],
  defaultLanguage: 'de',

  appBarLink: { name: 'Herrenberg.de', href: 'https://www.herrenberg.de' },

  contactName: {
    de: 'transportkollektiv',
    default: 'transportkollektiv',
  },

  colors: {
    primary: '#9fc727',
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },

  dynamicParkingLots: {
    showDynamicParkingLots: true,
    dynamicParkingLotsSmallIconZoom: 16,
    dynamicParkingLotsMinZoom: 14
  },

  mergeStopsByCode: true,

  title: APP_TITLE,

  meta: {
    description: APP_DESCRIPTION,
  },

  textLogo: true,
  GTMid: '',

  timezoneData: 'Europe/Berlin|CET CEST CEMT|-10 -20 -30|01010101010101210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 kL0 Nc0 m10 WM0 1ao0 1cp0 dX0 jz0 Dd0 1io0 17c0 1fA0 1a00 1ehA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o 00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|41e5',

  map: {
    useRetinaTiles: true,
    tileSize: 256,
    zoomOffset: 0,
  },

  feedIds: ['hb'],
  
  searchSources: ['oa', 'osm'],

  searchParams: {
    'boundary.rect.min_lat': minLat,
    'boundary.rect.max_lat': maxLat,
    'boundary.rect.min_lon': minLon,
    'boundary.rect.max_lon': maxLon,
  },

  areaPolygon: [
    [minLon, minLat],
    [minLon, maxLat],
    [maxLon, maxLat],
    [maxLon, minLat],
  ],

  defaultEndpoint: {
    address: 'ZOB Herrenberg',
    lat: 48.5942066,
    lon: 8.8644041,
  },

  defaultOrigins: [
    {
      icon: 'icon-icon_bus',
      label: 'ZOB Herrenberg',
      lat: 48.5942066,
      lon: 8.8644041,
    },
    {
      icon: 'icon-icon_star',
      label: 'Krankenhaus',
      lat: 48.59174,
      lon: 8.87536,
    },
    {
      icon: 'icon-icon_star',
      label: 'Waldfriedhof / Schönbuchturm',
      lat: 48.6020352, 
      lon: 8.9036348,
    },
  ],

  footer: {
    content: [
      { label: `Digitransit der Stadt Herrenberg` },
      {},
      {
        name: 'about-this-service',
        nameEn: 'About this service',
        route: '/tietoja-palvelusta',
        icon: 'icon-icon_info',
      },
    ],
  },

  aboutThisService: {
    de: [
      {
        header: 'Über Mobil in Herrenberg',
        paragraphs: [
          'Mit Mobil in Herrenberg kannst du Routen in und um Herrenberg planen - mit dem ÖPNV, zu Fuß, mit dem Fahrrad oder (teilweise) auch mit dem Auto. Der Dienst basiert auf der Digitransit-Plattform aus Helsinki und wird als freie und offene Software weiterentwickelt.',
          'Herrenberg ist eine von bundesweit fünf Städten, die als Modellkommunen für saubere Luft ausgewählt wurden. Mobil in Herrenberg ist nur ein Projekt von vielen, mit dem wir gemeinsam die <a href="https://www.herrenberg.de/stadtluft">Stadtluft verbessern</a>.',
          '<a href="https://www.herrenberg.de/stadtluft"><img src="https://s3.mobil-in-herrenberg.de/hb-ui/stadtluft.png"/></a>',
        ],
      },
      {
        header: 'Datenquellen',
        paragraphs: [
          'Kartenmaterial, Straßen, Gebäude, Haltestellen usw. werden von <a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap-Mitwirkenden</a> unter der Open-Database-Lizenz bereitgestellt. Darauf basierende Kartenkacheln werden von <a href="https://foundation.wikimedia.org/wiki/Maps_Terms_of_Use">Wikimedia Maps</a> bereitgestellt. Die Fahrplandatensätze stammen von der <a href="https://www.nvbw.de/aufgaben/digitale-mobilitaet/open-data/">NVBW GmbH</a> unter der <a href="https://www.govdata.de/dl-de/by-2-0">dl-de/by-2-0</a>, ÖPNV-Streckenverläufe auch von OpenStreetMap-Mitwirkenden.',
        ],
      },
      {
        header: '',
        paragraphs: [],
      }
    ],
    en: [
      {
        header: 'About Mobil in Herrenberg',
        paragraphs: [
          'With Mobil in Herrenberg you can plan routes in and around Herrenberg - by public transport, on foot, by bicycle or (partly) by car. The service is based on the Digitransit platform from Helsinki and is continuously developed as free and open software.',
          'Herrenberg is one of five cities nationwide that have been selected as model municipalities for clean air. Mobil in Herrenberg is just one of many projects with which we are working together to <a href="https://www.herrenberg.de/stadtluft">improve the urban air</a>.',
          '<a href="https://www.herrenberg.de/stadtluft"><img src="https://s3.mobil-in-herrenberg.de/hb-ui/stadtluft.png"/></a>',
        ],
      },
    ],
  },

  redirectReittiopasParams: false,

  themeMap: {
    hb: 'hb',
  },

  transportModes: {
    bus: {
      availableForSelection: true,
      defaultValue: true,
    },

    rail: {
      availableForSelection: true,
      defaultValue: true,
    }
  },
});

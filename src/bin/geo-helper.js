
import SphericalMercator from './spherical-mercator';


//判断是不是 [a , b  ]这种格式
function isCoorFormat(arr) {
  if (Array.isArray(arr) && arr.length === 2 && typeof arr[0] === 'number' && typeof arr[1] === 'number') {
    return true;
  }
  return false;
}

//经度转 瓦片编码
function lon2tile(lon, zoom) {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

//纬度转 瓦片编码
function lat2tile(lat, zoom) {
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}

export default class GeoHelper {

  constructor(geojson) {

    this.scale = 1;
    this.geojson = geojson;

    this.geo = this.parseGeoData(geojson);
    this.pixels = this.parsePixelPointArray(geojson);


  }


  //解析geojson的数据
  parseGeoData(mapData) {
    let arr = [];
    mapData.features.forEach(d => {
      d.geometry.coordinates.forEach((coordinates, i) => {
        coordinates.forEach((c, j) => {
          if (c[0] instanceof Array) {
            c.forEach(cinner => {
              arr.push(cinner);
            });
          } else {
            arr.push(c);
          }
        });
      });
    });
    let max_lat = Math.max(...arr.map(ar => ar[1]));
    let min_lat = Math.min(...arr.map(ar => ar[1]));
    let max_lng = Math.max(...arr.map(ar => ar[0]));
    let min_lng = Math.min(...arr.map(ar => ar[0]));

    let northWestPoint = this.lnglatToMector({ lat: max_lat, lng: min_lng });
    let southEastPoint = this.lnglatToMector({ lat: min_lat, lng: max_lng });

    let center_lng = (min_lng + max_lng) / 2;
    let center_lat = (max_lat + min_lat) / 2;

    let height = northWestPoint.y - southEastPoint.y;
    let width = northWestPoint.x - southEastPoint.x;

    height = Math.abs(height);
    width = Math.abs(width);
    let centerPoint = this.lnglatToMector({ lat: center_lat, lng: center_lng });
    return {

      max_lat, min_lat, max_lng, min_lng,


      width,
      height,
      centerLatLng: [center_lat, center_lng],
      centerPoint,
      northWestPoint: { x: northWestPoint[0] - centerPoint[0], y: northWestPoint[1] - centerPoint[1] },
      southEastPoint: { x: southEastPoint[0] - centerPoint[0], y: southEastPoint[1] - centerPoint[1] },
    };
  }

  parsePixelPointArray(mapData) {
    let array = [];
    mapData.features.forEach(d => {
      d.geometry.coordinates.forEach((coordinates, i) => {
        const ar = [];
        coordinates.forEach((c, j) => {
          if (c[0] instanceof Array) {
            let arr = c.map(lnglat => {
              let cp = this.lnglatToPixel(lnglat);
              return cp;
            });
            array.push(arr);
          } else if (Array.isArray(c) && c.length === 2) {
            let cp = this.lnglatToPixel(c);
            ar.push(cp);
          }
        });
        ar.length > 0 && array.push(ar);
      });
    });
    return array;
  }


  getTileNumber(zoom) {
    let { max_lat, min_lat, max_lng, min_lng } = this.geo;
    let northWestTile = {
      x: lon2tile(min_lng, zoom),
      y: lat2tile(max_lat, zoom)
    };
    let southEastTile = {
      x: lon2tile(max_lng, zoom),
      y: lat2tile(min_lat, zoom)
    };
    let northEastTile = {
      x: lon2tile(max_lng, zoom),
      y: lat2tile(max_lat, zoom)
    };
    let southWestTile = {
      x: lon2tile(min_lng, zoom),
      y: lat2tile(min_lat, zoom)
    };
    return {
      northWestTile, southEastTile, northEastTile, southWestTile
    };

  }




  //把经经纬度转化成墨卡托坐标
  lnglatToMector(params,) {
    let lat = 0;
    let lng = 0;
    if (typeof params === 'object' && !Array.isArray(params)) {
      lat = params.lat;
      lng = params.lng;
    }
    if (Array.isArray(params)) {
      lng = params[0];
      lat = params[1];
    }
    let point = SphericalMercator.project({ lat, lng });


    let r = [point.x / this.scale, point.y / this.scale];
    r.x = point.x / this.scale;
    r.y = point.y / this.scale;
    return r;
  }

  //把经经纬度转化成threejs 中的坐标
  lnglatToPixel(params,) {
    let lat = 0;
    let lng = 0;
    if (typeof params === 'object' && !Array.isArray(params)) {
      lat = params.lat;
      lng = params.lng;
    }
    if (Array.isArray(params)) {
      lng = params[0];
      lat = params[1];
    }
    let point = this.lnglatToMector({ lat, lng });
    let { centerPoint } = this.geo;
    let x = (point[0] - centerPoint[0]) / 1;
    let y = (point[1] - centerPoint[1]) / 1;
    return [x, y, 0];
  }


}









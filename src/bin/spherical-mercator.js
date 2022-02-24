


const SphericalMercator = {

  R: 6378137,
  MAX_LATITUDE: 85.0511287798,

  project: function (latlng) {
      var d = Math.PI / 180,
          max = this.MAX_LATITUDE,
          lat = Math.max(Math.min(max, latlng.lat), -max),
          sin = Math.sin(lat * d);

      return {
          x: this.R * latlng.lng * d,
          y: this.R * Math.log((1 + sin) / (1 - sin)) / 2,

      };
  },

  unproject: function (point) {
      var d = 180 / Math.PI;

      return {
          lat: (2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
          lng: point.x * d / this.R
      };
  }
};

export default SphericalMercator;

import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';


export function createLineMesh(geo, color) {


  geo = geo.filter(t => t.length > 12);

  let group = new THREE.Group();

  geo.forEach(arr => {

    var curve = new THREE.CatmullRomCurve3();

    var pointArr = [];
    var colorArr = [];

    curve.points.push(...arr.map(i => new THREE.Vector3(...i)));

    let objArr = curve.getPoints(arr.length * 1.3);

    for (var i = 0; i < objArr.length; i++) {
      pointArr.push(objArr[i].x);
      pointArr.push(objArr[i].y);
      pointArr.push(objArr[i].z);
      colorArr.push(0);
      colorArr.push(0);
      colorArr.push(1);
    }



    var geometry = new LineGeometry();

//    geometry.setColors(colorArr);
    geometry.setPositions(pointArr);

  // geometry.setPositions(arr.flat(Infinity));
    var material = new LineMaterial({
      color: color || 'blue',
      linewidth: 2, // in world units with size attenuation, pixels otherwise
      dashed: false,
      alphaToCoverage: true,
      // polygonOffset: true,
      // polygonOffsetFactor: 1.0,
      // polygonOffsetUnits: -4.0
    });
    material.resolution.set(window.innerWidth, window.innerHeight);
    var mesh = new Line2(geometry, material);
    group.add(mesh);
  });
  return group;
}
var doubleClickZoom = {
  enable: function enable(ctx) {
    // First check we've got a map and some context.
    if (!ctx.map || !ctx.map.doubleClickZoom || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) {
      return;
    }

    // Now check initial state wasn't false (we leave it disabled if so)
    if (!ctx._ctx.store.getInitialConfigValue("doubleClickZoom")) {
      return;
    }
    ctx.map.doubleClickZoom.enable();
  },
  disable: function disable(ctx) {
    if (!ctx.map || !ctx.map.doubleClickZoom) {
      return;
    }
    // Always disable here, as it's necessary in some cases.
    ctx.map.doubleClickZoom.disable();
  }
};

var piOver180 = Math.PI / 180;
function findThirdPoint(pointA, pointB, bearingInDeg) {
  var absoluteAngle = Math.abs(bearingInDeg);
  if (absoluteAngle === 0) {
    return {
      x: pointB.x,
      y: pointA.y
    };
  }
  if (absoluteAngle === 90) {
    return {
      x: pointA.x,
      y: pointB.y
    };
  }
  var bearingInRad = bearingInDeg * piOver180;
  var m1 = Math.tan(bearingInRad);
  var m2 = -1 / m1;
  var c1 = pointA.y - m1 * pointA.x;
  var c2 = pointB.y - m2 * pointB.x;
  var x_intersect = (c2 - c1) / (m1 - m2);
  var y_intersect = m1 * x_intersect + c1;
  return {
    x: x_intersect,
    y: y_intersect
  };
}
function findFourthPoint(pointA, pointB, pointC) {
  var midpointAB = {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2
  };
  return {
    x: 2 * midpointAB.x - pointC.x,
    y: 2 * midpointAB.y - pointC.y
  };
}

var DrawRectangle = {
  // When the mode starts this function will be called.
  onSetup: function onSetup() {
    var rectangle = this.newFeature({
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [[]]
      }
    });
    this.addFeature(rectangle);
    this.clearSelectedFeatures();
    doubleClickZoom.disable(this);
    this.updateUIClasses({
      mouse: "add"
    });
    this.setActionableState({
      trash: true
    });
    return {
      rectangle: rectangle
    };
  },
  // support mobile taps
  onTap: function onTap(state, e) {
    // emulate 'move mouse' to update feature coords
    if (state.startPoint) {
      this.onMouseMove(state, e);
    }
    // emulate onClick
    this.onClick(state, e);
  },
  // Whenever a user clicks on the map, Draw will call `onClick`
  onClick: function onClick(state, e) {
    // if state.startPoint exist, means its second click
    //change to  simple_select mode

    if (state.startPoint && state.startPoint[0] !== e.lngLat.lng && state.startPoint[1] !== e.lngLat.lat) {
      this.updateUIClasses({
        mouse: "pointer"
      });
      state.endPoint = [e.lngLat.lng, e.lngLat.lat];
      this.changeMode("simple_select", {
        featuresId: state.rectangle.id
      });
    }

    // on first click, save clicked point coords as starting for  rectangle
    var startPoint = [e.lngLat.lng, e.lngLat.lat];
    state.startPoint = startPoint;
  },
  onMouseMove: function onMouseMove(state, e) {
    // if startPoint, update the feature coordinates, using the bounding box concept
    // we are simply using the startingPoint coordinates and the current Mouse Position
    // coordinates to calculate the bounding box on the fly, which will be our rectangle
    if (state.startPoint) {
      var bearing = state.rectangle.ctx.map.getBearing() * -1;
      var firstPoint = {
        x: state.startPoint[0],
        y: state.startPoint[1]
      };
      var secondPoint = {
        x: e.lngLat.lng,
        y: e.lngLat.lat
      };
      var thirdPoint = findThirdPoint(firstPoint, secondPoint, bearing);
      var forthPoint = findFourthPoint(firstPoint, secondPoint, thirdPoint);
      state.rectangle.updateCoordinate("0.0", state.startPoint[0], state.startPoint[1]); //minX, minY - the starting point

      state.rectangle.updateCoordinate("0.1", thirdPoint.x, thirdPoint.y); // maxX, minY

      state.rectangle.updateCoordinate("0.2", e.lngLat.lng, e.lngLat.lat); // maxX, maxY

      state.rectangle.updateCoordinate("0.3", forthPoint.x, forthPoint.y); // minX,maxY

      state.rectangle.updateCoordinate("0.4", state.startPoint[0], state.startPoint[1]); //minX,minY - ending point (equals to starting point)
    }
  },
  // Whenever a user clicks on a key while focused on the map, it will be sent here
  onKeyUp: function onKeyUp(state, e) {
    if (e.keyCode === 27) {
      return this.changeMode("simple_select");
    }
  },
  onStop: function onStop(state) {
    doubleClickZoom.enable(this);
    this.updateUIClasses({
      mouse: "none"
    });
    this.activateUIButton();

    // check to see if we've deleted this feature
    if (this.getFeature(state.rectangle.id) === undefined) return;

    //remove last added coordinate
    state.rectangle.removeCoordinate("0.4");
    if (state.rectangle.isValid()) {
      this.map.fire("draw.create", {
        features: [state.rectangle.toGeoJSON()]
      });
    } else {
      this.deleteFeature([state.rectangle.id], {
        silent: true
      });
      this.changeMode("simple_select", {}, {
        silent: true
      });
    }
  },
  toDisplayFeatures: function toDisplayFeatures(state, geojson, display) {
    var isActivePolygon = geojson.properties.id === state.rectangle.id;
    geojson.properties.active = isActivePolygon ? "true" : "false";
    if (!isActivePolygon) {
      return display(geojson);
    }

    // Only render the rectangular polygon if it has the starting point
    if (!state.startPoint) {
      return;
    }
    return display(geojson);
  },
  onTrash: function onTrash(state) {
    this.deleteFeature([state.rectangle.id], {
      silent: true
    });
    this.changeMode("simple_select");
  }
};

export { DrawRectangle as default };

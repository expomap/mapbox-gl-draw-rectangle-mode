## ExpoMap's Mapbox GL Draw Rectangle Mode

Este é um fork do [thegisdev/mapbox-gl-draw-rectangle-mode](https://github.com/thegisdev/mapbox-gl-draw-rectangle-mode).
Este fork adiciona a funcionalidade de desenhar os retângulos mesmo quando o mapa possui um ângulo, mantendo-os coerentes em relação ao ponto de vista do mapa.

## Importante:
O retângulo pode parecer deformado a medida em que ele se afasta dos equador, devido a curvatura da terra.


### Install

`npm i @expomap/mapbox-gl-draw-rectangle-mode`

### Demo 

https://codepen.io/fatorius/full/wvLOOqE

### Usage

```js
import DrawRectangle from '@expomap/mapbox-gl-draw-rectangle-mode';

const modes = MapboxDraw.modes;
modes.draw_rectangle = DrawRectangle;

const draw = new MapboxDraw({
  modes: modes
});

draw.changeMode('draw_rectangle');
```

Ao criar o retângulo, o evento `draw.create` é disparado com o objeto do retângulo criado.

### Build

`npm run build`

### License

MIT

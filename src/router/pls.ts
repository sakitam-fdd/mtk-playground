import { RouteRecordRaw } from 'vue-router';

export const playgroundRoutes: RouteRecordRaw[] = [
  {
    path: 'basic',
    name: 'basic',
    children: [
      {
        path: 'layer',
        name: 'basic_layer',
        children: [
          {
            path: 'add-remove',
            name: 'basic_layer_add-remove',
            component: () => import('~/.playgrounds/basic/layer/add-remove/src/App.vue'),
          },
          {
            path: 'bring-front-back',
            name: 'basic_layer_bring-front-back',
            component: () => import('~/.playgrounds/basic/layer/bring-front-back/src/App.vue'),
          },
          {
            path: 'canvaslayer',
            name: 'basic_layer_canvaslayer',
            component: () => import('~/.playgrounds/basic/layer/canvaslayer/src/App.vue'),
          },
          {
            path: 'canvastilelayer',
            name: 'basic_layer_canvastilelayer',
            component: () => import('~/.playgrounds/basic/layer/canvastilelayer/src/App.vue'),
          },
          {
            path: 'collision',
            name: 'basic_layer_collision',
            component: () => import('~/.playgrounds/basic/layer/collision/src/App.vue'),
          },
          {
            path: 'globalcompositeoperation',
            name: 'basic_layer_globalcompositeoperation',
            component: () => import('~/.playgrounds/basic/layer/globalcompositeoperation/src/App.vue'),
          },
          {
            path: 'imagelayer',
            name: 'basic_layer_imagelayer',
            component: () => import('~/.playgrounds/basic/layer/imagelayer/src/App.vue'),
          },
          {
            path: 'mask',
            name: 'basic_layer_mask',
            component: () => import('~/.playgrounds/basic/layer/mask/src/App.vue'),
          },
          {
            path: 'opacity',
            name: 'basic_layer_opacity',
            component: () => import('~/.playgrounds/basic/layer/opacity/src/App.vue'),
          },
          {
            path: 'particlelayer',
            name: 'basic_layer_particlelayer',
            component: () => import('~/.playgrounds/basic/layer/particlelayer/src/App.vue'),
          },
          {
            path: 'show-hide',
            name: 'basic_layer_show-hide',
            component: () => import('~/.playgrounds/basic/layer/show-hide/src/App.vue'),
          },
          {
            path: 'sort',
            name: 'basic_layer_sort',
            component: () => import('~/.playgrounds/basic/layer/sort/src/App.vue'),
          },
          {
            path: 'swipe',
            name: 'basic_layer_swipe',
            component: () => import('~/.playgrounds/basic/layer/swipe/src/App.vue'),
          },
          {
            path: 'vectorlayer-batch-add',
            name: 'basic_layer_vectorlayer-batch-add',
            component: () => import('~/.playgrounds/basic/layer/vectorlayer-batch-add/src/App.vue'),
          },
          {
            path: 'vectorlayer-filter',
            name: 'basic_layer_vectorlayer-filter',
            component: () => import('~/.playgrounds/basic/layer/vectorlayer-filter/src/App.vue'),
          },
          {
            path: 'vectorlayer-get-by-id',
            name: 'basic_layer_vectorlayer-get-by-id',
            component: () => import('~/.playgrounds/basic/layer/vectorlayer-get-by-id/src/App.vue'),
          },
          {
            path: 'vectorlayer-sort',
            name: 'basic_layer_vectorlayer-sort',
            component: () => import('~/.playgrounds/basic/layer/vectorlayer-sort/src/App.vue'),
          },
          {
            path: 'vectorlayer-style',
            name: 'basic_layer_vectorlayer-style',
            component: () => import('~/.playgrounds/basic/layer/vectorlayer-style/src/App.vue'),
          },
        ],
      },
      {
        path: 'map',
        name: 'basic_map',
        children: [
          {
            path: 'canvas',
            name: 'basic_map_canvas',
            component: () => import('~/.playgrounds/basic/map/canvas/src/App.vue'),
          },
          {
            path: 'common-control',
            name: 'basic_map_common-control',
            component: () => import('~/.playgrounds/basic/map/common-control/src/App.vue'),
          },
          {
            path: 'coordinate-conversion',
            name: 'basic_map_coordinate-conversion',
            component: () => import('~/.playgrounds/basic/map/coordinate-conversion/src/App.vue'),
          },
          {
            path: 'custom-resolutions',
            name: 'basic_map_custom-resolutions',
            component: () => import('~/.playgrounds/basic/map/custom-resolutions/src/App.vue'),
          },
          {
            path: 'drag-pitch-rotate',
            name: 'basic_map_drag-pitch-rotate',
            component: () => import('~/.playgrounds/basic/map/drag-pitch-rotate/src/App.vue'),
          },
          {
            path: 'export-image',
            name: 'basic_map_export-image',
            component: () => import('~/.playgrounds/basic/map/export-image/src/App.vue'),
          },
          {
            path: 'fit-extent',
            name: 'basic_map_fit-extent',
            component: () => import('~/.playgrounds/basic/map/fit-extent/src/App.vue'),
          },
          {
            path: 'fractional-zoom',
            name: 'basic_map_fractional-zoom',
            component: () => import('~/.playgrounds/basic/map/fractional-zoom/src/App.vue'),
          },
          {
            path: 'limit-extent',
            name: 'basic_map_limit-extent',
            component: () => import('~/.playgrounds/basic/map/limit-extent/src/App.vue'),
          },
          {
            path: 'limit-zoom',
            name: 'basic_map_limit-zoom',
            component: () => import('~/.playgrounds/basic/map/limit-zoom/src/App.vue'),
          },
          {
            path: 'load',
            name: 'basic_map_load',
            component: () => import('~/.playgrounds/basic/map/load/src/App.vue'),
          },
          {
            path: 'map-events',
            name: 'basic_map_map-events',
            component: () => import('~/.playgrounds/basic/map/map-events/src/App.vue'),
          },
          {
            path: 'map-magnifier',
            name: 'basic_map_map-magnifier',
            component: () => import('~/.playgrounds/basic/map/map-magnifier/src/App.vue'),
          },
          {
            path: 'map-scale-container',
            name: 'basic_map_map-scale-container',
            component: () => import('~/.playgrounds/basic/map/map-scale-container/src/App.vue'),
          },
          {
            path: 'panning',
            name: 'basic_map_panning',
            component: () => import('~/.playgrounds/basic/map/panning/src/App.vue'),
          },
          {
            path: 'pitch-rotate',
            name: 'basic_map_pitch-rotate',
            component: () => import('~/.playgrounds/basic/map/pitch-rotate/src/App.vue'),
          },
          {
            path: 'status',
            name: 'basic_map_status',
            component: () => import('~/.playgrounds/basic/map/status/src/App.vue'),
          },
          {
            path: 'sync-map',
            name: 'basic_map_sync-map',
            component: () => import('~/.playgrounds/basic/map/sync-map/src/App.vue'),
          },
        ],
      },
      {
        path: 'tilelayer-projection',
        name: 'basic_tilelayer-projection',
        children: [
          {
            path: 'arcgis-tile',
            name: 'basic_tilelayer-projection_arcgis-tile',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/arcgis-tile/src/App.vue'),
          },
          {
            path: 'baidu',
            name: 'basic_tilelayer-projection_baidu',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/baidu/src/App.vue'),
          },
          {
            path: 'base64',
            name: 'basic_tilelayer-projection_base64',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/base64/src/App.vue'),
          },
          {
            path: 'canvas-renderer',
            name: 'basic_tilelayer-projection_canvas-renderer',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/canvas-renderer/src/App.vue'),
          },
          {
            path: 'custom-tile',
            name: 'basic_tilelayer-projection_custom-tile',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/custom-tile/src/App.vue'),
          },
          {
            path: 'd3-proj',
            name: 'basic_tilelayer-projection_d3-proj',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/d3-proj/src/App.vue'),
          },
          {
            path: 'different-projection',
            name: 'basic_tilelayer-projection_different-projection',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/different-projection/src/App.vue'),
          },
          {
            path: 'epsg4326',
            name: 'basic_tilelayer-projection_epsg4326',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/epsg4326/src/App.vue'),
          },
          {
            path: 'filter',
            name: 'basic_tilelayer-projection_filter',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/filter/src/App.vue'),
          },
          {
            path: 'grouptilelayer',
            name: 'basic_tilelayer-projection_grouptilelayer',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/grouptilelayer/src/App.vue'),
          },
          {
            path: 'identity',
            name: 'basic_tilelayer-projection_identity',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/identity/src/App.vue'),
          },
          {
            path: 'max-zoom',
            name: 'basic_tilelayer-projection_max-zoom',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/max-zoom/src/App.vue'),
          },
          {
            path: 'multi-tilelayer',
            name: 'basic_tilelayer-projection_multi-tilelayer',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/multi-tilelayer/src/App.vue'),
          },
          {
            path: 'proj4js',
            name: 'basic_tilelayer-projection_proj4js',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/proj4js/src/App.vue'),
          },
          {
            path: 'tile-image-custom',
            name: 'basic_tilelayer-projection_tile-image-custom',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/tile-image-custom/src/App.vue'),
          },
          {
            path: 'tile-mask',
            name: 'basic_tilelayer-projection_tile-mask',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/tile-mask/src/App.vue'),
          },
          {
            path: 'tile-opacity',
            name: 'basic_tilelayer-projection_tile-opacity',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/tile-opacity/src/App.vue'),
          },
          {
            path: 'wms',
            name: 'basic_tilelayer-projection_wms',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/wms/src/App.vue'),
          },
          {
            path: 'wms-reload',
            name: 'basic_tilelayer-projection_wms-reload',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/wms-reload/src/App.vue'),
          },
          {
            path: 'wmts-tile',
            name: 'basic_tilelayer-projection_wmts-tile',
            component: () => import('~/.playgrounds/basic/tilelayer-projection/wmts-tile/src/App.vue'),
          },
        ],
      },
    ],
  },
];

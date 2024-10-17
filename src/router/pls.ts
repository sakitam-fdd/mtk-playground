import { RouteRecordRaw } from 'vue-router';

export const playgroundRoutes: RouteRecordRaw[] = [
  {
    path: 'basic',
    name: 'basic',
    children: [
      {
        path: '3d',
        name: 'basic_3d',
        children: [
          {
            path: 'line-altitude',
            name: 'basic_3d_line-altitude',
            component: () => import('~/.playgrounds/basic/3d/line-altitude/src/App.vue'),
          },
          {
            path: 'line-draw-altitude',
            name: 'basic_3d_line-draw-altitude',
            component: () => import('~/.playgrounds/basic/3d/line-draw-altitude/src/App.vue'),
          },
          {
            path: 'marker-altitude',
            name: 'basic_3d_marker-altitude',
            component: () => import('~/.playgrounds/basic/3d/marker-altitude/src/App.vue'),
          },
          {
            path: 'marker-draw-altitude',
            name: 'basic_3d_marker-draw-altitude',
            component: () => import('~/.playgrounds/basic/3d/marker-draw-altitude/src/App.vue'),
          },
          {
            path: 'polygon-altitude',
            name: 'basic_3d_polygon-altitude',
            component: () => import('~/.playgrounds/basic/3d/polygon-altitude/src/App.vue'),
          },
          {
            path: 'set-altitude',
            name: 'basic_3d_set-altitude',
            component: () => import('~/.playgrounds/basic/3d/set-altitude/src/App.vue'),
          },
        ],
      },
      {
        path: 'geometry',
        name: 'basic_geometry',
        children: [
          {
            path: 'collection',
            name: 'basic_geometry_collection',
            component: () => import('~/.playgrounds/basic/geometry/collection/src/App.vue'),
          },
          {
            path: 'collection-filter',
            name: 'basic_geometry_collection-filter',
            component: () => import('~/.playgrounds/basic/geometry/collection-filter/src/App.vue'),
          },
          {
            path: 'connector-line',
            name: 'basic_geometry_connector-line',
            component: () => import('~/.playgrounds/basic/geometry/connector-line/src/App.vue'),
          },
          {
            path: 'copy',
            name: 'basic_geometry_copy',
            component: () => import('~/.playgrounds/basic/geometry/copy/src/App.vue'),
          },
          {
            path: 'curve',
            name: 'basic_geometry_curve',
            component: () => import('~/.playgrounds/basic/geometry/curve/src/App.vue'),
          },
          {
            path: 'events',
            name: 'basic_geometry_events',
            component: () => import('~/.playgrounds/basic/geometry/events/src/App.vue'),
          },
          {
            path: 'flash-geometry',
            name: 'basic_geometry_flash-geometry',
            component: () => import('~/.playgrounds/basic/geometry/flash-geometry/src/App.vue'),
          },
          {
            path: 'label',
            name: 'basic_geometry_label',
            component: () => import('~/.playgrounds/basic/geometry/label/src/App.vue'),
          },
          {
            path: 'linestring',
            name: 'basic_geometry_linestring',
            component: () => import('~/.playgrounds/basic/geometry/linestring/src/App.vue'),
          },
          {
            path: 'marker',
            name: 'basic_geometry_marker',
            component: () => import('~/.playgrounds/basic/geometry/marker/src/App.vue'),
          },
          {
            path: 'multilinestring',
            name: 'basic_geometry_multilinestring',
            component: () => import('~/.playgrounds/basic/geometry/multilinestring/src/App.vue'),
          },
          {
            path: 'multipoint',
            name: 'basic_geometry_multipoint',
            component: () => import('~/.playgrounds/basic/geometry/multipoint/src/App.vue'),
          },
          {
            path: 'multipolygon',
            name: 'basic_geometry_multipolygon',
            component: () => import('~/.playgrounds/basic/geometry/multipolygon/src/App.vue'),
          },
          {
            path: 'polygon',
            name: 'basic_geometry_polygon',
            component: () => import('~/.playgrounds/basic/geometry/polygon/src/App.vue'),
          },
          {
            path: 'rectangle-circle-ellipse-sector',
            name: 'basic_geometry_rectangle-circle-ellipse-sector',
            component: () => import('~/.playgrounds/basic/geometry/rectangle-circle-ellipse-sector/src/App.vue'),
          },
          {
            path: 'textbox',
            name: 'basic_geometry_textbox',
            component: () => import('~/.playgrounds/basic/geometry/textbox/src/App.vue'),
          },
        ],
      },
      {
        path: 'hellolayer',
        name: 'basic_hellolayer',
        children: [
          {
            path: 'animation',
            name: 'basic_hellolayer_animation',
            component: () => import('~/.playgrounds/basic/hellolayer/animation/src/App.vue'),
          },
          {
            path: 'drawoninteracting',
            name: 'basic_hellolayer_drawoninteracting',
            component: () => import('~/.playgrounds/basic/hellolayer/drawoninteracting/src/App.vue'),
          },
          {
            path: 'layer',
            name: 'basic_hellolayer_layer',
            component: () => import('~/.playgrounds/basic/hellolayer/layer/src/App.vue'),
          },
        ],
      },
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
        path: 'plugin-develop',
        name: 'basic_plugin-develop',
        children: [
          {
            path: 'control',
            name: 'basic_plugin-develop_control',
            component: () => import('~/.playgrounds/basic/plugin-develop/control/src/App.vue'),
          },
          {
            path: 'maptool',
            name: 'basic_plugin-develop_maptool',
            component: () => import('~/.playgrounds/basic/plugin-develop/maptool/src/App.vue'),
          },
          {
            path: 'ui',
            name: 'basic_plugin-develop_ui',
            component: () => import('~/.playgrounds/basic/plugin-develop/ui/src/App.vue'),
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
      {
        path: 'utils',
        name: 'basic_utils',
        children: [
          {
            path: 'options-proxy',
            name: 'basic_utils_options-proxy',
            component: () => import('~/.playgrounds/basic/utils/options-proxy/src/App.vue'),
          },
        ],
      },
    ],
  },
];

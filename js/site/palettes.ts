export const palettes: {[index: string]: {name: string; type: string; colors: string[] | (number[] | number[][])[]}} = {
  // discrete palettes from https://colorbrewer2.org
  rdylbu7: {
    name: 'Red-Yellow-Blue (7)',
    type: 'discrete',
    colors: ['#d73027', '#fc8d59', '#fee090', '#adadad', '#e0f3f8', '#91bfdb', '#4575b4'],
  },
  orrd7: {
    name: 'Orange-Red (7)',
    type: 'discrete',
    colors: ['#fef0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#990000'],
  },
  gnbu7: {
    name: 'Green-Blue (7)',
    type: 'discrete',
    colors: ['#a8ddb5', '#ccebc5', '#f0f9e8', '#adadad', '#4eb3d3', '#2b8cbe', '#08589e'],
  },
  brbg7: {
    name: 'Brown-Teal (7)',
    type: 'discrete',
    colors: ['#8c510a', '#d8b365', '#f6e8c3', '#adadad', '#c7eae5', '#5ab4ac', '#01665e'],
  },
  puor7: {
    name: 'Purple-Orange (7)',
    type: 'discrete',
    colors: ['#b35806', '#f1a340', '#fee0b6', '#adadad', '#d8daeb', '#998ec3', '#542788'],
  },
  prgn6: {
    name: 'Purple-Green (6)',
    type: 'discrete',
    colors: ['#762a83', '#af8dc3', '#e7d4e8', '#d9f0d3', '#7fbf7b', '#1b7837'],
  },
  reds5: {
    name: 'Red (5)',
    type: 'discrete',
    colors: ['#f1eef6', '#d7b5d8', '#df65b0', '#dd1c77', '#980043'],
  },
  greens5: {
    name: 'Green (5)',
    type: 'discrete',
    colors: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837'],
  },
  paired4: {
    name: 'Blue-Green (4)',
    type: 'discrete',
    colors: ['#1f78b4', '#a6cee3', '#b2df8a', '#33a02c'],
  },
  greys4: {
    name: 'Grey (4)',
    type: 'discrete',
    colors: ['#f7f7f7', '#cccccc', '#969696', '#525252'],
  },
  grey: {
    name: 'Grey',
    type: 'continuous',
    colors: [
      [
        [70, 70, 70],
        [80, 80, 80],
      ],
      [150, 150, 150],
      [
        [230, 230, 230],
        [-80, -80, -80],
      ],
    ],
  },
  brown: {
    name: 'Brown',
    type: 'continuous',
    colors: [
      [
        [131, 30, 0],
        [62, 85, 95],
      ],
      [193, 115, 95],
      [
        [255, 200, 190],
        [-62, -85, -95],
      ],
    ],
  },
  purple: {
    name: 'Purple',
    type: 'continuous',
    colors: [
      [
        [90, 14, 213],
        [52.5, 89, 16],
      ],
      [142.5, 103, 229],
      [
        [195, 192, 245],
        [-52.5, -89, -16],
      ],
    ],
  },
  prgn: {
    name: 'Purple-Green',
    type: 'continuous-divergent',
    colors: [
      [
        [27, 120, 55],
        [207, 107, 168.5],
      ],
      [234, 227, 223.5],
      [
        [118, 42, 131],
        [116, 185, 92.5],
      ],
    ],
  },
  puor: {
    name: 'Purple-Orange',
    type: 'continuous-divergent',
    colors: [
      [
        [179, 88, 6],
        [56, 133, 202.5],
      ],
      [235, 221, 208.5],
      [
        [84, 39, 136],
        [151, 182, 72.5],
      ],
    ],
  },
  rdbu: {
    name: 'Red-Blue',
    type: 'continuous-divergent',
    colors: [
      [
        [69, 117, 180],
        [170, 116.5, 16],
      ],
      [239, 233.5, 196],
      [
        [215, 48, 39],
        [24, 185.5, 157],
      ],
    ],
  },
  vik: {
    name: 'vik',
    type: 'continuous-polynomial',
    colors: [
      [97.031, 18.4251, 0.4149],
      [461.7602, 637.5326, 244.4647],
      [-2434.798, -2838.5427, -5893.4695],
      [9665.3469, 14405.823, 44072.722],
      [-2575.9109, -25871.106, -109792.1319],
      [-42510.0569, 8528.3288, 120953.8594],
      [63342.3061, 14006.291, -59644.4457],
      [-26045.0391, -8868.9621, 10155.5667],
    ],
  },
  lajolla: {
    name: 'lajolla',
    type: 'continuous-polynomial',
    colors: [
      [256.0016, 255.9138, 204.945],
      [-187.6735, -46.2889, -768.5655],
      [1022.785, -1057.5602, 1782.0325],
      [-2032.382, 1490.8271, -1785.9056],
      [966.8373, -617.1949, 567.7715],
    ],
  },
}

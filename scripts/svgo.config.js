export default {
  multipass: true,
  plugins: [
    'removeDimensions',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['fill', 'stroke']
      }
    },
    'convertShapeToPath',
    'mergePaths'
  ]
}

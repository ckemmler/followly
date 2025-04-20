export default {
  name: 'video',
  title: 'Videos',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'video',
      title: 'Video',
      type: 'mux.video',
    },
  ],
}

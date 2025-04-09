import {DocumentActionComponent} from 'sanity'

export const testAction: DocumentActionComponent = (props) => ({
  label: '🧪 Test Action',
  onHandle: () => {
    alert('Test action triggered!')
    props.onComplete()
  },
})

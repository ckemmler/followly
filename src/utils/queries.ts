export const getScriptById = (id: string) => `
  *[_type == "script" && id == "${id}"][0]{
    stack[]{
      frame->{
        _id,
        title,
        frameType,
        text,
        componentName,
        props
      }
    }
  }
`

export const getSceneById = (id: string) => `
  *[_type == "scene" && id == "${id}"][0]{
    script->{
      id,
      stack[]{
        triggers[]{
          type,
          standardEvent,
          customEvent,
          goTo->{
            _id,
            title
          }
        },
        frame->{
          _id,
          title,
          frameType,
          text,
          componentName,
          props
        }
      }
    },
  }
`
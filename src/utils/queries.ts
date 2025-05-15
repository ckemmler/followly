export const getScriptById = (id: string) => `
  *[_type == "script" && id == "${id}"][0]{
    sequence[]{
      customAnimation,
      navigation,
      card->{
        _id,
        title,
        cardType,
        text,
        componentName,
        props
      }
    }
  }
`

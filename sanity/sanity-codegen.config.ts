import {SanityCodegenConfig} from 'sanity-codegen'

const config: SanityCodegenConfig = {
  schemaPath: './schemaTypes',
  outputPath: '../src/types/generated.ts',
}

export default config

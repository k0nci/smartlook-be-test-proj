import ajv, { ErrorObject, SchemaObject as AjvSchemaObject, ValidateFunction } from 'ajv';

export type Schema = AjvSchemaObject;

export class Validator {
  private ajv: ajv;

  constructor() {
    // TODO: Add ability to change config
    // TODO: Add ability to define custom keywords
    this.ajv = new ajv({
      allErrors: true,
      coerceTypes: true,
      messages: false,
      useDefaults: true,
    });
  }

  public compile<T = any>(schema: Schema): ValidateFunction<T> {
    return this.ajv.compile<T>(schema);
  }

  public validate(schema: Schema, data: any): ErrorObject[] {
    this.ajv.validate(schema, data);
    return this.ajv.errors || [];
  }

}

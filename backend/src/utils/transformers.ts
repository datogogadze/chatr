import { FindOperator, ValueTransformer } from 'typeorm';

export class BigIntTransformer implements ValueTransformer {
  to(value: number | bigint | FindOperator<number>) {
    return value;
  }

  from(value: string) {
    return parseInt(value);
  }
}

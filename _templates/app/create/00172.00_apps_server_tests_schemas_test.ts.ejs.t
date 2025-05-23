---
to: <%= h.server(CUT_EXAMPLES || `${ROOT}/apps/${SERVER_NAME}/tests/schemas/test.ts`) %>
unless_exists: true
---
import { IsString, IsEnum, isString, isNumber, isBoolean } from 'class-validator';

enum Types {
  admin,
  user,
}

export class TestSchema {
  @IsString()
  public id: string;

  @IsEnum(Types)
  public type: Types;
}

export function isTupl(value: [string, number, boolean]) {
  try {
    return isString(value[0]) && isNumber(value[1]) && isBoolean(value[2]);
  } catch {
    return false;
  }
}

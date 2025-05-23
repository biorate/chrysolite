---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/controllers/dto/user/get-user.dto.ts`) %>
unless_exists: true
---
import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { toInt } from '../../../../../shared';

export class PARAMGetUserDTO {
  @Transform(toInt)
  @IsInt()
  @Min(1)
  @ApiProperty({
    type: String,
    required: true,
    example: '1',
    default: 1,
    description: 'User ID value',
  })
  public readonly id: number;
}

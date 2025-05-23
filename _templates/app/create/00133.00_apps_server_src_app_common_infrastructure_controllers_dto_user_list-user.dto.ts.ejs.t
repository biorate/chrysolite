---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/controllers/dto/user/list-user.dto.ts`) %>
unless_exists: true
---
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { toInt } from '../../../../../shared';

export class QUERYListUserDTO {
  @Transform(toInt)
  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    example: '0',
    default: 0,
    description: 'Pagination offset',
  })
  public readonly offset: number = 0;

  @Transform(toInt)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    example: '100',
    default: 100,
    description: 'Pagination limit',
  })
  public readonly limit: number = 100;
}

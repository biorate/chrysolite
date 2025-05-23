---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/controllers/dto/user/update-user.dto.ts`) %>
unless_exists: true
---
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PARAMGetUserDTO } from './get-user.dto';

export class PARAMUpdateUserDTO extends PARAMGetUserDTO {}

export class BODYUpdateUserDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    example: 'Alice',
    default: 'Alice',
    description: 'User name',
  })
  public readonly name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    example: 'alice@example.com',
    default: 'alice@example.com',
    description: 'User email',
  })
  public readonly email?: string;
}

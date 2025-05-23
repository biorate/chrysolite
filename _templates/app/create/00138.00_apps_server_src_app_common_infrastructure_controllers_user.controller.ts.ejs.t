---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/controllers/user.controller.ts`) %>
unless_exists: true
---
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  Controller,
  Query,
  Body,
  Param,
  Get,
  Post,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { User } from '../../domain';
import {
  BODYUpdateUserDTO,
  BODYReplaceUserDTO,
  BODYCreateUserDTO,
  PARAMDeleteUserDTO,
  PARAMGetUserDTO,
  PARAMReplaceUserDTO,
  PARAMUpdateUserDTO,
  QUERYListUserDTO,
} from './dto/user';
import {
  UserCreateUseCase,
  UserGetUseCase,
  UserListUseCase,
  UserUpdateUseCase,
  UserReplaceUseCase,
  UserDeleteUseCase,
} from '../../application/service/user';

@ApiTags('User')
@Controller('user')
export class UserController {
  public constructor(
    private readonly createUserUseCase: UserCreateUseCase,
    private readonly getUserUseCase: UserGetUseCase,
    private readonly listUserUseCase: UserListUseCase,
    private readonly updateUserUseCase: UserUpdateUseCase,
    private readonly replaceUserUseCase: UserReplaceUseCase,
    private readonly deleteUserUseCase: UserDeleteUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get user list' })
  protected async get(@Query() query: QUERYListUserDTO) {
    return this.listUserUseCase.execute(query.offset, query.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user' })
  protected async list(@Param() params: PARAMGetUserDTO) {
    return this.getUserUseCase.execute(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  protected async create(@Body() body: BODYCreateUserDTO) {
    return this.createUserUseCase.execute(new User(body));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  protected async delete(@Param() params: PARAMDeleteUserDTO) {
    return this.deleteUserUseCase.execute(params.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replace user' })
  protected async replace(
    @Param() params: PARAMReplaceUserDTO,
    @Body() body: BODYReplaceUserDTO,
  ) {
    return this.replaceUserUseCase.execute(new User({ ...params, ...body }));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  protected async update(
    @Param() params: PARAMUpdateUserDTO,
    @Body() body: BODYUpdateUserDTO,
  ) {
    return this.updateUserUseCase.execute(new User({ ...params, ...body }));
  }
}

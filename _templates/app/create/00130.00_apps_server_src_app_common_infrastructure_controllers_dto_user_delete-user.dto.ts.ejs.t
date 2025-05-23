---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/controllers/dto/user/delete-user.dto.ts`) %>
unless_exists: true
---
import { PARAMGetUserDTO } from './get-user.dto';

export class PARAMDeleteUserDTO extends PARAMGetUserDTO {}

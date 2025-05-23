---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/controllers/dto/user/index.ts`) %>
unless_exists: true
---
export * from './create-user.dto';
export * from './get-user.dto';
export * from './list-user.dto';
export * from './update-user.dto';
export * from './delete-user.dto';
export * from './replace-user.dto';

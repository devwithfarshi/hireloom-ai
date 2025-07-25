import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    delete request.user.verifyToken;
    delete request.user.refreshToken;
    delete request.user.resetToken;
    delete request.user.resetTokenExpiry;
    // If data is provided, return only that property from user
    if (data) {
      return request.user[data];
    }
    // Otherwise return the whole user object
    return request.user;
  },
);

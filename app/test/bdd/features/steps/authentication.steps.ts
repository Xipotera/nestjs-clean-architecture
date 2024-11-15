import { Given, When, Then } from '@cucumber/cucumber';
import { AuthGuard } from '@gateways/guards/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { IAuthService } from '@gateways/guards/auth-service.interface';
import { Observable } from 'rxjs';

let authGuard: AuthGuard;
let mockAuthService: IAuthService;
let result: boolean | Promise<boolean> | Observable<boolean>;
let error: any;

// Step: Mock a valid token
Given('I have a valid token', () => {
  mockAuthService = {
    validate: jest.fn().mockReturnValue(true),
  };

  authGuard = new AuthGuard(mockAuthService);
  result = false;
  error = null;
});

// Step: Mock an invalid token
Given('I have an invalid token', () => {
  mockAuthService = {
    validate: jest.fn().mockResolvedValue(false),
  };

  authGuard = new AuthGuard(mockAuthService);
  result = false;
  error = null;
});

// Step: Request a protected resource
When('I request a protected resource', async () => {
  const mockExecutionContext: Partial<ExecutionContext> = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer some-token' },
      }),
    }),
  };

  try {
    result = await authGuard.canActivate(
      mockExecutionContext as ExecutionContext,
    );
  } catch (err) {
    error = err.message;
  }
});

// Step: Verify resource access
Then('I should receive the resource', () => {
  expect(result).toBe(true);
  expect(mockAuthService.validate).toHaveBeenCalledWith('some-token');
});

// Step: Verify unauthorized access
Then('I should receive an error message {string}', (message: string) => {
  expect(result).toBe(false);
  expect(error).toBe(message);
});

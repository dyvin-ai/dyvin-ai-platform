import { ApiResponseInterceptor } from './interceptors/api-response.interceptor';
import { ApiExceptionFilter } from './filters/api-exception.filter';
import { of } from 'rxjs';

describe('Enterprise API Governance & Contract Testing Spec', () => {
  let interceptor: ApiResponseInterceptor<any>;
  let filter: ApiExceptionFilter;

  beforeEach(() => {
    interceptor = new ApiResponseInterceptor();
    filter = new ApiExceptionFilter();
  });

  it('should wrap successful controller responses in standardized API Envelope', (done) => {
    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { 'x-correlation-id': 'corr-10023' } }),
      }),
    };

    const mockHandler: any = {
      handle: () => of({ message: 'Success Payload' }),
    };

    interceptor.intercept(mockContext, mockHandler).subscribe((res) => {
      expect(res.success).toBe(true);
      expect(res.data).toEqual({ message: 'Success Payload' });
      expect(res.correlationId).toBe('corr-10023');
      expect(res.timestamp).toBeDefined();
      expect(res.error).toBeNull();
      done();
    });
  });

  it('should format HTTP exception in standardized global error response contract', () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    const mockHost: any = {
      switchToHttp: () => ({
        getResponse: () => ({ status: mockStatus }),
        getRequest: () => ({ method: 'GET', url: '/api/v1/test', headers: {} }),
      }),
    };

    filter.catch(new Error('Unauthorized access test'), mockHost);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        data: null,
        error: expect.objectContaining({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unauthorized access test',
        }),
      }),
    );
  });
});

import { handler } from './handler';

describe('dog handler', function () {
  it('should get dog', async function () {
    const res = await handler({
      headers: {
        authorization:
          'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImJyYWhtcy1zaWcifQ.eyJpYXQiOjE3MTM2MTg3NjIsImV4cCI6MTcxMzYxOTM2Miwic3ViIjoidT0xMTMzNGVmMC1lMzY5LTRiNzktOWU4YS0wOWM2ZDE0OWIwNTYiLCJpc3MiOiJzcC1sb2dpbi5tZW92YWsuY29tIiwiYXVkIjoiaHR0cHM6Ly9zcC1sb2dpbi5wYWdlcy5kZXYifQ.athLu_-gWpfCQ5m6BDhvZwD8hgMM-1OfyrNfL4PJ7bteg8UnTyyz6pAnle52uyXGKbpojsOAVc2zA32MjemJZw',
      },
      body: null,
    });
    expect(res.statusCode).toBe(200);
  });
});

import { handler } from './handler';

describe('auth', function () {
  it('should invoke', async function () {
    const res = await handler({
      queryStringParameters: {
        code: 'GM-0yt0-1MrjFS3efb1U0HrdxZAQ2MymVDLR4dtynWY',
      },
      body: null,
    });
    expect(res.statusCode).toBe(200);
  });
});

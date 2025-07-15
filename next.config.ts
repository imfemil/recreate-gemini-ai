module.exports = {
  experimental: {
    serverActions: true,
  },
  // Ensure middleware applies only to the routes you want
  matcher: ['/', '/login', '/signup', '/dashboard', '/dashboard/:roomId*'],
};

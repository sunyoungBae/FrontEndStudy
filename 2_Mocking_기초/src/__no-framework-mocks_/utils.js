function fn(impl = () => {}) {
  const mockFn = (...args) => {
    mockFn.mock.calls.push(args);
    return impl(...args);
  };
  mockFn.mock = { calls: [] };
  return mockFn;
}

// 1. 공유할 mock 객체 내보내기
module.exports = {
  getWinner: fn((p1, p2) => p1),
};

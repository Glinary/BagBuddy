

const { connect } = require('../js/main');

test('if return 0, test passes', () => {
    expect(connect(0)).toBe(0);
});


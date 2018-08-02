const expect = require('chai').expect;
const R = require('ramda');
const testData = require('./data.json');

describe("Ramda demo", () => {
  it("Quick refresher on closures and currying", () => {
    const addThree = R.curry((a, b, c) => a + b + c);
    
    expect(addThree(1, 2, 3)).to.eql(6);
    expect(addThree(1)(2, 3)).to.eql(6);
    expect(addThree(1, 2)(3)).to.eql(6);
    expect(addThree(1)(2)(3)).to.eql(6);
  });

  it("Compose functions", () => {
    const f = x => x + 1;
    const g = x => x * 5;
    
    expect(f(g(1))).to.eql(6);
    expect(g(f(1))).to.eql(10);
    
    expect(R.compose(f, g)(1)).to.eql(6);
    expect(R.compose(g, f)(1)).to.eql(10);
  });

  it("Functional pipelines", () => {
    const isEven = x => x % 2 === 0;
    const multiplyEvens = R.pipe(
      R.filter(isEven),
      R.reduce(R.multiply, 1)
    );
    
    expect(multiplyEvens(R.range(1, 5))).to.eql(8);
  });
});

describe("Fun Fun collection", () => {
  it("First names of isActive = true and age > 20", () => {
    const isActive = R.propEq('isActive');
    const overTwenty = R.pipe(
      R.prop('age'),
      age => age > 20
    );
    const activeOverTwenty = R.compose(
      R.map(R.path(['name', 'first'])),
      R.filter(R.both(isActive, overTwenty))
    );

    expect(activeOverTwenty(testData)).to.eql(['Leonardo', 'Wellington'])
  });

  it("VIP\'s only", () => {
    const excludedTags = [
      "forbidden"
    ];
    const isExcludedTag = tag => R.any(R.equals(tag), excludedTags);
    const filterExcludedTags = R.reject(
      R.compose(
        R.any(isExcludedTag),
        R.prop('tags')
      )
    );
    
    expect(filterExcludedTags(testData).length).to.eql(2);
  });

  it("Spam spam spam!", () => {
    const expected = "mailto:leonardo.takato@gmail.com;wellington.santos@gmail.com;geroudo.cleversom@gmail.com"
    const makeEmailHref = R.compose(
      R.concat('mailto:'),
      R.join(';'),
      R.map(R.prop('email'))
    );

    expect(makeEmailHref(testData)).to.eql(expected);
  });
  
  it("hit accounts", () => {
    const expected = 18048.93;
    const moreThanEightThousand = R.lt(8000);
    const pigMoneyBox = R.compose(
      R.reduce(R.add, 0),
      R.map(R.prop('balance'))
    );

    expect(pigMoneyBox(testData)).to.eql(expected);
    expect(moreThanEightThousand(pigMoneyBox(testData))).to.eql(true);
  });
});

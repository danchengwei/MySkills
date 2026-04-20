class CodeReview {
  constructor() {
    this.reviews = [];
  }

  createReview(review) {
    this.reviews.push(review);
    return this;
  }

  listReviews() {
    console.log('代码审查列表:');
    return this.reviews;
  }
}

module.exports = CodeReview;

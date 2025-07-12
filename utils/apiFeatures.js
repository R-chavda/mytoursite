class APIfeatures {
    constructor(query, queryStrig) {
        this.query = query;
        this.queryStrig = queryStrig;
    }

    filter() {
        const queryObj = { ...this.queryStrig };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj); // Convert queryObj to a string
        // Replace plain text operators with Mongoose operators
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        this.query = this.query.find(JSON.parse(queryStr)); // Convert the string back to a JSON object

        return this;
    }

    sort() {
        if (this.queryStrig.sort) {
            const sortBy = this.queryStrig.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitfields() {
        if (this.queryStrig.fields) {
            const fields = this.queryStrig.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryStrig.page * 1 || 1;
        const limit = this.queryStrig.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIfeatures;

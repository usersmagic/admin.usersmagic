const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Country = require('../country/Country');
const User = require('../user/User');

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  payment_number: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

PaymentSchema.statics.findLatestPayments = function (callback) {
  // Find and return the earliest 100 payments, or an error if it exists

  const Payment = this;

  Payment
    .find({})
    .sort({ _id: 1 })
    .limit(50)
    .then(payments => {
      async.times(
        payments.length,
        (time, next) => {
          const payment = payments[time];

          User.getUserById(payment.user_id, (err, user) => {
            if (err) return next(err);

            Country.getCountryWithAlpha2Code(user.country, (err, country) => {
              if (err) return next(err);

              return next(null, {
                _id: payment._id.toString(),
                amount: payment.amount,
                currency: country.currency,
                user,
                created_at: payment.created_at,
                payment_number: payment.payment_number
              });
            });
          });
        },
        (err, payments) => callback(err, payments)
      );
    })
    .catch(err => callback('database_error'));
};

// PaymentSchema.statics.findLatestPaymentsWithFilters = function (filters, callback) {
//   // Find and return the earliest 100 payments with the given filters, or an error if it exists
//   // Allowed filters: name, email, city, town, countries, genders, max_birth_year, min_birth_year
//   // Allowed options: skip, limit. Default to 0 and 100, respectively. Limit can be max 100

//   const _filters = { $and: [
//     { completed: true }
//   ]};

//   if (!filters)
//     filters = {};

//   if (filters.name && typeof filters.name == 'string')
//     _filters.$and.push({ name: { $regex: filters.name.trim().toString() } });

//   if (filters.email && validator.isEmail(filters.email.trim()))
//     _filters.$and.push({ email: filters.email.trim() });

//   if (filters.city && typeof filters.city == 'string')
//     _filters.$and.push({ city: { $regex: filters.city.trim().toString() } });

//   if (filters.town && typeof filters.town == 'string')
//     _filters.$and.push({ town: { $regex: filters.town.trim().toString() } });

//   if (filters.countries && Array.isArray(filters.countries))
//     _filters.$and.push({ country: { $in: filters.countries } });

//   if (filters.genders && Array.isArray(filters.genders))
//     _filters.$and.push({ gender: { $in: filters.genders } });

//   if (filters.max_birth_year && Number.isInteger(filters.max_birth_year))
//     _filters.$and.push({ birth_year: { $lte: filters.max_birth_year } });

//   if (filters.min_birth_year && Number.isInteger(filters.min_birth_year))
//     _filters.$and.push({ birth_year: { $gte: filters.min_birth_year } });

//   const Payment = this;

//   Payment
//     .find({})
//     .sort({ _id: 1 })
//     .then(payments => {
//       const validPayments = [];

//       for (let i = 0; i < payments.length && validPayments.length < 100; i++) {
//         const payment = payments[i];

//         User.findOne({$and: [
//           _filters,
//           { _id: mongoose.Types.ObjectId(payment.user._id.toString()) }
//         ]}, (err, user) => {
//           if (err || !user)
//             continue;

//           User.getUserById(payment.user_id, (err, user) => {
//             if (err) continue;
  
//             Country.getCountryWithAlpha2Code(user.country, (err, country) => {
//               if (err) continue;
  
//               validPayments.push({
//                 _id: payment._id.toString(),
//                 amount: payment.amount,
//                 currency: country.currency,
//                 user,
//                 created_at: payment.created_at,
//                 payment_number: payment.payment_number
//               });
//             });
//           });
//         });
//       }

//       return callback(null, validPayments);
//     })
//     .catch(err => callback('database_error'));
// };

PaymentSchema.statics.approvePayment = function (id, callback) {
  // Approve the Payment with the given id. Increase User credit amount and delete the Payment
  // Return an error if it exists

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  const Payment = this;

  Payment.findById(mongoose.Types.ObjectId(id.toString()), (err, payment) => {
    if (err || !payment) return callback('document_not_found');

    User.getUserById(payment.user_id, (err, user) => {
      if (err) return callback(err);

      User.updateUserById(payment.user_id, {
        $inc: {
          waiting_credit: -1 * payment.amount,
          overall_credit: payment.amount
        },
        $set: {
          invitor: null
        }
      }, err => {
        if (err) return callback(err);
  
        Payment.findByIdAndDelete(mongoose.Types.ObjectId(id.toString()), err => {
          if (err) return callback('database_error');
  
          if (!user.invitor)
            return callback(null);

          User.updateUserById(user.invitor, {$inc: {
            credit: 2
          }}, err => {
            if (err) return callback(err);

            return callback(null);
          });
        });
      });
    });
  });
};

module.exports = mongoose.model('Payment', PaymentSchema);

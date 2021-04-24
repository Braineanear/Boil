import mongoose from 'mongoose';
import crypto from 'crypto';
import validator from 'validator';
import { hash, verify } from 'argon2';
import { toJSON, paginate } from './plugins/index';
import { roles } from '../config/roles';

const authTypes = ['github', 'twitter', 'facebook', 'google'];

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number'
          );
        }
      },
      private: true
    },
    role: {
      type: String,
      enum: roles,
      default: 'user'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    provider: {
      type: String,
      required: true
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true
    },
    google: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await verify(user.password, password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    // Salting & Hashing the Password
    const salt = crypto.randomBytes(32);
    user.password = await hash(user.password, { salt });
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

export default User;

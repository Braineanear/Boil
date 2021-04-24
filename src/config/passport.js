import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import catchAsync from '../utils/catchAsync';
import config from './config';
import tokenTypes from './tokens';
import { User } from '../models/index';

const serverUrl =
  config.env === 'production' ? config.url.production : config.url.development;

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const googleOptions = {
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: `${serverUrl}${config.google.callbackURL}`,
  proxy: true
};

const facebookOptions = {
  clientID: config.facebook.appID,
  clientSecret: config.facebook.secret,
  callbackURL: `${serverUrl}${config.facebook.callbackURL}`,
  profileFields: [
    'id',
    'email',
    'gender',
    'profileUrl',
    'displayName',
    'locale',
    'name',
    'timezone',
    'updated_time',
    'verified',
    'picture.type(large)'
  ]
};

const jwtVerify = catchAsync(async (payload, done) => {
  if (payload.type !== tokenTypes.ACCESS) {
    throw new Error('Invalid token type');
  }
  const user = await User.findById(payload.sub);
  if (!user) {
    return done(null, false);
  }
  done(null, user);
});

const googleVerify = catchAsync(
  async (accessToken, refreshToken, profile, done) => {
    const oldUser = await User.findOne({ email: profile.email });

    if (oldUser) {
      return done(null, oldUser);
    }

    const newUser = await new User({
      provider: 'google',
      googleId: profile.id,
      username: `user${profile.id}`,
      email: profile.email,
      name: profile.displayName
    }).save();
    done(null, newUser);
  }
);

const facebookVerify = catchAsync(
  async (accessToken, refreshToken, profile, done) => {
    const oldUser = await User.findOne({ email: profile.emails[0].value });

    if (oldUser) {
      return done(null, oldUser);
    }

    // register user
    const newUser = await new User({
      provider: 'facebook',
      facebookId: profile.id,
      username: `user${profile.id}`,
      email: profile.emails[0].value,
      name: profile.displayName
    }).save();

    done(null, newUser);
  }
);

export const jwtLogin = new JWTStrategy(jwtOptions, jwtVerify);

export const googleLogin = new GoogleStrategy(googleOptions, googleVerify);

export const facebookLogin = new FacebookStrategy(
  facebookOptions,
  facebookVerify
);

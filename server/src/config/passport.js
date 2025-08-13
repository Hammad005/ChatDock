// config/passport.js
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          // Ensure profile field is always available
          if (existingUser.profile?.updated) {
            // Case 1: Profile is marked as updated, don't overwrite image
            existingUser.email = profile.emails[0].value;
          } else {
            // Case 2: Profile not updated, update everything including image
            existingUser.email = profile.emails[0].value;
            existingUser.profile = {
              imageId: null,
              imageUrl: profile.photos[0].value,
              updated: false, 
            };
          }

          await existingUser.save();
          return done(null, existingUser);
        }

        // ✅ Case 3: No user exists, create new
        const newUser = await User.create({
          googleId: profile.id,
          fullName: profile.displayName,
          email: profile.emails[0].value,
          profile: {
            imageId: null,
            imageUrl: profile.photos[0].value,
            updated: false,
          },
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
// import passport from "passport";
// import { Strategy } from "passport-local";
// import bcrypt from "bcryptjs";
// import User from "../models/userModel.js";

// // Sign In
// // passport.use(
// //   "signin",
// //   new Strategy({ usernameField: "email" }, async (email, password, done) => {
// //     try {
// //       const user = await User.findOne({ email }).select("+password");

// //       if (!user) {
// //         return done(null, false, { message: "Incorrect email or password" });
// //       }

// //       const isMatch = await bcrypt.compare(password, user.password);
// //       if (!isMatch) {
// //         return done(null, false, { message: "Incorrect email or password" });
// //       }

// //       return done(null, user);
// //     } catch (err) {
// //       return done(err);
// //     }
// //   })
// // );

// passport.use(
//   "signin",
//   new Strategy(
//     { usernameField: "email", passwordField: "password" },
//     async (email, password, done) => {
//       try {
//         const user = await User.findOne({ email }).select("+password");

//         if (!user) {
//           return done(null, false, { message: "Incorrect email or password" });
//         }

//         if (password !== user.password) {
//           return done(null, false, { message: "Incorrect email or password" });
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// // Sign Up
// // passport.use(
// //   "signup",
// //   new Strategy(
// //     { usernameField: "email", passReqToCallback: true },
// //     async (req, email, password, done) => {
// //       try {
// //         let user = await User.findOne({ email });

// //         if (user) {
// //           return done(null, false, { message: "Email is already registered" });
// //         }

// //         const hashedPassword = await bcrypt.hash(password, 12);

// //         user = await User.create({
// //           name: req.body.name,
// //           email,
// //           password: hashedPassword,
// //         });

// //         return done(null, user);
// //       } catch (err) {
// //         return done(err);
// //       }
// //     }
// //   )
// // );s

// passport.use(
//   "signup",
//   new Strategy(
//     { usernameField: "email", passReqToCallback: true },
//     async (req, email, password, done) => {
//       try {
//         console.log("✅ Request Body:", req.body);

//         const { name, username, passwordConfirmation } = req.body;

//         let user = await User.findOne({ email });
//         if (user) {
//           return done(null, false, { message: "Email is already registered" });
//         }

//         user = await User.findOne({ username });
//         if (user) {
//           return done(null, false, { message: "Username is already taken" });
//         }

//         if (password !== passwordConfirmation) {
//           return done(null, false, { message: "Passwords do not match" });
//         }

//         user = await User.create({
//           name,
//           username,
//           email,
//           password,
//           passwordConfirmation,
//         });

//         return done(null, user);
//       } catch (err) {
//         console.error("Signup Error:", err);
//         return done(err);
//       }
//     }
//   )
// );

// export default passport;

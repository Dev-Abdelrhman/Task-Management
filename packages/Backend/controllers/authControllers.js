import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/userModel.js";
// import Role from "../models/roleModel";
// import Project from "../models/projectsModel";
// import { checkProjectPermission } from "../models/checkProjectPermission";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const signToken = function (id) {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (password !== user.password) {
    return done(null, false, {
      message: "Incorrect email or password",
    });
  }
  // if (!user || !(await user.correctPassword(password, user.password))) {
  //   return next(new AppError("Incorrect email or password", 401));
  // }
  createSendToken(user, 200, res);
});

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleAuthCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, user) => {
      if (err || !user) {
        return res
          .status(401)
          .json({ status: "error", message: "Authentication failed" });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return res
            .status(500)
            .json({ status: "error", message: "Login failed" });
        }
        return res.redirect("/depiV1/projects"); // Redirect user after successful login
      });
    }
  )(req, res, next);
};
const blacklist = new Set();

const logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  blacklist.add(token); // Add token to the blacklist

  res.status(200).json({ message: "Logged out successfully" });
};

const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in.", 401));
  }

  // 🚨 Check if token is blacklisted
  if (blacklist.has(token)) {
    return next(new AppError("Session expired. Please log in again.", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User no longer exists.", 401));
  }

  req.user = currentUser;
  next();
});

const isOwner = (Model, ownerField = "owner") =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError(`${Model.modelName} not found`, 404));
    }

    if (doc[ownerField].toString() !== req.user.id) {
      return next(
        new AppError("You are not authorized to modify this resource", 403)
      );
    }

    next();
  });

export { signin, signup, googleAuth, googleAuthCallback, protect, logout };

// const authorizeProjectAction = (requiredPermission) => {
//   return async (req, res, next) => {
//     const userId = req.user.id;
//     const { projectId } = req.params;

//     const hasPermission = await checkProjectPermission(
//       userId,
//       projectId,
//       requiredPermission
//     );
//     if (!hasPermission) {
//       return res.status(403).json({ message: "Access Denied" });
//     }

//     next();
//   };
// };

// import { Strategy } from "passport-local";
// import GoogleStrategy from "passport-google-oauth2";
// const protect = async (req, res) => {
//   if (req.isAuthenticated()) {
//     try {
//       //{placeholder}
//     } catch (err) {
//       console.log(err);
//     }
//   } else {
//     res.redirect("/login");
//   }
// };

// // Google Oauth return callback scope of the user
// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// app.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   })
// );

// app.post("/register", async (req, res) => {
//   const email = req.body.username;
//   const password = req.body.password;

//   try {
//     const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
//       email,
//     ]);

//     if (checkResult.rows.length > 0) {
//       req.redirect("/login");
//     } else {
//       bcrypt.hash(password, saltRounds, async (err, hash) => {
//         if (err) {
//           console.error("Error hashing password:", err);
//         } else {
//           const result = await db.query(
//             "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
//             [email, hash]
//           );
//           const user = result.rows[0];
//           req.login(user, (err) => {
//             //   console.log("success");
//             res.redirect("/secrets");
//           });
//         }
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// // Passport local strategy
// passport.use(
//   "local",
//   new Strategy(async function verify(username, password, cb) {
//     //
//     try {
//       const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
//         username,
//       ]);
//       if (result.rows.length > 0) {
//         const user = result.rows[0];
//         const storedHashedPassword = user.password;
//         bcrypt.compare(password, storedHashedPassword, (err, valid) => {
//           if (err) {
//             console.error("Error comparing passwords:", err);
//             return cb(err);
//           } else {
//             if (valid) {
//               return cb(null, user);
//             } else {
//               return cb(null, false);
//             }
//           }
//         });
//       } else {
//         return cb("User not found");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   })
// );

// passport.use(
//   "google",
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google/secrets",
//       userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//       try {
//         console.log(profile);
//         const result = await db.query("SELECT * FROM users WHERE email = $1", [
//           profile.email,
//         ]);
//         if (result.rows.length === 0) {
//           const newUser = await db.query(
//             "INSERT INTO users (email, password) VALUES ($1, $2)",
//             [profile.email, "google"] // password is just a placeholder
//           );
//           return cb(null, newUser.rows[0]);
//         } else {
//           return cb(null, result.rows[0]);
//         }
//       } catch (err) {
//         return cb(err);
//       }
//     }
//   )
// );

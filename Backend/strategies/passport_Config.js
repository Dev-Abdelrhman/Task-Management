import session from "express-session";
import passport from "./google_Strategy.js";
import MongoStore from "connect-mongo";
import User from "../models/userModel.js";

/*Import all Strategy*/
// import "./local_Strategy.js";
/*----------------------------------------*/
const pConfig = (app, DB) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: DB,
        autoReconnect: true,
        useUnifiedTopology: true,
      }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export default pConfig;

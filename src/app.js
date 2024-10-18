const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const discordAuthRouter = require("./routes/discordAuthRoute");
const userRouter = require("./routes/userRoute");
const guildRouter = require("./routes/guildRoute");
const globalErrorMiddleware = require("./controllers/errorController");
const AppError = require("./utils/appError");
const { protect } = require("./controllers/authController");

// create an application
const app = express();

const { NODE_ENV, ALLOWED_ORIGINS, BASE_URL } = process.env;

// 1) GLOBAL MIDDLEWARES
if (NODE_ENV === "development") app.use(morgan("dev"));

// setting cors, cross site requests can then access our api by allowing origin and setting creds true we can receive and set cookies
const corsOptions = {
  origin: ALLOWED_ORIGINS.split(","),
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors());

// returns a function acting as middleware to parse application/json bodies
app.use(express.json());
app.use(cookieParser());

// 2) Routes
app.use(`${BASE_URL}/auth/discord`, discordAuthRouter);
app.use(protect); // populates req.dbUser and req.discordUser
app.use(`${BASE_URL}/users`, userRouter);
app.use(`${BASE_URL}/guilds`, guildRouter);

// can use app.all(*) as well but .use() makes more sense since .all works for a specific route say /test but use would work with /test/23 as well
// synchronouse code, if throws error, will be sent to error middleware. A promise returning fuunction that rejects promise also forwards error
app.use((req) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
});

// this will be called whenever an error is thrown to next(err) or any other normal error
app.use(globalErrorMiddleware);

module.exports = app;

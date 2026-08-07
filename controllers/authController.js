import {
  login,
  signup
} from "../services/authService.js";

export function showSignup(req, res) {
  res.render("auth/signup", {
    error: null,
    username: ""
  });
}

export async function handleSignup(req, res) {
  try {
    const user = await signup(
      req.body.username,
      req.body.password
    );

    req.session.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role
    };

    res.redirect("/");
  } catch (error) {
    res.status(400).render("auth/signup", {
      error: error.message,
      username: req.body.username ?? ""
    });
  }
}

export function showLogin(req, res) {
  res.render("auth/login", {
    error: null,
    username: ""
  });
}

export async function handleLogin(req, res) {
  try {
    const user = await login(
      req.body.username,
      req.body.password
    );

    req.session.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role
    };

    res.redirect("/");
  } catch (error) {
    res.status(401).render("auth/login", {
      error: error.message,
      username: req.body.username ?? ""
    });
  }
}

export function handleLogout(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid");
    return res.redirect("/login");
  });
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000,
};

export default function createAuthController(authService) {
  async function register(req, res) {
    const { user, token } = await authService.register(req.body);
    res.cookie("token", token, { ...COOKIE_OPTIONS });
    res.status(201).send({ success: true, data: { user } });
  }

  async function login(req, res) {
    const { user, token } = await authService.login(req.body);
    res.cookie("token", token, { ...COOKIE_OPTIONS });
    res.send({ success: true, data: { user } });
  }

  async function me(req, res) {
    const user = await authService.me(req.user.id);
    res.send({ success: true, data: { user } });
  }

  return { register, login, me };
}

export default function createAuthController(authService) {
  async function register(req, res) {
    const { user, token } = await authService.register(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.status(201).send({ success: true, user, token });
  }

  async function login(req, res) {
    const { user, token } = await authService.login(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.send({ success: true, user, token });
  }

  async function me(req, res) {
    res.send(req.user);
  }

  return { register, login, me };
}

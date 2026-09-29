export default function createAuthController(authService) {
  async function register(req, res) {
    const { user, token } = await authService.register(req.body);
    res.status(201).send({ success: true, user, token });
  }

  async function login(req, res) {
    const { user, token } = await authService.login(req.body);
    res.send({ success: true, user, token });
  }

  async function me(req, res) {
    res.send({ user: req.user });
  }

  return { register, login, me };
}

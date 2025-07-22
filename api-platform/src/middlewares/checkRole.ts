export function checkRole(expectedRoles: string[]) {
  return (req, res, next) => {
    const user = req.user;

    if (!user.roles || !expectedRoles.some(role => user.roles.includes(role))) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
} 
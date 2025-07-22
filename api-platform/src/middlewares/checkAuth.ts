const hier = ["ROLE_USER","ROLE_ADMIN"]


export function checkRole(expectedRole: string) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.roles || !user.roles.includes(expectedRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
}
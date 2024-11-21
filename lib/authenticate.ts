export const authenticate = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (
    authHeader !==
    `Bearer dev.r3V#6mLdsafa24#543@#49g3cQ7Y0sB4FzH1oY8Ue8vds$2f^734tsd.dev`
  ) {
    return false;
  }
  return true;
};

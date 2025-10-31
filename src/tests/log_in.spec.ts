import { getUser, login, signUp } from "../../helper/user";

describe("LOGIN", () => {
  const user = getUser("admin");
  it("should signup, and login", async () => {
    try {
      // Sign up the user function
      const res = await signUp(user);
      expect(res.status).toBe(201);

      const loginRes = await login(user);
      expect(loginRes.status).toBe(200);
      console.log(loginRes.body);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
  it("should signup, and login using .then()", () => {
    // Sign up the user function
    return signUp(user)
      .then((res) => {
        console.log(res.body);
        expect(res.status).toBe(201);
        expect(res.body.data.user.email).toBe(user.email.toLowerCase());
        expect(res.body.status).toBe("success");
        return login(user);
      })
      .then((loginRes) => {
        console.log(loginRes.body, "login");
        expect(loginRes.status).toBe(200);
        expect(loginRes.body.data.user.email).toBe(user.email.toLowerCase());
        expect(loginRes.body.status).toBe("success");
      });
  });
  it("should signup, and login using .end()", (done) => {
    // Sign up the user function
    signUp(user).end((err, res) => {
      if (err) return done(err);
      expect(res.body.data.user.email).toBe(user.email.toLowerCase());
      expect(res.body.status).toBe("success");
      login(user).end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.user.email).toBe(user.email.toLowerCase());
        expect(res.body.status).toBe("success");
      });
      done();
    });
  });
});


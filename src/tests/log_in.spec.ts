import { getUser, login, signUp } from "../../helper/user";

import * as supertest from "supertest"

const request = supertest("http://localhost:8001/api/v1/users")

interface User{
  userId?: string;
  username?: string;
  name: string;
  email: string;
  role?: string;
  password: string;
  passwordConfirm: string;
}

function deleteUser(cookie:string){
  return request.delete('/deleteMe').set('Cookie', cookie)
}

describe("LOGIN", () => {
  const user: User = getUser("admin");
  let cookie: string
  it("should signup, and login", async () => {
    try {
      // Sign up the user function
      const res = await signUp(user);
      expect(res.status).toBe(201);

      const loginRes = await login(user);
      expect(loginRes.status).toBe(200);
      console.log(loginRes.body);
      cookie = loginRes.headers['set-cookie'][0].split(',')[0];
      //delete user
      const deleteRes = await deleteUser(cookie);
      expect(deleteRes.status).toBe(200);
      const loginResAfterDelete = await login(user);
      expect(loginResAfterDelete.status).toBe(401);
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
        cookie = loginRes.headers['set-cookie'][0].split(',')[0];
        return deleteUser(cookie)
      })
      .then((deleteRes) => {
        expect(deleteRes.statusCode).toBe(200);
        expect(deleteRes.body.message).toBe("User deleted successfully");
        return login(user)
      })
      .then((loginResAfterDelete) => {
        expect(loginResAfterDelete.status).toBe(401);
        expect(loginResAfterDelete.body.message).toBe("Incorrect email or password");
      })
  });
  it.only("should signup, and login using .end()", (done) => {
    // Sign up the user function
    signUp(user).end((err, res) => {
      if (err) return done(err);
      expect(res.body.data.user.email).toBe(user.email.toLowerCase());
      expect(res.body.status).toBe("success");
      login(user).end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.user.email).toBe(user.email.toLowerCase());
        expect(res.body.status).toBe("success");
        cookie= res.headers['set-cookie'][0].split(',')[0];
        return deleteUser(cookie).end((err, deleteRes)=>{
          if (err) return done(err);
          expect(deleteRes.status).toBe(200);
          expect(deleteRes.body.message).toBe("User deleted successfully");
           return login(user).end((err, loginResAfterDelete)=>{
            if (err) return done(err);
            expect(loginResAfterDelete.status).toBe(401);
            expect(loginResAfterDelete.body.message).toBe("Incorrect email or password");
            done();
          });
        });
      });
      
    });
  });
});


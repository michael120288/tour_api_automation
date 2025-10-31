import * as supertest from 'supertest';
const request = supertest('http://localhost:8003/api/v1/users');//by default it is 8001

describe('USER SIGN UP NEGATIVE',() =>{
    it('should not create a new user if all fields are missing', async () => {
        const userData = {}
        console.log(userData,"userdata");
        try{
            const res = await request.post('/signup').send(userData)
            console.log(res.body,"response");
            expect(res.status).toBe(400);
            expect(res.body.error.status).toBe('fail');
            expect(res.body.error.statusCode).toBe(400);
            expect(res.body.error.message).toContain('Missing required fields: name, email, password, passwordConfirm');
        }catch(err){
            console.log("Error during user sign up:", err);
            throw err;
        }
    })
    it.only('should not create a new user if all fields are missing', async () => {
         const userData = {
                    email: "test@test.com",
                    password: "Pass1234",
                    passwordConfirm: "Pass1234"
                }
        console.log(userData,"userdata");
        try{
            const res = await request.post('/signup').send(userData)
            console.log(res.body,"response");
            expect(res.status).toBe(400);
            expect(res.body.status).toBeDefined()
            expect(res.body.error.status).toBe('fail');
            expect(res.body.error.statusCode).toBe(400);
            expect(res.body.message).toContain('Missing required fields: name');
        }catch(err){
            console.log("Error during user sign up:", err);
            throw err;
        }
    })
})
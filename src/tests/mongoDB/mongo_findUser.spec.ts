import { MongoClient, ObjectId } from "mongodb";
import { getUser, signUp } from "../../../helper/user";

const dotenv = require('dotenv');
dotenv.config();

describe('MongoDb Connection and Operation', () => {
    let connection
    let db;
    beforeAll(async () => {
        try {
            connection = await MongoClient.connect(process.env.DATABASE_URL);
            db = await connection.db();
        } catch (error) {
            console.log(error);
            throw error;
        }
    })
    afterAll(async () => {
        await connection.close();
    })
    it('find user using mongoDB query', async () => {
        const users = db.collection('users');
        //console.log(users, "users collection");
        const user = await users.findOne({name:"Natasha_Abbott"})
        console.log(user, "found user");
        expect(user.name).toBe("Natasha_Abbott");
    });
    it('create new user with imported data', async () => {
        const userImport = getUser("admin")
        console.log(userImport, "userImport data");

        try {
            const res = await signUp(userImport);
            expect(res.status).toBe(201);
            console.log(res.body, "signup response");
            const users = db.collection('users');
            const userData = await users.findOne({name: userImport.name});
            console.log(userData, "userData from DB");
            if(!userData){
                throw new Error("User not found in DB");
            }
            expect(userData.name).toBe(userImport.name);
            expect(userData.email).toBe(userImport.email.toLowerCase());
            expect(userData.role).toBe("admin");
            expect(userData._id.toString()).toEqual(res.body.data.user._id)
            let deleteData = await users.deleteOne({_id: new ObjectId(userData._id)});
            console.log(deleteData, "deleteData");
            let findUser = await users.findOne({_id:userData._id});
            console.log(findUser, "findUser after delete");
            expect(findUser).toBeNull();
        } catch (error) {
            console.log(error);
            throw new Error(`Error during user creation test: ${error}`);
        }
    })
});
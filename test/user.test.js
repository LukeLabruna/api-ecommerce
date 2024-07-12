const mongoose = require("mongoose")
const assert = require('assert')
// const chai = import("chai")
// const expect = chai.expect
const configObj = require("../src/config/env.config.js")
const { USER_MONGO, PASSWORD_MONGO, DB_MONGO } = configObj

const UserRepository = require("../src/repository/userRepository.js")

describe("Testing User", () => {
  before(() => {
    mongoose.connect(`mongodb+srv://${USER_MONGO}:${PASSWORD_MONGO}@cluster0.ud53fbh.mongodb.net/${DB_MONGO}?retryWrites=true&w=majority&appName=Cluster0`)
    this.userRepository = new UserRepository()
  })

  beforeEach(async () => {
    await mongoose.connection.collections.users.drop();
  })

  it("Create User", async () => {
    // this.timeout(5000)
    const newUser = {
      first_name: "some first name",
      last_name: "some last name",
      email: "some@email.com",
      password: "somePasword",
      age: 99
    }

    const result = await this.userRepository.createUser(newUser)
    assert.ok(result._id);
  })

  it("Read User By Email", async () => {
    // this.timeout(5000)
    const newUser = {
      first_name: "some first name",
      last_name: "some last name",
      email: "some@email.com",
      password: "somePasword",
      age: 99
    }

    await this.userRepository.createUser(newUser)

    const userByEmail = await this.userRepository.readUserByEmail(newUser.email)
    assert.ok(userByEmail._id)
  })

  it("User Valid Password", async () => {
    // this.timeout(5000)
    const newUser = {
      first_name: "some first name",
      last_name: "some last name",
      email: "some@email.com",
      password: "somePasword",
      age: 99
    }

    const user = await this.userRepository.createUser(newUser)

    const userValidPassword = await this.userRepository.userValidPassword(`${user.email}`, newUser.password)
    assert.ok(userValidPassword._id)
  })

  after((done) => {
    mongoose.connection.close();
    done();
  })
}
)
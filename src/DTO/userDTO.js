class UserDTO {
  constructor(firstName, lastName, age, email, cartId) {
      this.name = `${firstName} ${lastName}`;
      this.email= email;
      this.age= age;
      this.cartId= cartId;
  }
}

module.exports = UserDTO;
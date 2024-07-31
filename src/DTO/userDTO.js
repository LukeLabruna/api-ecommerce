class UserDTO {
  constructor(firstName, lastName, age, email, cartId, role, id) {
      this.name = `${firstName} ${lastName}`;
      this.email= email;
      this.age= age;
      this.cartId= cartId;
      this.role= role;
      this.id= id;
  }
}

module.exports = UserDTO
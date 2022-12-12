const UsersRepository = require("../repositories/users.repository");
const jwt = require("jsonwebtoken");

class UsersService {
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  signUp = async (nickname, password) => {
    const findUser = await this.usersRepository.findUser(nickname);
    if (findUser) throw new Error("Nickname already exists");

    await this.usersRepository.signUp(nickname, password);

    return findUser;
  };

  login = async (nickname, password) => {
    const findUser = await this.usersRepository.findUser(nickname);
    if (!findUser) throw new Error("Users doesn't exist");
    else if (findUser) {
      if (findUser.password === password) {
        console.log(findUser)
        const token = jwt.sign({ userId: findUser.userId }, process.env.SECRET, {
          expiresIn: 60 * 60 * 60,
        });
        return token
      }
    }
  };
}

module.exports = UsersService;

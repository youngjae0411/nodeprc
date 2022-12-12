const { Op } = require("sequelize");
const { User } = require("../models");
class UsersRepository {
  findUser = async (nickname) => {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ nickname}],
      },
    });
    return user
  }

  signUp = async (nickname, password) =>{
    console.log(nickname, password)
    await User.create({
      nickname,
      password
    });
  }
}

module.exports = UsersRepository;

const LikesRepository = require("../repositories/likes.repositories");
const PostsRepository = require("../repositories/posts.repository");

class LikesService {
  constructor() {
    (this.likesRepository = new LikesRepository()),
    (this.postsRepository = new PostsRepository());
  }

  updateLike = async (Id, userId) => {
    const post = await this.postsRepository.findOnePost(Id);
    if (post.length === 0) throw new Error("Post doesn't exist");

    const like = await this.likesRepository.findLike(Id, userId);

    if(!like){
      await this.likesRepository.createLike(Id, userId);
    } else if(like) {
      await this.likesRepository.deleteLike(Id, userId);
    }

    return like
  };

  findLike = async (userId) => {
    const like = await this.likesRepository.findLikes(userId);
  
    console.log(like)

    const result = await Promise.all(
      like.map(async (posts) => {
        const {postId, userId, createdAt} = posts
        const count = await this.likesRepository.countLike(postId)

        return {
          postId: postId,
          userId: userId,
          nickname: posts.User.nickname,
          title: posts.Post.title,
          createdAt: createdAt,
          like: count,
        };
      })
    );

    let data =result.sort(function (a, b) {
      return b.like - a.like;
    });
    return data

  }
}

module.exports = LikesService;

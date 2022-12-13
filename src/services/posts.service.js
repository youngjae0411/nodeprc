const PostsRepository = require("../repositories/posts.repository");
const LikesRepository = require("../repositories/likes.repositories");

class PostsService {
  constructor() {
    (this.postsRepository = new PostsRepository()),
      (this.likesRepository = new LikesRepository());
  }

  findAllPosts = async () => {
    const posts = await this.postsRepository.findAllPosts();
    if (posts.length === 0) throw new Error("Post doesn't exist");

    return Promise.all(
      posts.map(async (post) => {
        const { postId, userId, title, createdAt, updatedAt } = post;
        const count = await this.likesRepository.countLike(postId);

        return {
          postId: postId,
          userId: userId,
          nickname: post.User.nickname,
          title: title,
          like: count,
          createdAt: createdAt,
          updatedAt: updatedAt,
        };
      })
    );
  };

  findOnePost = async (Id) => {
    const post = await this.postsRepository.findOnePost(Id);
    if (post.length === 0) throw new Error("Post doesn't exist");

    return await Promise.all(
      post.map(async (post) => {
        const { postId, userId, title, content, createdAt, updatedAt } = post;
        const count = await this.likesRepository.countLike(postId);

        return {
          postId: postId,
          userId: userId,
          nickname: post.User.nickname,
          title: title,
          content: content,
          like: count,
          createdAt: createdAt,
          updatedAt: updatedAt,
        };
      })
    );
  };

  createPost = async (title, content, userId, nickname) => {
    await this.postsRepository.createPost({
      title,
      content,
      userId,
      nickname,
    });
  };

  updatePost = async (Id, title, content) => {
    const post = await this.postsRepository.findOnePost(Id);
    if (post.length === 0) throw new Error("Post doesn't exist");

    const updatePost = await this.postsRepository.updatePost(
      Id,
      title,
      content
    );

    return post, updatePost;
  };

  deletePost = async (Id) => {
    const post = await this.postsRepository.findOnePost(Id);
    if (post.length === 0) throw new Error("Post doesn't exist");

    await this.postsRepository.deletePost(Id);

    return post;
  };
}

module.exports = PostsService;

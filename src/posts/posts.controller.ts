import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePost.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post()
  createPost(@Body() { userId, ...createPostData }: CreatePostDto) {
    return this.postService.createPost(userId, createPostData);
  }
}

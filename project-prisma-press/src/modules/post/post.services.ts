import { prisma } from "../../lib/prisma";
import { IcreatePostPayload } from "./post.interface";

const getAllPostFromDB = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return posts;
};

const getPostsWithStatsFromDB = async () => {};

const getMyPostsFromDB = async (authorId: string) => {
  const post = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return post;
};

const getSinglePostFromDB = async (postId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return updatedPost;
};

const createPostIntoDB = async (
  payload: IcreatePostPayload,
  userId: string,
) => {
  console.log("PAYLOAD:", payload);
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const updatePostIntoDB = async (id: number) => {};

const deletePostFromDB = async (id: number) => {};

export const postService = {
  getAllPostFromDB,
  getPostsWithStatsFromDB,
  getMyPostsFromDB,
  getSinglePostFromDB,
  createPostIntoDB,
  updatePostIntoDB,
  deletePostFromDB,
};

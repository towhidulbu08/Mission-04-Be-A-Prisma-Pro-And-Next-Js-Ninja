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

const getMyPostsFromDB = async () => {};

const getSinglePostFromDB = async (id: number) => {};

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

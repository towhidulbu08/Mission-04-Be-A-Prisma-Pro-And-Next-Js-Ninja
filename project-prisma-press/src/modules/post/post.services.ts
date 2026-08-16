import { CommentStatus, PostStatus } from "../../../generated/prisma/browser";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  IcreatePostPayload,
  IPostQuery,
  IUpdatePostPayload,
} from "./post.interface";

const getAllPostFromDB = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy ? query.sortBy : "createdAt";

  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const tags = query.tags ? JSON.parse(query.tags as string) : null;
  const tagsArray = Array.isArray(tags) ? tags : [];

  const andConditions: PostWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.title) {
    andConditions.push({ title: query.title });
  }

  if (query.content) {
    andConditions.push({
      content: query.content,
    });
  }

  if (query.authorId) {
    andConditions.push({
      authorId: query.authorId,
    });
  }
  if (query.isFeatured) {
    andConditions.push({
      isFeatured: Boolean(query.isFeatured),
    });
  }
  if (query.tags) {
    andConditions.push({
      tags: {
        hasSome: tagsArray,
      },
    });
  }
  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }
  const posts = await prisma.post.findMany({
    //*filtering/exact match wihout AND operator
    // where: {
    //   title: "My third Post",
    //   content: "Ronaldo",
    // },

    //* //*filtering/exact match with AND operator
    // where: {
    //   AND: [
    //     {
    //       title: "My third Post",
    //     },
    //     {
    //       content: "Ronaldo",
    //     },
    //     {
    //       tags: {
    //         has: "prisma",
    //       },
    //     },
    //   ],
    // },

    //? searching/partial match

    // where: {
    //   title: {
    //     contains: "ronaldo",
    //     mode: "insensitive",
    //   },
    //   //? not ideal for partial match
    // content: {
    //   contains: "ronaldo",

    // },
    // },
    //? searching/partial Match with OR operators
    // where: {
    //   OR: [
    //     {
    //       title: {
    //         contains: "Ron",
    //         mode: "insensitive",
    //       },
    //     },
    //     {
    //       content: {
    //         contains: "Ro",
    //         mode: "insensitive",
    //       },
    //     },
    //   ],
    // },

    //? combining search (OR operator) and filtering(AND operator)
    // where: {
    //filtering & searching combined
    //   AND: [
    //     //? searching
    //     {
    //       OR: [
    //         {
    //           title: {
    //             contains: "Ron",
    //             mode: "insensitive",
    //           },
    //         },
    //         {
    //           content: {
    //             contains: "Ron",
    //             mode: "insensitive",
    //           },
    //         },
    //       ],
    //     },
    //     //?filtering
    //     {
    //       title: "Ronaldo Nazario",
    //     },
    //     {
    //       content: "Ronaldo",
    //     },
    //   ],
    // },

    //? Pgination with (limit or take) and (skip or page)
    //take: 1,
    //take: 2,
    //for first page skip is 0
    //skip: 1, //visiting page 2
    //skip: 2, //visiting page 3
    // page=4, limit/take =1 =>skip:(page-1)*limit
    // page=3, limit/take=10, skip:(page-1)*limit=(3-1)*10=20
    // skip: 2, //visiting page 4

    //? sorting in ascending or descending order on specific fields
    // orderBy: {
    //   createdAt: "desc",
    //   title: "desc",
    //   content: "desc",
    // },

    //? dynamic searching, filtering
    // where: {
    //   AND: [
    //     query.searchTerm
    //       ? {
    //           OR: [
    //             {
    //               title: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //             {
    //               content: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //           ],
    //         }
    //       : {},

    //     //title filtering

    //     query.title ? { title: query.title } : {},
    //     //content filtering
    //     query.content
    //       ? {
    //           content: query.content,
    //         }
    //       : {},
    //   ],
    // },

    where: {
      AND: andConditions,
    },
    //? dynamic pagination and sorting
    take: limit,
    skip,
    orderBy: {
      //sortBy:sortOrder
      [sortBy]: sortOrder,
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

  return posts;
};

const getPostsStatsFromDB = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPosts = await tx.post.count();

    // const totalPublishedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.PUBLISHED,
    //   },
    // });
    // const totalDraftPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT,
    //   },
    // });

    // const totalArchivedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVED,
    //   },
    // });

    // const totalComments = await tx.comment.count();

    // const totalApprovedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.APPROVED,
    //   },
    // });
    // const totalRejectedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.REJECT,
    //   },
    // });
    // Not a Good Approach
    // const allPosts = await tx.post.findMany();

    // let totalPostViews = 0;

    // allPosts.forEach((post) => {
    //   totalPostViews += post.views;
    // });

    const aggregations = await tx.post.aggregate({
      _sum: {
        views: true,
      },
    });

    const totalPostViews = aggregations._sum.views;

    const [
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
    ] = await Promise.all([
      tx.post.count(),
      tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      tx.comment.count(),
      tx.comment.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      tx.comment.count({
        where: {
          status: CommentStatus.REJECT,
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublishedPosts,
      totalArchivedPosts,
      totalDraftPosts,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViews,
    };
  });
  return transactionResult;
};

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
  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });

  // const post = await prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: {
  //       where: {
  //         status: CommentStatus.APPROVED,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     },
  //     _count: {
  //       select: {
  //         comments: true,
  //       },
  //     },
  //   },
  // });

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    // throw new Error("Fake Error");
    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
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
  });
  return transactionResult;
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

const updatePostIntoDB = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};

const deletePostFromDB = async (
  postId: string,

  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post");
  }

  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const postService = {
  getAllPostFromDB,
  getPostsStatsFromDB,
  getMyPostsFromDB,
  getSinglePostFromDB,
  createPostIntoDB,
  updatePostIntoDB,
  deletePostFromDB,
};

const getAllPostFromDB = async () => {};

const getCommentsWithStatsFromDB = async () => {};
const getMyCommentsFromDB = async () => {};
const getSingleCommentFromDB = async (id: number) => {};
const createCommentIntoDB = async (payload: string) => {};
const updateCommentIntoDB = async (id: number) => {};
const deleteCommentFromDB = async (id: number) => {};

export const commentService = {
  getAllPostFromDB,
  getCommentsWithStatsFromDB,
  getMyCommentsFromDB,
  getSingleCommentFromDB,
  createCommentIntoDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
};

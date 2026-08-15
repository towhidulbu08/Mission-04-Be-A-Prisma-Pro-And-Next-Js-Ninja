import { PostStatus } from "../../../generated/prisma/browser";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface IcreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags: string[];
}

export interface IUpdatePostPayload {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags?: string[];
}

export interface IPostQuery extends PostWhereInput {
  // title?: string;
  // content?: string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
  searchTerm?: string;
}

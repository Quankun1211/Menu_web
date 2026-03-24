type UserRecord = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    avatar: string;
    classId: string;
}

export type MetaResponse = {
    total: number;
    page: number;
    limit: number;
}

export type PaginationResponse<T> = {
    success: boolean;
    data: T[];
    meta: {
        total: number;
        page: number;
        pages: number;
    };
};
export type NotificationResponse = {
  _id: string,
  userId: string,
  title: string,
  body: string,
  type: string,
  image: string,
  isRead: boolean,
  createdAt: string
}
export type SearchProductResponse = {
  _id: string;
  name: string;
  price: number;
  images: string;
  origin: string;
  categoryId: {
    _id: string;
    name: string;
  };
  soldCount: number;
};
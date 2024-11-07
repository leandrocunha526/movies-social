export interface Review {
    user: {
        name: string,
        id: number;
    }
    id: number;
    movieId: number;
    userId: number;
    rating: number;
    comment?: string;
}

export type HierarchyType = 'category' | 'field' | 'chapter' | 'topic' | 'subtopic';

export interface Hierarchy {
    id: string;
    user_id: string;
    parent_id: string | null;
    name: string;
    type: HierarchyType;
    created_at: string;
}

export type CardType = 'flashcard' | 'video';

export interface Card {
    id: string;
    user_id: string;
    hierarchy_id: string;
    question: string;
    answer: string;
    type: CardType;
    video_url?: string;
    created_at: string;
}

export interface CardProgress {
    id: string;
    user_id: string;
    card_id: string;
    interval: number;
    ease_factor: number;
    due_date: string;
    last_reviewed?: string;
}

export interface Review {
    id: string;
    user_id: string;
    card_id: string;
    rating: number; // 0-5
    reviewed_at: string;
}

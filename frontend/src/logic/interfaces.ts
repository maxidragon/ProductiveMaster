export interface Note {
    id: number;
    title: string;
    description: string;
};

export interface Goal {
    id: number;
    title: string;
    deadline: Date;
    is_achieved: boolean;
}
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
};

export interface Project {
    id: number;
    title: string;
    description: string;
    status: string;
    github?: string;
};
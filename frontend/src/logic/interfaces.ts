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
    num_tasks_todo?: number;
    num_tasks_in_progress?: number;
    num_tasks_done?: number;
};

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    issue?: string;
    pull_request?: string;
    project: Project;
};

export interface Activity {
    id: number;
    title: string;
    description: string;
    start_time: Date;
    end_time: Date;
};
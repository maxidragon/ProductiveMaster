export interface Note {
    id: number;
    title: string;
    description: string;
};

export interface Goal {
    id: number;
    title: string;
    description: string;
    deadline: Date;
    is_achieved: boolean;
    goal_category?: GoalCategory;
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
    description?: string;
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

export interface GoalCategory {
    id: number;
    title: string;
};

export interface UserSettings {
    id: number;
    email: string;
    username: string;
};

export interface UserData {
    github_profile?: string;
    wakatime_api_key?: string;
    gprm_stats?: string;
    gprm_streak?: string;
    gprm_languages?: string;
};
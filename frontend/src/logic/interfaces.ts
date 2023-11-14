export interface Note {
  id: number;
  title: string;
  description: string;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  is_achieved: boolean;
  goal_category?: GoalCategory;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  github?: string;
  num_tasks_todo?: number;
  num_tasks_in_progress?: number;
  num_tasks_done?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  high_priority: boolean;
  issue?: string;
  assignee?: number;
  pull_request?: string;
  project: Project;
  owner: number;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface TaskForProject {
  id: number;
  title: string;
  description?: string;
  status: string;
  owner: PublicUser;
  assignee: PublicUser;
  high_priority: boolean;
  issue?: string;
  pull_request?: string;
  project: Project;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
}

export interface GoalCategory {
  id: number;
  title: string;
}

export interface UserSettings {
  id: number;
  email: string;
  username: string;
}

export interface UserData {
  github_profile?: string;
  wakatime_api_key?: string;
  gprm_stats?: string;
  gprm_streak?: string;
  gprm_languages?: string;
}

export interface Timezone {
  id: number;
  name: string;
  display_name: string;
}

export interface CreateGoal {
  title: string;
  description: string;
  deadline_string: string;
  deadline?: Date;
  goal_category?: number;
}

export interface EditGoal {
  id: number;
  title: string;
  description: string;
  is_achieved: boolean;
  deadline: Date;
  goal_category?: number;
}

export interface Document {
  id: number;
  title: string;
  url: string;
  owner: PublicUser;
  project: number;
  created_at: Date;
  updated_at: Date;
}

export interface LearningType {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  learning_category: LearningCategory;
  owner: number;
}
export interface LearningCategory {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface LearningResource {
  id: number;
  title: string;
  url: string;
  created_at: Date;
  updated_at: Date;
  learning: number;
  owner: number;
}

export interface LearningResourceWithCategory {
  id: number;
  title: string;
  url: string;
  created_at: Date;
  updated_at: Date;
  learning: LearningType;
  owner: number;
}

export interface RecentProject {
  id: number;
  title: string;
  updated_at: Date;
}

export interface RecentLearning {
  id: number;
  title: string;
  updated_at: Date;
}

export interface ProjectStats {
  id: number;
  title: string;
  owner: number;
  github: string;
  total_code_lines: number;
  num_tasks_todo: number;
  num_tasks_in_progress: number;
  num_tasks_done: number;
  num_tasks_done_last_week: number;
  num_tasks_done_last_month: number;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: number;
  username: string;
}

export interface ProjectParticipant {
  id: number;
  project: number;
  user: PublicUser;
  added_by: PublicUser;
  is_owner: boolean;
  created_at: Date;
  updated_at: Date;
}
export interface UpdateProjectParticipant {
  id: number;
  project: number;
  user: number;
  added_by: number;
  is_owner: boolean;
  created_at: Date;
  updated_at: Date;
}

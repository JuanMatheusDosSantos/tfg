export interface AdminLog {
  id: number;
  action: string;
  affected_table: string;
  old_value: string;
  new_value: string;
  user_id: number;
  user?: { id: number; name: string; email: string; };
  created_at: string;
}

export type FileItem = {
  id: string;                     
  file_id: string;
  user_id: string;
  title: string;
  description: string | null;
  slug: string;
  price: number;
  original_url: string;        
  preview_url: string;
  created_at: string | null;
  updated_at: string | null;
  is_private: boolean | null;
  expire_at: string | null;
  parent_file_id: string | null;
};

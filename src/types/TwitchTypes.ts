export interface UserData {
  id:                string;
  login:             string;
  display_name:      string;
  broadcaster_type:  string;
  description:       string;
  profile_image_url: string;
  role?:             string;
}
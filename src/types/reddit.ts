export interface Subreddit {
  id: string
  name: string
  description: string
  subscribers: number
  created: string
  url: string
  icon_img: string
  advertiser_category: string
  submit_text: string
  subreddit_type: string
  banner_background_image: string
}

export interface Thread {
  id: string
  title: string
  author: string
  subreddit: string
  upvotes: number
  comments: number
  flair: string
  postUrl: string
}


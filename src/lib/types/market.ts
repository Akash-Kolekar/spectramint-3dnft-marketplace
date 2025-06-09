export interface MarketItem {
  name: string;
  description: string;
  image: string;
  created_by: string;
  owned_by: string;
  model_extension: string;
  attributes: {
    background_color: string;
  };
  price: string;
  model_url: string;
  created_at: string;
  model_id: string;
  isSelling: boolean;
}

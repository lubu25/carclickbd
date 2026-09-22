export interface IBusinessSlider {
  _id: string | any;
  image: string | any;
  title: string;
  subTitle: string;
  learnMoreLink: string;
}

export type IHeaderCarouselSlide = {
  _id?: string;
  slideTitle: string;
  slideText: string;
  slideButton: { label: string; link: string };
  slideBanner: string;
};

export interface IHeaderSliderResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IHeaderCarouselSlide;
}

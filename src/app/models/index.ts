export interface PexelsSearchResponse {
	page: number;
	per_page: number;
	photos: any[];
	total_results: number;
}

export interface PexelsSrcMap {
	landscape: string; 
	large: string;
	large2x: string;
	medium: string;
	original: string;
	portrait: string;
	small: string;
	tiny: string;
}

export interface PexelsPhoto {
	id: number;
	avg_color: string; // hex code
	height: number;
	width: number;
	liked: boolean;
	photographer: string;
	photographer_id: number;
	photographer_url: string;
	src: PexelsSrcMap;
	url: string;
}
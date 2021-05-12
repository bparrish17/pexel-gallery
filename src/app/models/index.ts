import { SafeUrl } from "@angular/platform-browser";

export interface PexelsSearchResponse {
	page: number;
	per_page: number;
	photos: PexelsPhoto[];
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
	avg_color: string; // hex code e.g. #ff0000
	height: number;
	width: number;
	liked: boolean;
	photographer: string; // photographer name
	photographer_id: number;
	photographer_url: string;
	src: PexelsSrcMap;
	url: string | SafeUrl;
}

export interface Photo extends PexelsPhoto {
	galleryUrl: SafeUrl;
	expandedUrl: SafeUrl;
}

export interface GallerySection {
	query: string;
	page: number;
	photos: Photo[];
}